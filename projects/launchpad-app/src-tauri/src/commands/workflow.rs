use crate::db::get_db;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

// =============================================================================
// Types
// =============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WorkflowProgress {
    pub id: String,
    pub idea_id: String,
    pub current_sop: i32,
    pub current_step: Option<String>,
    pub completed_steps: String,  // JSON array
    pub step_data: String,        // JSON object
    pub validation_score: Option<i32>,
    pub decision: Option<String>,
    pub started_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WorkflowArtifact {
    pub id: String,
    pub workflow_id: String,
    pub artifact_type: String,
    pub file_path: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkflowContext {
    pub workflow: WorkflowProgress,
    pub idea_name: String,
    pub idea_slug: String,
    pub artifacts: Vec<WorkflowArtifact>,
    pub completed_steps_parsed: Vec<String>,
    pub step_data_parsed: serde_json::Value,
    pub progress_summary: ProgressSummary,
    pub next_action: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProgressSummary {
    pub current_sop_name: String,
    pub current_sop_number: i32,
    pub steps_completed: usize,
    pub percent_complete: f32,
    pub phase: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompleteStepInput {
    pub idea_id: String,
    pub step_id: String,
    pub data: serde_json::Value,
}

// =============================================================================
// Helper Functions
// =============================================================================

fn get_sop_name(sop_number: i32) -> &'static str {
    match sop_number {
        0 => "Idea Intake",
        1 => "Quick Validation",
        2 => "MVP Scope Contract",
        3 => "Revenue Model Lock",
        4 => "Design Brief",
        5 => "Project Setup",
        6 => "Infrastructure Provisioning",
        7 => "Development Protocol",
        8 => "Testing & QA",
        9 => "Pre-Ship Checklist",
        10 => "Launch Day Protocol",
        11 => "Post-Launch Monitoring",
        12 => "Marketing Activation",
        _ => "Unknown",
    }
}

fn get_sop_phase(sop_number: i32) -> &'static str {
    match sop_number {
        0..=3 => "ideation",
        4 => "design",
        5..=6 => "setup",
        7 => "build",
        8 => "qa",
        9..=10 => "ship",
        11..=12 => "iterate",
        _ => "unknown",
    }
}

fn get_next_action(sop_number: i32, current_step: Option<&str>, decision: Option<&str>) -> String {
    // Check decision status for SOP-01
    if sop_number == 1 {
        match decision {
            Some("green") => return "Validation passed! Ready to lock MVP scope (SOP-02).".to_string(),
            Some("yellow") => return "Needs more research. Revisit weak validation areas.".to_string(),
            Some("red") => return "Idea killed. Return to SOP-00 for a new idea.".to_string(),
            _ => {}
        }
    }

    match (sop_number, current_step) {
        (0, None) => "Start capturing your idea. Tell me about the problem you want to solve.".to_string(),
        (0, Some(step)) => format!("Continue idea intake from step {}.", step),
        (1, None) => "Begin validation. Let's research if the problem is real.".to_string(),
        (1, Some(step)) => format!("Continue validation from step {}.", step),
        (2, None) => "Lock your MVP scope. Define the core value proposition.".to_string(),
        (2, Some(step)) => format!("Continue scope contract from step {}.", step),
        (3, None) => "Lock your revenue model. Choose pricing and payment flow.".to_string(),
        (3, Some(step)) => format!("Continue revenue model from step {}.", step),
        (4, None) => "Create your design brief. Map the user flow.".to_string(),
        (4, Some(step)) => format!("Continue design brief from step {}.", step),
        (5, None) => "Set up your project. Scaffold the codebase.".to_string(),
        (6, None) => "Provision infrastructure. Set up services.".to_string(),
        (7, None) => "Start development. Build the features.".to_string(),
        (8, None) => "Run testing and QA. Verify everything works.".to_string(),
        (9, None) => "Complete pre-ship checklist.".to_string(),
        (10, None) => "Execute launch day protocol.".to_string(),
        (11, None) => "Monitor post-launch metrics.".to_string(),
        (12, None) => "Activate marketing channels.".to_string(),
        _ => "Continue with the current step.".to_string(),
    }
}

// =============================================================================
// Tauri Commands
// =============================================================================

/// Start a new workflow for an idea
#[tauri::command]
pub fn start_workflow(app_handle: AppHandle, idea_id: String) -> Result<WorkflowProgress, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Check if workflow already exists for this idea
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM workflow_progress WHERE idea_id = ?1",
            [&idea_id],
            |row| row.get(0),
        )
        .ok();

    if let Some(id) = existing {
        // Return existing workflow
        return get_workflow_state_internal(&conn, &id);
    }

    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO workflow_progress (id, idea_id, current_sop, completed_steps, step_data, started_at, updated_at)
         VALUES (?1, ?2, 0, '[]', '{}', ?3, ?3)",
        rusqlite::params![&id, &idea_id, &now],
    )
    .map_err(|e| e.to_string())?;

    Ok(WorkflowProgress {
        id,
        idea_id,
        current_sop: 0,
        current_step: None,
        completed_steps: "[]".to_string(),
        step_data: "{}".to_string(),
        validation_score: None,
        decision: None,
        started_at: now.clone(),
        updated_at: now,
    })
}

