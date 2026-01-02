use crate::db::get_db;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Idea {
    pub id: String,
    pub name: String,
    pub slug: String,
    pub problem_statement: Option<String>,
    pub proposed_solution: Option<String>,
    pub source: Option<String>,
    pub status: String,
    pub audit_result: Option<String>,
    pub created_at: String,
    pub audited_at: Option<String>,
    pub activated_at: Option<String>,
    pub project_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateIdeaInput {
    pub name: String,
    pub problem_statement: Option<String>,
    pub proposed_solution: Option<String>,
    pub source: Option<String>,
}

fn slugify(name: &str) -> String {
    name.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

#[tauri::command]
pub fn list_ideas(app_handle: AppHandle, status: Option<String>) -> Result<Vec<Idea>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let query = match &status {
        Some(_) => "SELECT id, name, slug, problem_statement, proposed_solution, source, status, audit_result, created_at, audited_at, activated_at, project_id FROM ideas WHERE status = ?1 ORDER BY created_at DESC",
        None => "SELECT id, name, slug, problem_statement, proposed_solution, source, status, audit_result, created_at, audited_at, activated_at, project_id FROM ideas ORDER BY created_at DESC",
    };

    let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;

    let ideas = if let Some(s) = status {
        stmt.query_map([s], |row| {
            Ok(Idea {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                problem_statement: row.get(3)?,
                proposed_solution: row.get(4)?,
                source: row.get(5)?,
                status: row.get(6)?,
                audit_result: row.get(7)?,
                created_at: row.get(8)?,
                audited_at: row.get(9)?,
                activated_at: row.get(10)?,
                project_id: row.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?
    } else {
        stmt.query_map([], |row| {
            Ok(Idea {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                problem_statement: row.get(3)?,
                proposed_solution: row.get(4)?,
                source: row.get(5)?,
                status: row.get(6)?,
                audit_result: row.get(7)?,
                created_at: row.get(8)?,
                audited_at: row.get(9)?,
                activated_at: row.get(10)?,
                project_id: row.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?
    };

    Ok(ideas)
}

#[tauri::command]
pub fn get_idea(app_handle: AppHandle, id: String) -> Result<Option<Idea>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, name, slug, problem_statement, proposed_solution, source, status, audit_result, created_at, audited_at, activated_at, project_id FROM ideas WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let idea = stmt
        .query_row([&id], |row| {
            Ok(Idea {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                problem_statement: row.get(3)?,
                proposed_solution: row.get(4)?,
                source: row.get(5)?,
                status: row.get(6)?,
                audit_result: row.get(7)?,
                created_at: row.get(8)?,
                audited_at: row.get(9)?,
                activated_at: row.get(10)?,
                project_id: row.get(11)?,
            })
        })
        .ok();

    Ok(idea)
}

#[tauri::command]
pub fn create_idea(app_handle: AppHandle, input: CreateIdeaInput) -> Result<Idea, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();
    let slug = slugify(&input.name);

    conn.execute(
        "INSERT INTO ideas (id, name, slug, problem_statement, proposed_solution, source, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending')",
        rusqlite::params![
            &id,
            &input.name,
            &slug,
            &input.problem_statement,
            &input.proposed_solution,
            &input.source,
        ],
    )
    .map_err(|e| e.to_string())?;

    // Fetch the created idea - need to drop conn first to release the lock
    drop(conn);
    get_idea(app_handle, id)?.ok_or_else(|| "Failed to fetch created idea".to_string())
}

#[tauri::command]
pub fn update_idea_status(app_handle: AppHandle, id: String, status: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let now = chrono::Utc::now().to_rfc3339();

    // Update status and relevant timestamp
    match status.as_str() {
        "active" => {
            conn.execute(
                "UPDATE ideas SET status = ?1, activated_at = ?2 WHERE id = ?3",
                rusqlite::params![&status, &now, &id],
            )
            .map_err(|e| e.to_string())?;
        }
        "audited" => {
            conn.execute(
                "UPDATE ideas SET status = ?1, audited_at = ?2 WHERE id = ?3",
                rusqlite::params![&status, &now, &id],
            )
            .map_err(|e| e.to_string())?;
        }
        _ => {
            conn.execute(
                "UPDATE ideas SET status = ?1 WHERE id = ?2",
                rusqlite::params![&status, &id],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

#[tauri::command]
pub fn save_idea_audit(app_handle: AppHandle, id: String, audit_result: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE ideas SET audit_result = ?1, audited_at = ?2, status = 'audited' WHERE id = ?3",
        rusqlite::params![&audit_result, &now, &id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_idea(app_handle: AppHandle, id: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM ideas WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;

    Ok(())
}
