use crate::db::get_db;
use crate::commands::file_tools::{list_files, read_file, grep_files, get_directory_tree};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Conversation {
    pub id: String,
    pub project_id: Option<String>,
    pub title: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Message {
    pub id: String,
    pub conversation_id: String,
    pub role: String,
    pub content: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatRequest {
    pub conversation_id: Option<String>,
    pub project_id: Option<String>,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatResponse {
    pub conversation_id: String,
    pub message: Message,
}

#[tauri::command]
pub fn list_conversations(
    app_handle: AppHandle,
    project_id: Option<String>,
) -> Result<Vec<Conversation>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut conversations: Vec<Conversation> = Vec::new();

    if let Some(ref pid) = project_id {
        let mut stmt = conn
            .prepare(
                "SELECT id, project_id, title, created_at FROM conversations
                 WHERE project_id = ?1 ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt.query_map([pid], |row| {
            Ok(Conversation {
                id: row.get(0)?,
                project_id: row.get(1)?,
                title: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?;

        for row in rows {
            if let Ok(conv) = row {
                conversations.push(conv);
            }
        }
    } else {
        let mut stmt = conn
            .prepare(
                "SELECT id, project_id, title, created_at FROM conversations
                 WHERE project_id IS NULL ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt.query_map([], |row| {
            Ok(Conversation {
                id: row.get(0)?,
                project_id: row.get(1)?,
                title: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?;

        for row in rows {
            if let Ok(conv) = row {
                conversations.push(conv);
            }
        }
    }

    Ok(conversations)
}

#[tauri::command]
pub fn get_conversation_messages(
    app_handle: AppHandle,
    conversation_id: String,
) -> Result<Vec<Message>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, conversation_id, role, content, created_at
             FROM messages WHERE conversation_id = ?1 ORDER BY created_at ASC",
        )
        .map_err(|e| e.to_string())?;

    let messages = stmt
        .query_map([&conversation_id], |row| {
            Ok(Message {
                id: row.get(0)?,
                conversation_id: row.get(1)?,
                role: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(messages)
}

#[tauri::command]
pub fn create_conversation(
    app_handle: AppHandle,
    project_id: Option<String>,
    title: Option<String>,
) -> Result<Conversation, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();
    let created_at = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO conversations (id, project_id, title, created_at)
         VALUES (?1, ?2, ?3, ?4)",
        (&id, &project_id, &title, &created_at),
    )
    .map_err(|e| e.to_string())?;

    Ok(Conversation {
        id,
        project_id,
        title,
        created_at,
    })
}

#[tauri::command]
pub fn save_message(
    app_handle: AppHandle,
    conversation_id: String,
    role: String,
    content: String,
) -> Result<Message, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();
    let created_at = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO messages (id, conversation_id, role, content, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        (&id, &conversation_id, &role, &content, &created_at),
    )
    .map_err(|e| e.to_string())?;

    // Update conversation title from first user message if not set
    if role == "user" {
        let title_exists: bool = conn
            .query_row(
                "SELECT title IS NOT NULL FROM conversations WHERE id = ?1",
                [&conversation_id],
                |row| row.get(0),
            )
            .unwrap_or(false);

        if !title_exists {
            let short_title = content.chars().take(50).collect::<String>();
            let title = if content.len() > 50 {
                format!("{}...", short_title)
            } else {
                short_title
            };

            conn.execute(
                "UPDATE conversations SET title = ?1 WHERE id = ?2",
                (&title, &conversation_id),
            )
            .ok();
        }
    }

    Ok(Message {
        id,
        conversation_id,
        role,
        content,
        created_at,
    })
}

#[tauri::command]
pub fn delete_conversation(app_handle: AppHandle, id: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM conversations WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Define the tools available to Claude
fn get_tools() -> serde_json::Value {
    serde_json::json!([
        {
            "name": "list_files",
            "description": "List files in a directory. Use this to explore project structure and find files. Automatically excludes node_modules, .git, target, .next, dist, and out directories.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "base_path": {
                        "type": "string",
                        "description": "The base directory path to search in"
                    },
                    "pattern": {
                        "type": "string",
                        "description": "Optional glob pattern to filter files (e.g., '*.ts', '*.tsx', 'src/*')"
                    },
                    "max_depth": {
                        "type": "integer",
                        "description": "Maximum directory depth to search (default: 3)"
                    }
                },
                "required": ["base_path"]
            }
        },
        {
            "name": "read_file",
            "description": "Read the contents of a file. Use this to examine code, configuration files, or documentation.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "file_path": {
                        "type": "string",
                        "description": "The full path to the file to read"
                    },
                    "max_lines": {
                        "type": "integer",
                        "description": "Maximum number of lines to read (default: 500)"
                    }
                },
                "required": ["file_path"]
            }
        },
        {
            "name": "grep_files",
            "description": "Search for text patterns in files. Use this to find specific code, function definitions, imports, or any text pattern across the codebase.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "base_path": {
                        "type": "string",
                        "description": "The base directory path to search in"
                    },
                    "search_pattern": {
                        "type": "string",
                        "description": "The text pattern to search for (case-insensitive)"
                    },
                    "file_pattern": {
                        "type": "string",
                        "description": "Optional glob pattern to filter which files to search (e.g., '*.ts', '*.tsx')"
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return (default: 50)"
                    }
                },
                "required": ["base_path", "search_pattern"]
            }
        },
        {
            "name": "get_directory_tree",
            "description": "Get a visual tree representation of the directory structure. Useful for understanding project layout.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "base_path": {
                        "type": "string",
                        "description": "The base directory path"
                    },
                    "max_depth": {
                        "type": "integer",
                        "description": "Maximum depth of the tree (default: 3)"
                    }
                },
                "required": ["base_path"]
            }
        }
    ])
}