/// Get current workflow state for an idea
#[tauri::command]
pub fn get_workflow_state(app_handle: AppHandle, idea_id: String) -> Result<Option<WorkflowProgress>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let workflow = conn
        .query_row(
            "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
             FROM workflow_progress WHERE idea_id = ?1",
            [&idea_id],
            |row| {
                Ok(WorkflowProgress {
                    id: row.get(0)?,
                    idea_id: row.get(1)?,
                    current_sop: row.get(2)?,
                    current_step: row.get(3)?,
                    completed_steps: row.get(4)?,
                    step_data: row.get(5)?,
                    validation_score: row.get(6)?,
                    decision: row.get(7)?,
                    started_at: row.get(8)?,
                    updated_at: row.get(9)?,
                })
            },
        )
        .ok();

    Ok(workflow)
}

fn get_workflow_state_internal(conn: &rusqlite::Connection, workflow_id: &str) -> Result<WorkflowProgress, String> {
    conn.query_row(
        "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
         FROM workflow_progress WHERE id = ?1",
        [workflow_id],
        |row| {
            Ok(WorkflowProgress {
                id: row.get(0)?,
                idea_id: row.get(1)?,
                current_sop: row.get(2)?,
                current_step: row.get(3)?,
                completed_steps: row.get(4)?,
                step_data: row.get(5)?,
                validation_score: row.get(6)?,
                decision: row.get(7)?,
                started_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

/// Complete a step in the workflow
#[tauri::command]
pub fn complete_step(app_handle: AppHandle, input: CompleteStepInput) -> Result<WorkflowProgress, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Get current workflow
    let workflow: WorkflowProgress = conn
        .query_row(
            "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
             FROM workflow_progress WHERE idea_id = ?1",
            [&input.idea_id],
            |row| {
                Ok(WorkflowProgress {
                    id: row.get(0)?,
                    idea_id: row.get(1)?,
                    current_sop: row.get(2)?,
                    current_step: row.get(3)?,
                    completed_steps: row.get(4)?,
                    step_data: row.get(5)?,
                    validation_score: row.get(6)?,
                    decision: row.get(7)?,
                    started_at: row.get(8)?,
                    updated_at: row.get(9)?,
                })
            },
        )
        .map_err(|e| format!("Workflow not found: {}", e))?;

    // Parse and update completed steps
    let mut completed: Vec<String> = serde_json::from_str(&workflow.completed_steps).unwrap_or_default();
    if !completed.contains(&input.step_id) {
        completed.push(input.step_id.clone());
    }

    // Parse and update step data
    let mut step_data: serde_json::Value = serde_json::from_str(&workflow.step_data).unwrap_or(serde_json::json!({}));
    if let serde_json::Value::Object(ref mut map) = step_data {
        map.insert(input.step_id.clone(), input.data);
    }

    let now = chrono::Utc::now().to_rfc3339();
    let completed_json = serde_json::to_string(&completed).map_err(|e| e.to_string())?;
    let step_data_json = serde_json::to_string(&step_data).map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE workflow_progress SET completed_steps = ?1, step_data = ?2, current_step = ?3, updated_at = ?4 WHERE id = ?5",
        rusqlite::params![&completed_json, &step_data_json, &input.step_id, &now, &workflow.id],
    )
    .map_err(|e| e.to_string())?;

    // Return updated workflow
    get_workflow_state_internal(&conn, &workflow.id)
}

/// Advance to the next SOP
#[tauri::command]
pub fn advance_sop(app_handle: AppHandle, idea_id: String) -> Result<WorkflowProgress, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let workflow: WorkflowProgress = conn
        .query_row(
            "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
             FROM workflow_progress WHERE idea_id = ?1",
            [&idea_id],
            |row| {
                Ok(WorkflowProgress {
                    id: row.get(0)?,
                    idea_id: row.get(1)?,
                    current_sop: row.get(2)?,
                    current_step: row.get(3)?,
                    completed_steps: row.get(4)?,
                    step_data: row.get(5)?,
                    validation_score: row.get(6)?,
                    decision: row.get(7)?,
                    started_at: row.get(8)?,
                    updated_at: row.get(9)?,
                })
            },
        )
        .map_err(|e| format!("Workflow not found: {}", e))?;

    let next_sop = workflow.current_sop + 1;
    if next_sop > 12 {
        return Err("Already at final SOP".to_string());
    }

    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE workflow_progress SET current_sop = ?1, current_step = NULL, updated_at = ?2 WHERE id = ?3",
        rusqlite::params![next_sop, &now, &workflow.id],
    )
    .map_err(|e| e.to_string())?;

    get_workflow_state_internal(&conn, &workflow.id)
}

/// Update validation score and decision
#[tauri::command]
pub fn update_validation(app_handle: AppHandle, idea_id: String, score: i32, decision: String) -> Result<WorkflowProgress, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE workflow_progress SET validation_score = ?1, decision = ?2, updated_at = ?3 WHERE idea_id = ?4",
        rusqlite::params![score, &decision, &now, &idea_id],
    )
    .map_err(|e| e.to_string())?;

    let workflow: WorkflowProgress = conn
        .query_row(
            "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
             FROM workflow_progress WHERE idea_id = ?1",
            [&idea_id],
            |row| {
                Ok(WorkflowProgress {
                    id: row.get(0)?,
                    idea_id: row.get(1)?,
                    current_sop: row.get(2)?,
                    current_step: row.get(3)?,
                    completed_steps: row.get(4)?,
                    step_data: row.get(5)?,
                    validation_score: row.get(6)?,
                    decision: row.get(7)?,
                    started_at: row.get(8)?,
                    updated_at: row.get(9)?,
                })
            },
        )
        .map_err(|e| format!("Workflow not found: {}", e))?;

    Ok(workflow)
}

