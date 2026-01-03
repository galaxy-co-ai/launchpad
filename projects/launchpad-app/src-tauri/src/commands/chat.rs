use crate::db::get_db;
use crate::commands::file_tools::{list_files, read_file, grep_files, get_directory_tree};
use crate::commands::artifacts::{
    create_idea_file, update_idea_file, create_contract_file, 
    create_revenue_file, create_design_file, move_idea_file, list_vault_artifacts,
    CreateIdeaFileInput, UpdateIdeaFileInput, CreateContractFileInput,
    CreateRevenueFileInput, CreateDesignFileInput, DesignFeature,
};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Conversation {
    pub id: String,
    pub project_id: Option<String>,
    pub idea_id: Option<String>,
    pub title: Option<String>,
    pub session_summary: Option<String>,
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
                "SELECT id, project_id, idea_id, title, session_summary, created_at FROM conversations
                 WHERE project_id = ?1 ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt.query_map([pid], |row| {
            Ok(Conversation {
                id: row.get(0)?,
                project_id: row.get(1)?,
                idea_id: row.get(2)?,
                title: row.get(3)?,
                session_summary: row.get(4)?,
                created_at: row.get(5)?,
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
                "SELECT id, project_id, idea_id, title, session_summary, created_at FROM conversations
                 WHERE project_id IS NULL ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt.query_map([], |row| {
            Ok(Conversation {
                id: row.get(0)?,
                project_id: row.get(1)?,
                idea_id: row.get(2)?,
                title: row.get(3)?,
                session_summary: row.get(4)?,
                created_at: row.get(5)?,
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

/// List conversations for an idea
#[tauri::command]
pub fn list_idea_conversations(
    app_handle: AppHandle,
    idea_id: String,
) -> Result<Vec<Conversation>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, idea_id, title, session_summary, created_at FROM conversations
             WHERE idea_id = ?1 ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let conversations: Vec<Conversation> = stmt
        .query_map([&idea_id], |row| {
            Ok(Conversation {
                id: row.get(0)?,
                project_id: row.get(1)?,
                idea_id: row.get(2)?,
                title: row.get(3)?,
                session_summary: row.get(4)?,
                created_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

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
    create_conversation_with_idea(app_handle, project_id, None, title)
}

#[tauri::command]
pub fn create_conversation_with_idea(
    app_handle: AppHandle,
    project_id: Option<String>,
    idea_id: Option<String>,
    title: Option<String>,
) -> Result<Conversation, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();
    let created_at = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO conversations (id, project_id, idea_id, title, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        (&id, &project_id, &idea_id, &title, &created_at),
    )
    .map_err(|e| e.to_string())?;

    Ok(Conversation {
        id,
        project_id,
        idea_id,
        title,
        session_summary: None,
        created_at,
    })
}

/// Link an existing conversation to an idea
#[tauri::command]
pub fn link_conversation_to_idea(
    app_handle: AppHandle,
    conversation_id: String,
    idea_id: String,
) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE conversations SET idea_id = ?1 WHERE id = ?2",
        (&idea_id, &conversation_id),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

/// Save a session summary for a conversation
#[tauri::command]
pub fn save_session_summary(
    app_handle: AppHandle,
    conversation_id: String,
    summary: String,
) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE conversations SET session_summary = ?1 WHERE id = ?2",
        (&summary, &conversation_id),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

/// Get conversation with its linked idea context
#[tauri::command]
pub fn get_conversation_with_context(
    app_handle: AppHandle,
    conversation_id: String,
) -> Result<ConversationWithContext, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let conversation: Conversation = conn
        .query_row(
            "SELECT id, project_id, idea_id, title, session_summary, created_at FROM conversations WHERE id = ?1",
            [&conversation_id],
            |row| {
                Ok(Conversation {
                    id: row.get(0)?,
                    project_id: row.get(1)?,
                    idea_id: row.get(2)?,
                    title: row.get(3)?,
                    session_summary: row.get(4)?,
                    created_at: row.get(5)?,
                })
            },
        )
        .map_err(|e| format!("Conversation not found: {}", e))?;

    // Get idea name if linked
    let idea_name: Option<String> = if let Some(ref idea_id) = conversation.idea_id {
        conn.query_row(
            "SELECT name FROM ideas WHERE id = ?1",
            [idea_id],
            |row| row.get(0),
        )
        .ok()
    } else {
        None
    };

    // Get workflow context if idea is linked
    let workflow_context: Option<String> = if let Some(ref idea_id) = conversation.idea_id {
        // We need to drop the lock to call generate_ai_context
        drop(conn);
        crate::commands::workflow::generate_ai_context(app_handle.clone(), idea_id.clone()).ok().flatten()
    } else {
        None
    };

    Ok(ConversationWithContext {
        conversation,
        idea_name,
        workflow_context,
    })
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConversationWithContext {
    pub conversation: Conversation,
    pub idea_name: Option<String>,
    pub workflow_context: Option<String>,
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
        },
        {
            "name": "create_idea_file",
            "description": "Create a new idea file in the vault. Use this when the user has completed the idea intake process and you need to save their idea.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The name/title of the idea"
                    },
                    "problem_statement": {
                        "type": "string",
                        "description": "The core problem this idea solves"
                    },
                    "proposed_solution": {
                        "type": "string",
                        "description": "The proposed solution (one paragraph)"
                    },
                    "source": {
                        "type": "string",
                        "description": "Where the idea came from (personal_pain, customer_feedback, competitor_gap, etc.)"
                    },
                    "source_details": {
                        "type": "string",
                        "description": "Additional details about the source"
                    },
                    "who_has_problem": {
                        "type": "string",
                        "description": "Who experiences this problem"
                    },
                    "pain_description": {
                        "type": "string",
                        "description": "Description of the pain this causes"
                    },
                    "current_solution": {
                        "type": "string",
                        "description": "How people currently solve this problem"
                    },
                    "searched_for_solutions": {
                        "type": "boolean",
                        "description": "Whether user has searched for existing solutions"
                    },
                    "would_you_pay": {
                        "type": "string",
                        "description": "Whether user would pay for this (yes/maybe/no)"
                    },
                    "price_point_guess": {
                        "type": "string",
                        "description": "Estimated price point"
                    },
                    "know_someone_with_pain": {
                        "type": "boolean",
                        "description": "Whether user knows someone with this pain"
                    },
                    "is_painful": {
                        "type": "boolean",
                        "description": "Triage: Is this a painful problem?"
                    },
                    "is_feasible": {
                        "type": "boolean",
                        "description": "Triage: Is this technically feasible?"
                    },
                    "can_generate_revenue": {
                        "type": "boolean",
                        "description": "Triage: Can this generate revenue in 30 days?"
                    },
                    "additional_notes": {
                        "type": "string",
                        "description": "Any additional notes, links, or context"
                    }
                },
                "required": ["name", "problem_statement", "proposed_solution", "source"]
            }
        },
        {
            "name": "update_idea_file",
            "description": "Update an existing idea file in the vault. Use this to add validation scores, update status, or add additional information.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slug": {
                        "type": "string",
                        "description": "The slug of the idea file (e.g., 'ai-invoice-generator')"
                    },
                    "field": {
                        "type": "string",
                        "description": "The field to update (e.g., 'status', 'validation_score')"
                    },
                    "value": {
                        "type": "string",
                        "description": "The new value for the field"
                    }
                },
                "required": ["slug", "field", "value"]
            }
        },
        {
            "name": "create_contract_file",
            "description": "Create an MVP Contract file in the vault. Use this after scope is locked (SOP-02).",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slug": {
                        "type": "string",
                        "description": "The slug for the contract (should match idea slug)"
                    },
                    "product_name": {
                        "type": "string",
                        "description": "The product name"
                    },
                    "value_proposition": {
                        "type": "string",
                        "description": "Users can [ACTION] so that [BENEFIT]"
                    },
                    "bar_napkin_pitch": {
                        "type": "string",
                        "description": "10-second explanation of what this does"
                    },
                    "features": {
                        "type": "array",
                        "items": { "type": "string" },
                        "description": "List of P0 features (max 5)"
                    },
                    "non_goals": {
                        "type": "array",
                        "items": { "type": "string" },
                        "description": "List of explicit non-goals (at least 5)"
                    },
                    "launch_day_customers": {
                        "type": "integer",
                        "description": "Target customers on launch day"
                    },
                    "launch_day_revenue": {
                        "type": "integer",
                        "description": "Target revenue on launch day"
                    },
                    "thirty_day_revenue": {
                        "type": "integer",
                        "description": "Target revenue in first 30 days"
                    },
                    "thirty_day_active_users": {
                        "type": "integer",
                        "description": "Target active users in 30 days"
                    },
                    "thirty_day_churn_target": {
                        "type": "integer",
                        "description": "Max churn rate percentage"
                    },
                    "price_point": {
                        "type": "number",
                        "description": "Price per period"
                    },
                    "customers_needed_30_day": {
                        "type": "integer",
                        "description": "Customers needed for 30-day target"
                    }
                },
                "required": ["slug", "product_name", "value_proposition", "bar_napkin_pitch", "features", "non_goals", "launch_day_customers", "thirty_day_revenue", "price_point", "customers_needed_30_day"]
            }
        },
        {
            "name": "create_revenue_file",
            "description": "Create a Revenue Model file in the vault. Use this after revenue model is locked (SOP-03).",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slug": { "type": "string", "description": "The slug for the file" },
                    "product_name": { "type": "string", "description": "Product name" },
                    "revenue_model": { "type": "string", "description": "Model type (subscription_monthly, one_time, etc.)" },
                    "model_reasoning": { "type": "string", "description": "Why this model fits" },
                    "price": { "type": "number", "description": "Price amount" },
                    "price_period": { "type": "string", "description": "Period (month, year, lifetime)" },
                    "annual_discount": { "type": "integer", "description": "Annual discount percentage" },
                    "competitor_a": { "type": "string", "description": "Competitor A pricing" },
                    "competitor_b": { "type": "string", "description": "Competitor B pricing" },
                    "positioning": { "type": "string", "description": "premium, mid_market, or budget" },
                    "value_delivered": { "type": "string", "description": "Value description" },
                    "trial_type": { "type": "string", "description": "none, 7_day, 14_day, etc." },
                    "trial_reasoning": { "type": "string", "description": "Why this trial strategy" },
                    "entry_point": { "type": "string", "description": "How users arrive" },
                    "paywall_trigger": { "type": "string", "description": "What triggers the paywall" },
                    "cta_text": { "type": "string", "description": "CTA button text" },
                    "payment_method": { "type": "string", "description": "stripe_checkout, stripe_embedded, etc." },
                    "access_grant": { "type": "string", "description": "When access is granted" },
                    "refund_policy": { "type": "string", "description": "Refund policy type" },
                    "refund_conditions": { "type": "string", "description": "Refund conditions" },
                    "launch_day_revenue": { "type": "integer" },
                    "thirty_day_revenue": { "type": "integer" },
                    "ninety_day_revenue": { "type": "integer" },
                    "launch_day_customers": { "type": "integer" },
                    "thirty_day_customers": { "type": "integer" },
                    "ninety_day_customers": { "type": "integer" }
                },
                "required": ["slug", "product_name", "revenue_model", "model_reasoning", "price", "price_period", "trial_type", "paywall_trigger", "refund_policy", "thirty_day_revenue"]
            }
        },
        {
            "name": "create_design_file",
            "description": "Create a Design Brief file in the vault. Use this after design brief is complete (SOP-04).",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slug": { "type": "string", "description": "The slug for the file" },
                    "product_name": { "type": "string", "description": "Product name" },
                    "entry_point": { "type": "string", "description": "User flow: entry point" },
                    "hook_point": { "type": "string", "description": "User flow: hook" },
                    "value_point": { "type": "string", "description": "User flow: value delivery" },
                    "convert_point": { "type": "string", "description": "User flow: conversion" },
                    "success_point": { "type": "string", "description": "User flow: success" },
                    "screens": { "type": "array", "items": { "type": "string" }, "description": "List of screens" },
                    "hero_headline": { "type": "string", "description": "Landing page headline" },
                    "hero_subheadline": { "type": "string", "description": "Landing page subheadline" },
                    "hero_cta": { "type": "string", "description": "CTA button text" },
                    "hero_visual": { "type": "string", "description": "Description of hero visual" },
                    "features": { 
                        "type": "array", 
                        "items": { 
                            "type": "object",
                            "properties": {
                                "icon": { "type": "string" },
                                "headline": { "type": "string" },
                                "description": { "type": "string" }
                            }
                        },
                        "description": "Feature list with icons" 
                    },
                    "pricing_display": { "type": "string", "description": "How pricing is displayed" },
                    "pricing_includes": { "type": "string", "description": "What's included" },
                    "pricing_cta": { "type": "string", "description": "Pricing CTA text" },
                    "core_interaction": { "type": "string", "description": "Main feature interaction" },
                    "form_submit_pattern": { "type": "string", "description": "Form submit pattern" },
                    "error_pattern": { "type": "string", "description": "Error handling pattern" },
                    "loading_pattern": { "type": "string", "description": "Loading state pattern" },
                    "components": { "type": "array", "items": { "type": "string" }, "description": "shadcn components needed" },
                    "layout_choice": { "type": "string", "description": "Layout type" },
                    "breakpoint_notes": { "type": "string", "description": "Responsive notes" },
                    "additional_notes": { "type": "string", "description": "Additional design notes" }
                },
                "required": ["slug", "product_name", "entry_point", "hook_point", "value_point", "convert_point", "success_point", "screens", "hero_headline", "hero_cta"]
            }
        },
        {
            "name": "move_idea_file",
            "description": "Move an idea file between vault directories (backlog, active, killed). Use this when an idea's status changes after validation.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slug": {
                        "type": "string",
                        "description": "The slug of the idea file"
                    },
                    "destination": {
                        "type": "string",
                        "description": "Destination directory: 'active', 'killed', or 'backlog'"
                    }
                },
                "required": ["slug", "destination"]
            }
        },
        {
            "name": "list_vault_artifacts",
            "description": "List all artifacts in the vault (ideas, contracts, revenue models, design briefs). Use this to see what documents exist.",
            "input_schema": {
                "type": "object",
                "properties": {},
                "required": []
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
        "create_idea_file" => {
            let idea_input = CreateIdeaFileInput {
                name: input["name"].as_str().ok_or("Missing name")?.to_string(),
                problem_statement: input["problem_statement"].as_str().ok_or("Missing problem_statement")?.to_string(),
                proposed_solution: input["proposed_solution"].as_str().ok_or("Missing proposed_solution")?.to_string(),
                source: input["source"].as_str().ok_or("Missing source")?.to_string(),
                source_details: input["source_details"].as_str().map(|s| s.to_string()),
                who_has_problem: input["who_has_problem"].as_str().map(|s| s.to_string()),
                pain_description: input["pain_description"].as_str().map(|s| s.to_string()),
                current_solution: input["current_solution"].as_str().map(|s| s.to_string()),
                searched_for_solutions: input["searched_for_solutions"].as_bool(),
                would_you_pay: input["would_you_pay"].as_str().map(|s| s.to_string()),
                price_point_guess: input["price_point_guess"].as_str().map(|s| s.to_string()),
                know_someone_with_pain: input["know_someone_with_pain"].as_bool(),
                is_painful: input["is_painful"].as_bool(),
                is_feasible: input["is_feasible"].as_bool(),
                can_generate_revenue: input["can_generate_revenue"].as_bool(),
                additional_notes: input["additional_notes"].as_str().map(|s| s.to_string()),
            };
            
            let result = create_idea_file(idea_input)?;
            Ok(format!("✅ {}\nFile: {}", result.message, result.file_path))
        }
        "update_idea_file" => {
            let update_input = UpdateIdeaFileInput {
                slug: input["slug"].as_str().ok_or("Missing slug")?.to_string(),
                field: input["field"].as_str().ok_or("Missing field")?.to_string(),
                value: input["value"].as_str().ok_or("Missing value")?.to_string(),
            };
            
            let result = update_idea_file(update_input)?;
            Ok(format!("✅ {}\nFile: {}", result.message, result.file_path))
        }
        "create_contract_file" => {
            let features: Vec<String> = input["features"]
                .as_array()
                .ok_or("Missing features")?
                .iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect();
            
            let non_goals: Vec<String> = input["non_goals"]
                .as_array()
                .ok_or("Missing non_goals")?
                .iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect();
            
            let contract_input = CreateContractFileInput {
                slug: input["slug"].as_str().ok_or("Missing slug")?.to_string(),
                product_name: input["product_name"].as_str().ok_or("Missing product_name")?.to_string(),
                value_proposition: input["value_proposition"].as_str().ok_or("Missing value_proposition")?.to_string(),
                bar_napkin_pitch: input["bar_napkin_pitch"].as_str().ok_or("Missing bar_napkin_pitch")?.to_string(),
                features,
                non_goals,
                launch_day_customers: input["launch_day_customers"].as_i64().ok_or("Missing launch_day_customers")? as i32,
                launch_day_revenue: input["launch_day_revenue"].as_i64().unwrap_or(0) as i32,
                thirty_day_revenue: input["thirty_day_revenue"].as_i64().ok_or("Missing thirty_day_revenue")? as i32,
                thirty_day_active_users: input["thirty_day_active_users"].as_i64().unwrap_or(10) as i32,
                thirty_day_churn_target: input["thirty_day_churn_target"].as_i64().unwrap_or(20) as i32,
                price_point: input["price_point"].as_f64().ok_or("Missing price_point")?,
                customers_needed_30_day: input["customers_needed_30_day"].as_i64().ok_or("Missing customers_needed_30_day")? as i32,
            };
            
            let result = create_contract_file(contract_input)?;
            Ok(format!("✅ {}\nFile: {}", result.message, result.file_path))
        }
        "create_revenue_file" => {
            let revenue_input = CreateRevenueFileInput {
                slug: input["slug"].as_str().ok_or("Missing slug")?.to_string(),
                product_name: input["product_name"].as_str().ok_or("Missing product_name")?.to_string(),
                revenue_model: input["revenue_model"].as_str().ok_or("Missing revenue_model")?.to_string(),
                model_reasoning: input["model_reasoning"].as_str().ok_or("Missing model_reasoning")?.to_string(),
                price: input["price"].as_f64().ok_or("Missing price")?,
                price_period: input["price_period"].as_str().ok_or("Missing price_period")?.to_string(),
                annual_discount: input["annual_discount"].as_i64().map(|n| n as i32),
                competitor_a: input["competitor_a"].as_str().unwrap_or("Not specified").to_string(),
                competitor_b: input["competitor_b"].as_str().unwrap_or("Not specified").to_string(),
                positioning: input["positioning"].as_str().unwrap_or("mid_market").to_string(),
                value_delivered: input["value_delivered"].as_str().unwrap_or("Not specified").to_string(),
                trial_type: input["trial_type"].as_str().ok_or("Missing trial_type")?.to_string(),
                trial_reasoning: input["trial_reasoning"].as_str().unwrap_or("Not specified").to_string(),
                entry_point: input["entry_point"].as_str().unwrap_or("landing_page").to_string(),
                paywall_trigger: input["paywall_trigger"].as_str().ok_or("Missing paywall_trigger")?.to_string(),
                cta_text: input["cta_text"].as_str().unwrap_or("Get Started").to_string(),
                payment_method: input["payment_method"].as_str().unwrap_or("stripe_checkout").to_string(),
                access_grant: input["access_grant"].as_str().unwrap_or("immediate").to_string(),
                refund_policy: input["refund_policy"].as_str().ok_or("Missing refund_policy")?.to_string(),
                refund_conditions: input["refund_conditions"].as_str().map(|s| s.to_string()),
                launch_day_revenue: input["launch_day_revenue"].as_i64().unwrap_or(0) as i32,
                thirty_day_revenue: input["thirty_day_revenue"].as_i64().ok_or("Missing thirty_day_revenue")? as i32,
                ninety_day_revenue: input["ninety_day_revenue"].as_i64().unwrap_or(0) as i32,
                launch_day_customers: input["launch_day_customers"].as_i64().unwrap_or(1) as i32,
                thirty_day_customers: input["thirty_day_customers"].as_i64().unwrap_or(10) as i32,
                ninety_day_customers: input["ninety_day_customers"].as_i64().unwrap_or(50) as i32,
            };
            
            let result = create_revenue_file(revenue_input)?;
            Ok(format!("✅ {}\nFile: {}", result.message, result.file_path))
        }
        "create_design_file" => {
            let screens: Vec<String> = input["screens"]
                .as_array()
                .ok_or("Missing screens")?
                .iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect();
            
            let features: Vec<DesignFeature> = input["features"]
                .as_array()
                .map(|arr| {
                    arr.iter()
                        .filter_map(|v| {
                            Some(DesignFeature {
                                icon: v["icon"].as_str()?.to_string(),
                                headline: v["headline"].as_str()?.to_string(),
                                description: v["description"].as_str()?.to_string(),
                            })
                        })
                        .collect()
                })
                .unwrap_or_default();
            
            let components: Vec<String> = input["components"]
                .as_array()
                .map(|arr| arr.iter().filter_map(|v| v.as_str().map(|s| s.to_string())).collect())
                .unwrap_or_default();
            
            let design_input = CreateDesignFileInput {
                slug: input["slug"].as_str().ok_or("Missing slug")?.to_string(),
                product_name: input["product_name"].as_str().ok_or("Missing product_name")?.to_string(),
                entry_point: input["entry_point"].as_str().ok_or("Missing entry_point")?.to_string(),
                hook_point: input["hook_point"].as_str().ok_or("Missing hook_point")?.to_string(),
                value_point: input["value_point"].as_str().ok_or("Missing value_point")?.to_string(),
                convert_point: input["convert_point"].as_str().ok_or("Missing convert_point")?.to_string(),
                success_point: input["success_point"].as_str().ok_or("Missing success_point")?.to_string(),
                screens,
                hero_headline: input["hero_headline"].as_str().ok_or("Missing hero_headline")?.to_string(),
                hero_subheadline: input["hero_subheadline"].as_str().unwrap_or("").to_string(),
                hero_cta: input["hero_cta"].as_str().ok_or("Missing hero_cta")?.to_string(),
                hero_visual: input["hero_visual"].as_str().unwrap_or("").to_string(),
                features,
                pricing_display: input["pricing_display"].as_str().unwrap_or("single_card").to_string(),
                pricing_includes: input["pricing_includes"].as_str().unwrap_or("").to_string(),
                pricing_cta: input["pricing_cta"].as_str().unwrap_or("Get Started").to_string(),
                core_interaction: input["core_interaction"].as_str().unwrap_or("").to_string(),
                form_submit_pattern: input["form_submit_pattern"].as_str().unwrap_or("Click submit → Loading → Success toast").to_string(),
                error_pattern: input["error_pattern"].as_str().unwrap_or("Inline error + toast").to_string(),
                loading_pattern: input["loading_pattern"].as_str().unwrap_or("Skeleton loaders").to_string(),
                components,
                layout_choice: input["layout_choice"].as_str().unwrap_or("single_column").to_string(),
                breakpoint_notes: input["breakpoint_notes"].as_str().map(|s| s.to_string()),
                additional_notes: input["additional_notes"].as_str().map(|s| s.to_string()),
            };
            
            let result = create_design_file(design_input)?;
            Ok(format!("✅ {}\nFile: {}", result.message, result.file_path))
        }
        "move_idea_file" => {
            let slug = input["slug"].as_str().ok_or("Missing slug")?.to_string();
            let destination = input["destination"].as_str().ok_or("Missing destination")?.to_string();
            
            let result = move_idea_file(slug, destination)?;
            Ok(format!("✅ {}\nFile: {}", result.message, result.file_path))
        }
        "list_vault_artifacts" => {
            let artifacts = list_vault_artifacts()?;
            
            if artifacts.is_empty() {
                Ok("No artifacts found in the vault.".to_string())
            } else {
                let formatted: Vec<String> = artifacts.iter()
                    .map(|a| format!("[{}] {} - {} ({})", a.artifact_type.to_uppercase(), a.slug, a.file_name, a.directory))
                    .collect();
                Ok(format!("Found {} artifacts:\n{}", artifacts.len(), formatted.join("\n")))
            }
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