/// Execute a tool call and return the result
fn execute_tool(name: &str, input: &serde_json::Value) -> Result<String, String> {
    match name {
        "list_files" => {
            let base_path = input["base_path"].as_str().ok_or("Missing base_path")?;
            let pattern = input["pattern"].as_str().map(|s| s.to_string());
            let max_depth = input["max_depth"].as_u64().map(|n| n as usize);

            let result = list_files(base_path.to_string(), pattern, max_depth)?;
            serde_json::to_string_pretty(&result).map_err(|e| e.to_string())
        }
        "read_file" => {
            let file_path = input["file_path"].as_str().ok_or("Missing file_path")?;
            let max_lines = input["max_lines"].as_u64().map(|n| n as usize);

            let result = read_file(file_path.to_string(), max_lines)?;
            Ok(format!("File: {}\nLines: {}{}\n\n{}",
                result.path,
                result.line_count,
                if result.truncated { " (truncated)" } else { "" },
                result.content
            ))
        }
        "grep_files" => {
            let base_path = input["base_path"].as_str().ok_or("Missing base_path")?;
            let search_pattern = input["search_pattern"].as_str().ok_or("Missing search_pattern")?;
            let file_pattern = input["file_pattern"].as_str().map(|s| s.to_string());
            let max_results = input["max_results"].as_u64().map(|n| n as usize);

            let result = grep_files(base_path.to_string(), search_pattern.to_string(), file_pattern, max_results)?;

            if result.is_empty() {
                Ok("No matches found.".to_string())
            } else {
                let formatted: Vec<String> = result.iter()
                    .map(|r| format!("{}:{}: {}", r.file, r.line_number, r.line_content))
                    .collect();
                Ok(formatted.join("\n"))
            }
        }
        "get_directory_tree" => {
            let base_path = input["base_path"].as_str().ok_or("Missing base_path")?;
            let max_depth = input["max_depth"].as_u64().map(|n| n as usize);

            get_directory_tree(base_path.to_string(), max_depth)
        }
        _ => Err(format!("Unknown tool: {}", name))
    }
}

