use crate::db::get_db;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::AppHandle;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectAnalysis {
    pub project_path: String,
    pub tech_stack: Vec<String>,
    pub frameworks: Vec<String>,
    pub has_git: bool,
    pub has_tests: bool,
    pub has_ci: bool,
    pub has_env_example: bool,
    pub file_count: usize,
    pub directory_structure: Vec<String>,
    pub detected_services: Vec<String>,
    pub package_json: Option<PackageJsonInfo>,
    pub cargo_toml: Option<CargoTomlInfo>,
    pub recommendations: Vec<String>,
    pub sop_progress: SopProgress,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PackageJsonInfo {
    pub name: Option<String>,
    pub dependencies: Vec<String>,
    pub dev_dependencies: Vec<String>,
    pub scripts: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CargoTomlInfo {
    pub name: Option<String>,
    pub dependencies: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SopProgress {
    pub estimated_phase: i32,
    pub phase_name: String,
    pub evidence: Vec<String>,
}

fn detect_tech_stack(path: &Path) -> (Vec<String>, Vec<String>) {
    let mut tech = Vec::new();
    let mut frameworks = Vec::new();

    // Check for common files
    if path.join("package.json").exists() {
        tech.push("Node.js".to_string());
    }
    if path.join("Cargo.toml").exists() {
        tech.push("Rust".to_string());
    }
    if path.join("requirements.txt").exists() || path.join("pyproject.toml").exists() {
        tech.push("Python".to_string());
    }
    if path.join("go.mod").exists() {
        tech.push("Go".to_string());
    }

    // Check for frameworks
    if path.join("next.config.js").exists()
        || path.join("next.config.ts").exists()
        || path.join("next.config.mjs").exists()
    {
        frameworks.push("Next.js".to_string());
    }
    if path.join("src-tauri").exists() {
        frameworks.push("Tauri".to_string());
    }
    if path.join("tailwind.config.js").exists()
        || path.join("tailwind.config.ts").exists()
        || path.join("postcss.config.mjs").exists()
    {
        frameworks.push("Tailwind CSS".to_string());
    }
    if path.join("drizzle.config.ts").exists() {
        frameworks.push("Drizzle ORM".to_string());
    }
    if path.join("prisma").exists() {
        frameworks.push("Prisma".to_string());
    }

    (tech, frameworks)
}

fn detect_services(path: &Path) -> Vec<String> {
    let mut services = Vec::new();

    // Check for common service integrations
    if let Ok(content) = fs::read_to_string(path.join("package.json")) {
        if content.contains("@clerk") {
            services.push("Clerk (Auth)".to_string());
        }
        if content.contains("stripe") {
            services.push("Stripe (Payments)".to_string());
        }
        if content.contains("@sentry") {
            services.push("Sentry (Error Tracking)".to_string());
        }
        if content.contains("@upstash") {
            services.push("Upstash".to_string());
        }
        if content.contains("@neondatabase") || content.contains("neon") {
            services.push("Neon (PostgreSQL)".to_string());
        }
        if content.contains("@vercel") {
            services.push("Vercel".to_string());
        }
    }

    // Check env files for service hints
    for env_file in &[".env", ".env.example", ".env.local"] {
        if let Ok(content) = fs::read_to_string(path.join(env_file)) {
            if content.contains("CLERK") && !services.contains(&"Clerk (Auth)".to_string()) {
                services.push("Clerk (Auth)".to_string());
            }
            if content.contains("STRIPE") && !services.contains(&"Stripe (Payments)".to_string()) {
                services.push("Stripe (Payments)".to_string());
            }
            if content.contains("DATABASE_URL")
                && !services.iter().any(|s| s.contains("PostgreSQL"))
            {
                services.push("PostgreSQL".to_string());
            }
            if content.contains("ANTHROPIC") {
                services.push("Anthropic (AI)".to_string());
            }
            if content.contains("OPENAI") {
                services.push("OpenAI".to_string());
            }
        }
    }

    services
}

fn estimate_sop_phase(analysis: &ProjectAnalysis) -> SopProgress {
    let mut evidence = Vec::new();
    let mut phase = 0;

    // SOP 05-06: Project Setup & Infrastructure
    if !analysis.tech_stack.is_empty() {
        phase = 5;
        evidence.push("Project scaffolded with tech stack".to_string());
    }

    if !analysis.detected_services.is_empty() {
        phase = 6;
        evidence.push(format!(
            "Services configured: {}",
            analysis.detected_services.join(", ")
        ));
    }

    // SOP 07: Development
    if analysis.file_count > 20 {
        phase = 7;
        evidence.push(format!("{} files in project", analysis.file_count));
    }

    // SOP 08: Testing
    if analysis.has_tests {
        phase = 8;
        evidence.push("Test files detected".to_string());
    }

    // SOP 09-10: Pre-ship / Launch
    if analysis.has_ci && analysis.has_env_example {
        phase = 9;
        evidence.push("CI/CD and env documentation present".to_string());
    }

    let phase_names = [
        "Idea Intake",
        "Quick Validation",
        "MVP Scope Lock",
        "Revenue Model Lock",
        "Design Brief",
        "Project Setup",
        "Infrastructure",
        "Development",
        "Testing & QA",
        "Pre-Ship Checklist",
        "Launch Day",
        "Post-Launch Monitoring",
        "Marketing Activation",
    ];

    SopProgress {
        estimated_phase: phase,
        phase_name: phase_names
            .get(phase as usize)
            .unwrap_or(&"Unknown")
            .to_string(),
        evidence,
    }
}

fn generate_recommendations(analysis: &ProjectAnalysis) -> Vec<String> {
    let mut recs = Vec::new();

    if !analysis.has_env_example {
        recs.push("Add .env.example file to document required environment variables".to_string());
    }

    if !analysis.has_tests {
        recs.push("Add tests to ensure code quality before shipping".to_string());
    }

    if !analysis.has_ci {
        recs.push(
            "Set up CI/CD pipeline (GitHub Actions, Vercel) for automated deployments".to_string(),
        );
    }

    if !analysis.detected_services.iter().any(|s| s.contains("Auth")) {
        recs.push("Consider adding authentication (Clerk recommended)".to_string());
    }

    if !analysis
        .detected_services
        .iter()
        .any(|s| s.contains("Payments"))
    {
        recs.push("Set up payment processing (Stripe) for monetization".to_string());
    }

    if !analysis
        .detected_services
        .iter()
        .any(|s| s.contains("Error"))
    {
        recs.push("Add error tracking (Sentry) for production monitoring".to_string());
    }

    recs
}

#[tauri::command]
pub fn analyze_project(app_handle: AppHandle, path: String) -> Result<ProjectAnalysis, String> {
    let project_path = Path::new(&path);

    if !project_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if !project_path.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }

    let (tech_stack, frameworks) = detect_tech_stack(project_path);
    let detected_services = detect_services(project_path);

    let has_git = project_path.join(".git").exists();
    let has_env_example = project_path.join(".env.example").exists();

    // Check for tests
    let has_tests = project_path.join("tests").exists()
        || project_path.join("__tests__").exists()
        || project_path.join("test").exists()
        || WalkDir::new(project_path)
            .max_depth(3)
            .into_iter()
            .filter_map(|e| e.ok())
            .any(|e| {
                let name = e.file_name().to_string_lossy();
                name.ends_with(".test.ts")
                    || name.ends_with(".test.tsx")
                    || name.ends_with(".spec.ts")
                    || name.ends_with("_test.rs")
            });

    // Check for CI
    let has_ci = project_path.join(".github/workflows").exists()
        || project_path.join("vercel.json").exists()
        || project_path.join(".gitlab-ci.yml").exists();

    // Count files (excluding node_modules, .git, target)
    let file_count = WalkDir::new(project_path)
        .into_iter()
        .filter_entry(|e| {
            let name = e.file_name().to_string_lossy();
            !name.starts_with("node_modules")
                && !name.starts_with(".git")
                && !name.starts_with("target")
                && !name.starts_with(".next")
                && !name.starts_with("out")
        })
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .count();

    // Get top-level directory structure
    let directory_structure: Vec<String> = fs::read_dir(project_path)
        .map(|entries| {
            entries
                .filter_map(|e| e.ok())
                .map(|e| {
                    let name = e.file_name().to_string_lossy().to_string();
                    if e.file_type().map(|t| t.is_dir()).unwrap_or(false) {
                        format!("{}/", name)
                    } else {
                        name
                    }
                })
                .filter(|n| !n.starts_with(".git") && n != "node_modules/")
                .collect()
        })
        .unwrap_or_default();

    // Parse package.json if exists
    let package_json = if let Ok(content) = fs::read_to_string(project_path.join("package.json")) {
        serde_json::from_str::<serde_json::Value>(&content)
            .ok()
            .map(|json| PackageJsonInfo {
                name: json["name"].as_str().map(|s| s.to_string()),
                dependencies: json["dependencies"]
                    .as_object()
                    .map(|o| o.keys().cloned().collect())
                    .unwrap_or_default(),
                dev_dependencies: json["devDependencies"]
                    .as_object()
                    .map(|o| o.keys().cloned().collect())
                    .unwrap_or_default(),
                scripts: json["scripts"]
                    .as_object()
                    .map(|o| o.keys().cloned().collect())
                    .unwrap_or_default(),
            })
    } else {
        None
    };

    // Parse Cargo.toml if exists
    let cargo_toml = if let Ok(content) = fs::read_to_string(project_path.join("Cargo.toml")) {
        // Simple parsing - just extract name and dependencies
        let name = content
            .lines()
            .find(|l| l.starts_with("name"))
            .and_then(|l| l.split('=').nth(1))
            .map(|s| s.trim().trim_matches('"').to_string());

        let deps: Vec<String> = content
            .lines()
            .skip_while(|l| !l.contains("[dependencies]"))
            .skip(1)
            .take_while(|l| !l.starts_with('['))
            .filter(|l| l.contains('='))
            .map(|l| l.split('=').next().unwrap_or("").trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        Some(CargoTomlInfo {
            name,
            dependencies: deps,
        })
    } else {
        None
    };

    let mut analysis = ProjectAnalysis {
        project_path: path.clone(),
        tech_stack,
        frameworks,
        has_git,
        has_tests,
        has_ci,
        has_env_example,
        file_count,
        directory_structure,
        detected_services,
        package_json,
        cargo_toml,
        recommendations: Vec::new(),
        sop_progress: SopProgress {
            estimated_phase: 0,
            phase_name: "Unknown".to_string(),
            evidence: Vec::new(),
        },
    };

    analysis.sop_progress = estimate_sop_phase(&analysis);
    analysis.recommendations = generate_recommendations(&analysis);

    Ok(analysis)
}

#[tauri::command]
pub fn save_project_analysis(
    app_handle: AppHandle,
    project_id: String,
    analysis: ProjectAnalysis,
) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let status_report = serde_json::to_string(&analysis).map_err(|e| e.to_string())?;
    let last_analyzed = Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE projects SET status_report = ?1, last_analyzed = ?2, current_phase = ?3 WHERE id = ?4",
        (&status_report, &last_analyzed, analysis.sop_progress.estimated_phase, &project_id),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
