use crate::db::get_db;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SOP {
    pub id: String,
    pub sop_number: i32,
    pub version: String,
    pub name: String,
    pub phase: String,
    pub content: String,
    pub is_active: bool,
    pub tags: Option<String>,
    pub created_at: String,
    pub archived_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSOPInput {
    pub sop_number: i32,
    pub version: String,
    pub name: String,
    pub phase: String,
    pub content: String,
    pub tags: Option<Vec<String>>,
}

// Default SOP definitions
pub const DEFAULT_SOPS: &[(i32, &str, &str)] = &[
    (0, "Idea Intake", "ideation"),
    (1, "Quick Validation", "ideation"),
    (2, "MVP Scope Lock", "ideation"),
    (3, "Revenue Model Lock", "ideation"),
    (4, "Design Brief", "design"),
    (5, "Project Setup", "setup"),
    (6, "Infrastructure", "setup"),
    (7, "Development", "build"),
    (8, "Testing & QA", "build"),
    (9, "Pre-Ship Checklist", "launch"),
    (10, "Launch Day", "launch"),
    (11, "Post-Launch Monitoring", "post_launch"),
    (12, "Marketing Activation", "post_launch"),
];

#[tauri::command]
pub fn list_sops(app_handle: AppHandle, active_only: Option<bool>) -> Result<Vec<SOP>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let query = if active_only.unwrap_or(false) {
        "SELECT id, sop_number, version, name, phase, content, is_active, tags, created_at, archived_at FROM sops WHERE is_active = 1 ORDER BY sop_number, version DESC"
    } else {
        "SELECT id, sop_number, version, name, phase, content, is_active, tags, created_at, archived_at FROM sops ORDER BY sop_number, version DESC"
    };

    let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;

    let sops = stmt
        .query_map([], |row| {
            Ok(SOP {
                id: row.get(0)?,
                sop_number: row.get(1)?,
                version: row.get(2)?,
                name: row.get(3)?,
                phase: row.get(4)?,
                content: row.get(5)?,
                is_active: row.get::<_, i32>(6)? == 1,
                tags: row.get(7)?,
                created_at: row.get(8)?,
                archived_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(sops)
}

#[tauri::command]
pub fn get_sop(app_handle: AppHandle, sop_number: i32, version: Option<String>) -> Result<Option<SOP>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let sop = if let Some(v) = version {
        let mut stmt = conn
            .prepare("SELECT id, sop_number, version, name, phase, content, is_active, tags, created_at, archived_at FROM sops WHERE sop_number = ?1 AND version = ?2")
            .map_err(|e| e.to_string())?;

        stmt.query_row(rusqlite::params![sop_number, v], |row| {
            Ok(SOP {
                id: row.get(0)?,
                sop_number: row.get(1)?,
                version: row.get(2)?,
                name: row.get(3)?,
                phase: row.get(4)?,
                content: row.get(5)?,
                is_active: row.get::<_, i32>(6)? == 1,
                tags: row.get(7)?,
                created_at: row.get(8)?,
                archived_at: row.get(9)?,
            })
        })
        .ok()
    } else {
        // Get latest active version
        let mut stmt = conn
            .prepare("SELECT id, sop_number, version, name, phase, content, is_active, tags, created_at, archived_at FROM sops WHERE sop_number = ?1 AND is_active = 1 ORDER BY created_at DESC LIMIT 1")
            .map_err(|e| e.to_string())?;

        stmt.query_row([sop_number], |row| {
            Ok(SOP {
                id: row.get(0)?,
                sop_number: row.get(1)?,
                version: row.get(2)?,
                name: row.get(3)?,
                phase: row.get(4)?,
                content: row.get(5)?,
                is_active: row.get::<_, i32>(6)? == 1,
                tags: row.get(7)?,
                created_at: row.get(8)?,
                archived_at: row.get(9)?,
            })
        })
        .ok()
    };

    Ok(sop)
}

#[tauri::command]
pub fn create_sop_version(app_handle: AppHandle, input: CreateSOPInput) -> Result<SOP, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();
    let tags_json = input.tags.map(|t| serde_json::to_string(&t).unwrap_or_default());

    conn.execute(
        "INSERT INTO sops (id, sop_number, version, name, phase, content, is_active, tags) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 1, ?7)",
        rusqlite::params![
            &id,
            input.sop_number,
            &input.version,
            &input.name,
            &input.phase,
            &input.content,
            &tags_json,
        ],
    )
    .map_err(|e| e.to_string())?;

    // Fetch the created SOP
    let mut stmt = conn
        .prepare("SELECT id, sop_number, version, name, phase, content, is_active, tags, created_at, archived_at FROM sops WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let sop = stmt
        .query_row([&id], |row| {
            Ok(SOP {
                id: row.get(0)?,
                sop_number: row.get(1)?,
                version: row.get(2)?,
                name: row.get(3)?,
                phase: row.get(4)?,
                content: row.get(5)?,
                is_active: row.get::<_, i32>(6)? == 1,
                tags: row.get(7)?,
                created_at: row.get(8)?,
                archived_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(sop)
}

#[tauri::command]
pub fn archive_sop_version(app_handle: AppHandle, id: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE sops SET is_active = 0, archived_at = ?1 WHERE id = ?2",
        rusqlite::params![&now, &id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_sop_versions(app_handle: AppHandle, sop_number: i32) -> Result<Vec<SOP>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, sop_number, version, name, phase, content, is_active, tags, created_at, archived_at FROM sops WHERE sop_number = ?1 ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;

    let sops = stmt
        .query_map([sop_number], |row| {
            Ok(SOP {
                id: row.get(0)?,
                sop_number: row.get(1)?,
                version: row.get(2)?,
                name: row.get(3)?,
                phase: row.get(4)?,
                content: row.get(5)?,
                is_active: row.get::<_, i32>(6)? == 1,
                tags: row.get(7)?,
                created_at: row.get(8)?,
                archived_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(sops)
}

#[tauri::command]
pub fn init_default_sops(app_handle: AppHandle) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    for (num, name, phase) in DEFAULT_SOPS {
        // Check if this SOP already has a version
        let exists: bool = conn
            .query_row(
                "SELECT EXISTS(SELECT 1 FROM sops WHERE sop_number = ?1)",
                [num],
                |row| row.get(0),
            )
            .unwrap_or(false);

        if !exists {
            let id = Uuid::new_v4().to_string();
            conn.execute(
                "INSERT INTO sops (id, sop_number, version, name, phase, content, is_active) VALUES (?1, ?2, '1.0.0', ?3, ?4, '', 1)",
                rusqlite::params![&id, num, name, phase],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}