#[tauri::command]
pub async fn send_chat_message(
    _app_handle: AppHandle,
    api_key: String,
    messages: Vec<Message>,
    system_prompt: Option<String>,
    project_path: Option<String>,
) -> Result<String, String> {
    let client = reqwest::Client::new();

    let base_system = r#"You are an AI assistant integrated into Launchpad, a Micro-SaaS shipping framework.
You help developers build and ship products using a structured SOP (Standard Operating Procedure) system.

Your capabilities:
- Search and read files in linked project directories
- Analyze codebases to understand architecture and patterns
- Track progress through the SOP pipeline (13 phases from Idea to Launch)
- Provide guidance on tech stack decisions (Next.js, Tailwind, Clerk, Neon, Drizzle, Stripe, Vercel)
- Help with code reviews, architecture decisions, and best practices

You have access to file tools to explore and read project files. When the user asks about code, features, or wants you to find something, USE THE TOOLS to search and read the actual files. Don't just make assumptions - look at the code.

Be concise, technical, and action-oriented. When you identify actionable items, be specific about what needs to be done."#;

    let system = if let Some(ref path) = project_path {
        format!("{}\n\nCurrent project path: {}", base_system, path)
    } else if let Some(custom) = system_prompt {
        custom
    } else {
        base_system.to_string()
    };

    // Only include tools if we have a project path
    let tools = if project_path.is_some() {
        Some(get_tools())
    } else {
        None
    };

    // Convert messages to API format
    let mut api_messages: Vec<serde_json::Value> = messages
        .iter()
        .map(|m| {
            serde_json::json!({
                "role": m.role,
                "content": m.content
            })
        })
        .collect();

    // Loop to handle tool use
    let max_iterations = 10;
    for _ in 0..max_iterations {
        let mut body = serde_json::json!({
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 4096,
            "system": system,
            "messages": api_messages
        });

        if let Some(ref t) = tools {
            body["tools"] = t.clone();
        }

        let response = client
            .post("https://api.anthropic.com/v1/messages")
            .header("Content-Type", "application/json")
            .header("x-api-key", &api_key)
            .header("anthropic-version", "2023-06-01")
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(format!("API error: {}", error_text));
        }

        let json: serde_json::Value = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        let stop_reason = json["stop_reason"].as_str().unwrap_or("");

        // If it's a tool use response, execute tools and continue
        if stop_reason == "tool_use" {
            let content = json["content"].as_array().ok_or("No content in response")?;

            // Collect all content blocks (text + tool_use)
            let mut tool_results = Vec::new();
            let mut assistant_content = Vec::new();

            for block in content {
                let block_type = block["type"].as_str().unwrap_or("");

                if block_type == "text" {
                    assistant_content.push(block.clone());
                } else if block_type == "tool_use" {
                    assistant_content.push(block.clone());

                    let tool_name = block["name"].as_str().unwrap_or("");
                    let tool_id = block["id"].as_str().unwrap_or("");
                    let tool_input = &block["input"];

                    // Execute the tool
                    let result = match execute_tool(tool_name, tool_input) {
                        Ok(r) => r,
                        Err(e) => format!("Error: {}", e)
                    };

                    tool_results.push(serde_json::json!({
                        "type": "tool_result",
                        "tool_use_id": tool_id,
                        "content": result
                    }));
                }
            }

            // Add assistant's response with tool calls
            api_messages.push(serde_json::json!({
                "role": "assistant",
                "content": assistant_content
            }));

            // Add tool results as user message
            api_messages.push(serde_json::json!({
                "role": "user",
                "content": tool_results
            }));

            continue;
        }

        // Extract final text response
        let content = json["content"].as_array().ok_or("No content in response")?;
        let mut text_parts = Vec::new();

        for block in content {
            if block["type"].as_str() == Some("text") {
                if let Some(text) = block["text"].as_str() {
                    text_parts.push(text.to_string());
                }
            }
        }

        return Ok(text_parts.join("\n"));
    }

    Err("Max tool iterations reached".to_string())
}
