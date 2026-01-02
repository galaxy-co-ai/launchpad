use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use glob::Pattern;

/// Result of a file search operation
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileSearchResult {
    pub path: String,
    pub is_directory: bool,
    pub size: Option<u64>,
}

/// Result of a grep/content search operation
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GrepResult {
    pub file: String,
    pub line_number: usize,
    pub line_content: String,
}

/// Result of reading a file
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileContent {
    pub path: String,
    pub content: String,
    pub line_count: usize,
    pub truncated: bool,
}

/// List files in a directory (with optional glob pattern)
#[tauri::command]
pub fn list_files(
    base_path: String,
    pattern: Option<String>,
    max_depth: Option<usize>,
) -> Result<Vec<FileSearchResult>, String> {
    let path = Path::new(&base_path);

    if !path.exists() {
        return Err(format!("Path does not exist: {}", base_path));
    }

    let depth = max_depth.unwrap_or(3);
    let mut results = Vec::new();

    let glob_pattern = pattern.as_ref().and_then(|p| Pattern::new(p).ok());

    for entry in WalkDir::new(path)
        .max_depth(depth)
        .into_iter()
        .filter_entry(|e| {
            let name = e.file_name().to_string_lossy();
            // Skip common ignored directories
            !name.starts_with("node_modules")
                && !name.starts_with(".git")
                && !name.starts_with("target")
                && !name.starts_with(".next")
                && !name.starts_with("out")
                && !name.starts_with("dist")
        })
        .filter_map(|e| e.ok())
    {
        let entry_path = entry.path();
        let relative_path = entry_path
            .strip_prefix(path)
            .unwrap_or(entry_path)
            .to_string_lossy()
            .to_string();

        // Skip root directory
        if relative_path.is_empty() {
            continue;
        }

        // Apply glob pattern if provided
        if let Some(ref pat) = glob_pattern {
            if !pat.matches(&relative_path) && !pat.matches(&entry.file_name().to_string_lossy()) {
                continue;
            }
        }

        let metadata = entry.metadata().ok();
        results.push(FileSearchResult {
            path: relative_path,
            is_directory: entry.file_type().is_dir(),
            size: metadata.and_then(|m| if m.is_file() { Some(m.len()) } else { None }),
        });
    }

    // Limit results
    results.truncate(100);
    Ok(results)
}

/// Read file contents
#[tauri::command]
pub fn read_file(
    file_path: String,
    max_lines: Option<usize>,
) -> Result<FileContent, String> {
    let path = Path::new(&file_path);

    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }

    if !path.is_file() {
        return Err(format!("Path is not a file: {}", file_path));
    }

    // Check file size first (limit to 1MB)
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    if metadata.len() > 1_000_000 {
        return Err("File too large (> 1MB). Use grep_files for large files.".to_string());
    }

    let content = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    let lines: Vec<&str> = content.lines().collect();
    let line_count = lines.len();
    let max = max_lines.unwrap_or(500);

    let (final_content, truncated) = if line_count > max {
        (lines[..max].join("\n"), true)
    } else {
        (content, false)
    };

    Ok(FileContent {
        path: file_path,
        content: final_content,
        line_count,
        truncated,
    })
}

/// Search file contents (grep-like)
#[tauri::command]
pub fn grep_files(
    base_path: String,
    search_pattern: String,
    file_pattern: Option<String>,
    max_results: Option<usize>,
) -> Result<Vec<GrepResult>, String> {
    let path = Path::new(&base_path);

    if !path.exists() {
        return Err(format!("Path does not exist: {}", base_path));
    }

    let max = max_results.unwrap_or(50);
    let mut results = Vec::new();
    let search_lower = search_pattern.to_lowercase();

    let file_glob = file_pattern.as_ref().and_then(|p| Pattern::new(p).ok());

    for entry in WalkDir::new(path)
        .max_depth(10)
        .into_iter()
        .filter_entry(|e| {
            let name = e.file_name().to_string_lossy();
            !name.starts_with("node_modules")
                && !name.starts_with(".git")
                && !name.starts_with("target")
                && !name.starts_with(".next")
                && !name.starts_with("out")
                && !name.starts_with("dist")
        })
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
    {
        if results.len() >= max {
            break;
        }

        let entry_path = entry.path();
        let file_name = entry.file_name().to_string_lossy();

        // Apply file pattern filter
        if let Some(ref pat) = file_glob {
            if !pat.matches(&file_name) {
                continue;
            }
        }

        // Skip binary files and very large files
        if let Ok(metadata) = entry.metadata() {
            if metadata.len() > 500_000 {
                continue;
            }
        }

        // Try to read and search the file
        if let Ok(content) = fs::read_to_string(entry_path) {
            for (line_num, line) in content.lines().enumerate() {
                if line.to_lowercase().contains(&search_lower) {
                    let relative_path = entry_path
                        .strip_prefix(path)
                        .unwrap_or(entry_path)
                        .to_string_lossy()
                        .to_string();

                    results.push(GrepResult {
                        file: relative_path,
                        line_number: line_num + 1,
                        line_content: line.chars().take(200).collect(),
                    });

                    if results.len() >= max {
                        break;
                    }
                }
            }
        }
    }

    Ok(results)
}

/// Get directory tree structure
#[tauri::command]
pub fn get_directory_tree(
    base_path: String,
    max_depth: Option<usize>,
) -> Result<String, String> {
    let path = Path::new(&base_path);

    if !path.exists() {
        return Err(format!("Path does not exist: {}", base_path));
    }

    let depth = max_depth.unwrap_or(3);
    let mut tree = String::new();

    build_tree(&path, "", depth, &mut tree, true);

    Ok(tree)
}

fn build_tree(path: &Path, prefix: &str, remaining_depth: usize, output: &mut String, is_last: bool) {
    let name = path.file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| path.to_string_lossy().to_string());

    // Skip ignored directories
    if name.starts_with("node_modules")
        || name.starts_with(".git")
        || name.starts_with("target")
        || name.starts_with(".next")
        || name == "out"
        || name == "dist"
    {
        return;
    }

    let connector = if is_last { "└── " } else { "├── " };
    let display_name = if path.is_dir() {
        format!("{}/", name)
    } else {
        name
    };

    output.push_str(&format!("{}{}{}\n", prefix, connector, display_name));

    if path.is_dir() && remaining_depth > 0 {
        if let Ok(entries) = fs::read_dir(path) {
            let mut entries: Vec<_> = entries
                .filter_map(|e| e.ok())
                .filter(|e| {
                    let name = e.file_name().to_string_lossy().to_string();
                    !name.starts_with("node_modules")
                        && !name.starts_with(".git")
                        && !name.starts_with("target")
                        && !name.starts_with(".next")
                        && name != "out"
                        && name != "dist"
                })
                .collect();

            entries.sort_by(|a, b| {
                let a_is_dir = a.file_type().map(|t| t.is_dir()).unwrap_or(false);
                let b_is_dir = b.file_type().map(|t| t.is_dir()).unwrap_or(false);
                match (a_is_dir, b_is_dir) {
                    (true, false) => std::cmp::Ordering::Less,
                    (false, true) => std::cmp::Ordering::Greater,
                    _ => a.file_name().cmp(&b.file_name()),
                }
            });

            let child_prefix = if is_last {
                format!("{}    ", prefix)
            } else {
                format!("{}│   ", prefix)
            };

            let len = entries.len();
            for (i, entry) in entries.into_iter().enumerate() {
                build_tree(&entry.path(), &child_prefix, remaining_depth - 1, output, i == len - 1);
            }
        }
    }
}
