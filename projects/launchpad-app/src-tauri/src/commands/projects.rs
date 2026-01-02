use crate::db::get_db;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub slug: String,
    pub local_path: Option<String>,
    pub github_url: Option<String>,
    pub current_phase: i32,
    pub status_report: Option<String>,
    pub last_analyzed: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProjectInput {
    pub name: String,
    pub local_path: Option<String>,
    pub github_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RoadmapItem {
    pub id: String,
    pub project_id: String,
    pub sop_number: i32,
    pub sop_name: String,
    pub status: String,
    pub ai_notes: Option<String>,
    pub completed_at: Option<String>,
}

// Default SOP names for roadmap initialization
const SOP_NAMES: &[&str] = &[
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
pub fn list_projects(app_handle: AppHandle) -> Result<Vec<Project>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, slug, local_path, github_url, current_phase,
                    status_report, last_analyzed, created_at
             FROM projects ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let projects = stmt
        .query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                local_path: row.get(3)?,
                github_url: row.get(4)?,
                current_phase: row.get(5)?,
                status_report: row.get(6)?,
                last_analyzed: row.get(7)?,
                created_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(projects)
}

#[tauri::command]
pub fn get_project(app_handle: AppHandle, slug: String) -> Result<Option<Project>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let result = conn.query_row(
        "SELECT id, name, slug, local_path, github_url, current_phase,
                status_report, last_analyzed, created_at
         FROM projects WHERE slug = ?1",
        [&slug],
        |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                local_path: row.get(3)?,
                github_url: row.get(4)?,
                current_phase: row.get(5)?,
                status_report: row.get(6)?,
                last_analyzed: row.get(7)?,
                created_at: row.get(8)?,
            })
        },
    );

    match result {
        Ok(project) => Ok(Some(project)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn create_project(app_handle: AppHandle, input: CreateProjectInput) -> Result<Project, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let id = Uuid::new_v4().to_string();
    let slug = slugify(&input.name);
    let created_at = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO projects (id, name, slug, local_path, github_url, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (
            &id,
            &input.name,
            &slug,
            &input.local_path,
            &input.github_url,
            &created_at,
        ),
    )
    .map_err(|e| e.to_string())?;

    // Initialize roadmap items for all SOPs
    for (i, sop_name) in SOP_NAMES.iter().enumerate() {
        let item_id = Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO roadmap_items (id, project_id, sop_number, sop_name, status)
             VALUES (?1, ?2, ?3, ?4, 'pending')",
            (&item_id, &id, i as i32, *sop_name),
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(Project {
        id,
        name: input.name,
        slug,
        local_path: input.local_path,
        github_url: input.github_url,
        current_phase: 0,
        status_report: None,
        last_analyzed: None,
        created_at,
    })
}

#[tauri::command]
pub fn update_project(
    app_handle: AppHandle,
    id: String,
    name: Option<String>,
    local_path: Option<String>,
    github_url: Option<String>,
) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    if let Some(name) = name {
        let slug = slugify(&name);
        conn.execute(
            "UPDATE projects SET name = ?1, slug = ?2 WHERE id = ?3",
            (&name, &slug, &id),
        )
        .map_err(|e| e.to_string())?;
    }

    if let Some(path) = local_path {
        conn.execute(
            "UPDATE projects SET local_path = ?1 WHERE id = ?2",
            (&path, &id),
        )
        .map_err(|e| e.to_string())?;
    }

    if let Some(url) = github_url {
        conn.execute(
            "UPDATE projects SET github_url = ?1 WHERE id = ?2",
            (&url, &id),
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn delete_project(app_handle: AppHandle, id: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM projects WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_roadmap(app_handle: AppHandle, project_id: String) -> Result<Vec<RoadmapItem>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, sop_number, sop_name, status, ai_notes, completed_at
             FROM roadmap_items WHERE project_id = ?1 ORDER BY sop_number",
        )
        .map_err(|e| e.to_string())?;

    let items = stmt
        .query_map([&project_id], |row| {
            Ok(RoadmapItem {
                id: row.get(0)?,
                project_id: row.get(1)?,
                sop_number: row.get(2)?,
                sop_name: row.get(3)?,
                status: row.get(4)?,
                ai_notes: row.get(5)?,
                completed_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(items)
}

#[tauri::command]
pub fn update_roadmap_item(
    app_handle: AppHandle,
    id: String,
    status: String,
    ai_notes: Option<String>,
) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let completed_at = if status == "complete" {
        Some(Utc::now().to_rfc3339())
    } else {
        None
    };

    conn.execute(
        "UPDATE roadmap_items SET status = ?1, ai_notes = ?2, completed_at = ?3 WHERE id = ?4",
        (&status, &ai_notes, &completed_at, &id),
    )
    .map_err(|e| e.to_string())?;

    // Update project's current phase based on roadmap progress
    let project_id: String = conn
        .query_row(
            "SELECT project_id FROM roadmap_items WHERE id = ?1",
            [&id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let current_phase: i32 = conn
        .query_row(
            "SELECT COALESCE(MAX(sop_number), 0) FROM roadmap_items
             WHERE project_id = ?1 AND status = 'complete'",
            [&project_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    conn.execute(
        "UPDATE projects SET current_phase = ?1 WHERE id = ?2",
        (current_phase, &project_id),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