/// Get full workflow context for AI injection
#[tauri::command]
pub fn get_workflow_context(app_handle: AppHandle, idea_id: String) -> Result<Option<WorkflowContext>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Get workflow
    let workflow: WorkflowProgress = match conn.query_row(
        "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
         FROM workflow_progress WHERE idea_id = ?1",
        [&idea_id],
        |row| {
            Ok(WorkflowProgress {
                id: row.get(0)?,
                idea_id: row.get(1)?,
                current_sop: row.get(2)?,
                current_step: row.get(3)?,
                completed_steps: row.get(4)?,
                step_data: row.get(5)?,
                validation_score: row.get(6)?,
                decision: row.get(7)?,
                started_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        },
    ) {
        Ok(w) => w,
        Err(_) => return Ok(None),
    };

    // Get idea info
    let (idea_name, idea_slug): (String, String) = conn
        .query_row(
            "SELECT name, slug FROM ideas WHERE id = ?1",
            [&idea_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .map_err(|e| format!("Idea not found: {}", e))?;

    // Get artifacts
    let mut stmt = conn
        .prepare(
            "SELECT id, workflow_id, artifact_type, file_path, created_at FROM workflow_artifacts WHERE workflow_id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let artifacts: Vec<WorkflowArtifact> = stmt
        .query_map([&workflow.id], |row| {
            Ok(WorkflowArtifact {
                id: row.get(0)?,
                workflow_id: row.get(1)?,
                artifact_type: row.get(2)?,
                file_path: row.get(3)?,
                created_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    // Parse completed steps
    let completed_steps_parsed: Vec<String> = serde_json::from_str(&workflow.completed_steps).unwrap_or_default();

    // Parse step data
    let step_data_parsed: serde_json::Value = serde_json::from_str(&workflow.step_data).unwrap_or(serde_json::json!({}));

    // Calculate progress (rough estimate based on SOP)
    let total_sops = 13;
    let percent_complete = ((workflow.current_sop as f32) / (total_sops as f32)) * 100.0;

    let progress_summary = ProgressSummary {
        current_sop_name: get_sop_name(workflow.current_sop).to_string(),
        current_sop_number: workflow.current_sop,
        steps_completed: completed_steps_parsed.len(),
        percent_complete,
        phase: get_sop_phase(workflow.current_sop).to_string(),
    };

    let next_action = get_next_action(
        workflow.current_sop,
        workflow.current_step.as_deref(),
        workflow.decision.as_deref(),
    );

    Ok(Some(WorkflowContext {
        workflow,
        idea_name,
        idea_slug,
        artifacts,
        completed_steps_parsed,
        step_data_parsed,
        progress_summary,
        next_action,
    }))
}

/// Add an artifact to the workflow
#[tauri::command]
pub fn add_workflow_artifact(
    app_handle: AppHandle,
    idea_id: String,
    artifact_type: String,
    file_path: String,
) -> Result<WorkflowArtifact, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Get workflow ID
    let workflow_id: String = conn
        .query_row(
            "SELECT id FROM workflow_progress WHERE idea_id = ?1",
            [&idea_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Workflow not found: {}", e))?;

    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO workflow_artifacts (id, workflow_id, artifact_type, file_path, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        rusqlite::params![&id, &workflow_id, &artifact_type, &file_path, &now],
    )
    .map_err(|e| e.to_string())?;

    Ok(WorkflowArtifact {
        id,
        workflow_id,
        artifact_type,
        file_path,
        created_at: now,
    })
}

/// List all workflows
#[tauri::command]
pub fn list_workflows(app_handle: AppHandle) -> Result<Vec<WorkflowProgress>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, idea_id, current_sop, current_step, completed_steps, step_data, validation_score, decision, started_at, updated_at
             FROM workflow_progress ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let workflows: Vec<WorkflowProgress> = stmt
        .query_map([], |row| {
            Ok(WorkflowProgress {
                id: row.get(0)?,
                idea_id: row.get(1)?,
                current_sop: row.get(2)?,
                current_step: row.get(3)?,
                completed_steps: row.get(4)?,
                step_data: row.get(5)?,
                validation_score: row.get(6)?,
                decision: row.get(7)?,
                started_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(workflows)
}

/// Delete a workflow
#[tauri::command]
pub fn delete_workflow(app_handle: AppHandle, idea_id: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM workflow_progress WHERE idea_id = ?1", [&idea_id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Generate AI context string for injection into system prompt
#[tauri::command]
pub fn generate_ai_context(app_handle: AppHandle, idea_id: String) -> Result<Option<String>, String> {
    let context = get_workflow_context(app_handle, idea_id)?;
    
    match context {
        Some(ctx) => {
            let artifacts_list = if ctx.artifacts.is_empty() {
                "None yet".to_string()
            } else {
                ctx.artifacts
                    .iter()
                    .map(|a| format!("- {} ({})", a.artifact_type, a.file_path))
                    .collect::<Vec<_>>()
                    .join("\n")
            };

            let validation_info = match (ctx.workflow.validation_score, &ctx.workflow.decision) {
                (Some(score), Some(decision)) => format!("\n- Validation Score: {}/125 ({})", score, decision.to_uppercase()),
                _ => String::new(),
            };

            let context_str = format!(r#"## Current Workflow Context

**Idea:** {} ({})
**Current Phase:** {} (SOP-{:02} {})
**Steps Completed:** {}
**Progress:** {:.0}% through pipeline{}

### Generated Artifacts
{}

### Collected Data
```json
{}
```

### Next Action
{}

---

**IMPORTANT:** You are in guided workflow mode. Continue from where the user left off. Reference the collected data above to avoid asking redundant questions."#,
                ctx.idea_name,
                ctx.idea_slug,
                ctx.progress_summary.phase,
                ctx.progress_summary.current_sop_number,
                ctx.progress_summary.current_sop_name,
                ctx.progress_summary.steps_completed,
                ctx.progress_summary.percent_complete,
                validation_info,
                artifacts_list,
                serde_json::to_string_pretty(&ctx.step_data_parsed).unwrap_or_default(),
                ctx.next_action,
            );

            Ok(Some(context_str))
        }
        None => Ok(None),
    }
}

