use crate::db::get_db;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

/// Default time allocations per SOP phase (in seconds)
const PHASE_DEFAULTS: [(i32, &str, i64); 13] = [
    (0, "Idea Intake", 900),           // 15 min
    (1, "Quick Validation", 1800),     // 30 min
    (2, "MVP Scope Lock", 2700),       // 45 min
    (3, "Revenue Model Lock", 1800),   // 30 min
    (4, "Design Brief", 3600),         // 60 min
    (5, "Project Setup", 2700),        // 45 min
    (6, "Infrastructure", 5400),       // 90 min
    (7, "Development", 28800),         // 8 hours (480 min)
    (8, "Testing & QA", 10800),        // 3 hours (180 min)
    (9, "Pre-Ship Checklist", 7200),   // 2 hours (120 min)
    (10, "Launch Day", 10800),         // 3 hours (180 min)
    (11, "Post-Launch Monitoring", 3600), // 60 min (daily check)
    (12, "Marketing Activation", 10800),  // 3 hours (180 min)
];

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShotClockSession {
    pub id: String,
    pub project_id: String,
    pub phase_number: i32,
    pub allocated_time_seconds: i64,
    pub bonus_time_seconds: i64,
    pub time_remaining_seconds: i64,
    pub status: String,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub locked_until: Option<String>,
}

/// Get the shot clock session for a project and phase
#[tauri::command]
pub fn get_shot_clock(
    app_handle: AppHandle,
    project_id: String,
    phase_number: i32,
) -> Result<Option<ShotClockSession>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
                    time_remaining_seconds, status, started_at, completed_at, locked_until
             FROM shot_clock_sessions
             WHERE project_id = ?1 AND phase_number = ?2",
        )
        .map_err(|e| e.to_string())?;

    let result = stmt
        .query_row([&project_id, &phase_number.to_string()], |row| {
            Ok(ShotClockSession {
                id: row.get(0)?,
                project_id: row.get(1)?,
                phase_number: row.get(2)?,
                allocated_time_seconds: row.get(3)?,
                bonus_time_seconds: row.get(4)?,
                time_remaining_seconds: row.get(5)?,
                status: row.get(6)?,
                started_at: row.get(7)?,
                completed_at: row.get(8)?,
                locked_until: row.get(9)?,
            })
        })
        .ok();

    Ok(result)
}

/// List all shot clock sessions for a project
#[tauri::command]
pub fn list_shot_clocks(
    app_handle: AppHandle,
    project_id: String,
) -> Result<Vec<ShotClockSession>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
                    time_remaining_seconds, status, started_at, completed_at, locked_until
             FROM shot_clock_sessions
             WHERE project_id = ?1
             ORDER BY phase_number ASC",
        )
        .map_err(|e| e.to_string())?;

    let sessions = stmt
        .query_map([&project_id], |row| {
            Ok(ShotClockSession {
                id: row.get(0)?,
                project_id: row.get(1)?,
                phase_number: row.get(2)?,
                allocated_time_seconds: row.get(3)?,
                bonus_time_seconds: row.get(4)?,
                time_remaining_seconds: row.get(5)?,
                status: row.get(6)?,
                started_at: row.get(7)?,
                completed_at: row.get(8)?,
                locked_until: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(sessions)
}

/// Start a shot clock for a specific phase
#[tauri::command]
pub fn start_shot_clock(
    app_handle: AppHandle,
    project_id: String,
    phase_number: i32,
) -> Result<ShotClockSession, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // Check if session already exists
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM shot_clock_sessions WHERE project_id = ?1 AND phase_number = ?2",
            [&project_id, &phase_number.to_string()],
            |row| row.get(0),
        )
        .ok();

    if existing.is_some() {
        return Err(format!(
            "Shot clock already exists for phase {}",
            phase_number
        ));
    }

    // Get default allocation for this phase
    let allocated = PHASE_DEFAULTS
        .iter()
        .find(|(p, _, _)| *p == phase_number)
        .map(|(_, _, seconds)| *seconds)
        .unwrap_or(3600); // Default 1 hour if not found

    let id = Uuid::new_v4().to_string();
    let started_at = Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO shot_clock_sessions
         (id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
          time_remaining_seconds, status, started_at)
         VALUES (?1, ?2, ?3, ?4, 0, ?4, 'active', ?5)",
        (&id, &project_id, &phase_number, &allocated, &started_at),
    )
    .map_err(|e| e.to_string())?;

    Ok(ShotClockSession {
        id,
        project_id,
        phase_number,
        allocated_time_seconds: allocated,
        bonus_time_seconds: 0,
        time_remaining_seconds: allocated,
        status: "active".to_string(),
        started_at,
        completed_at: None,
        locked_until: None,
    })
}

/// Update time remaining on a shot clock (called periodically by frontend)
#[tauri::command]
pub fn update_shot_clock_time(
    app_handle: AppHandle,
    id: String,
    time_remaining_seconds: i64,
) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    // If time is 0 or less, mark as expired
    let status = if time_remaining_seconds <= 0 {
        "expired"
    } else {
        "active"
    };

    conn.execute(
        "UPDATE shot_clock_sessions
         SET time_remaining_seconds = ?1, status = ?2
         WHERE id = ?3",
        (&time_remaining_seconds, &status, &id),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

/// Add bonus time to a shot clock (earned through efficiency)
#[tauri::command]
pub fn add_bonus_time(
    app_handle: AppHandle,
    id: String,
    bonus_seconds: i64,
) -> Result<ShotClockSession, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE shot_clock_sessions
         SET bonus_time_seconds = bonus_time_seconds + ?1,
             time_remaining_seconds = time_remaining_seconds + ?1
         WHERE id = ?2",
        (&bonus_seconds, &id),
    )
    .map_err(|e| e.to_string())?;

    // Return updated session
    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
                    time_remaining_seconds, status, started_at, completed_at, locked_until
             FROM shot_clock_sessions WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let session = stmt
        .query_row([&id], |row| {
            Ok(ShotClockSession {
                id: row.get(0)?,
                project_id: row.get(1)?,
                phase_number: row.get(2)?,
                allocated_time_seconds: row.get(3)?,
                bonus_time_seconds: row.get(4)?,
                time_remaining_seconds: row.get(5)?,
                status: row.get(6)?,
                started_at: row.get(7)?,
                completed_at: row.get(8)?,
                locked_until: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(session)
}

/// Complete a shot clock (phase finished successfully)
#[tauri::command]
pub fn complete_shot_clock(app_handle: AppHandle, id: String) -> Result<ShotClockSession, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let completed_at = Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE shot_clock_sessions
         SET status = 'completed', completed_at = ?1
         WHERE id = ?2",
        (&completed_at, &id),
    )
    .map_err(|e| e.to_string())?;

    // Return updated session
    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
                    time_remaining_seconds, status, started_at, completed_at, locked_until
             FROM shot_clock_sessions WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let session = stmt
        .query_row([&id], |row| {
            Ok(ShotClockSession {
                id: row.get(0)?,
                project_id: row.get(1)?,
                phase_number: row.get(2)?,
                allocated_time_seconds: row.get(3)?,
                bonus_time_seconds: row.get(4)?,
                time_remaining_seconds: row.get(5)?,
                status: row.get(6)?,
                started_at: row.get(7)?,
                completed_at: row.get(8)?,
                locked_until: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(session)
}

/// Lock a shot clock (penalty for going over time)
#[tauri::command]
pub fn lock_shot_clock(
    app_handle: AppHandle,
    id: String,
    lock_duration_seconds: i64,
) -> Result<ShotClockSession, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let locked_until = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::seconds(lock_duration_seconds))
        .ok_or("Failed to calculate lock time")?
        .to_rfc3339();

    conn.execute(
        "UPDATE shot_clock_sessions
         SET status = 'locked', locked_until = ?1
         WHERE id = ?2",
        (&locked_until, &id),
    )
    .map_err(|e| e.to_string())?;

    // Return updated session
    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
                    time_remaining_seconds, status, started_at, completed_at, locked_until
             FROM shot_clock_sessions WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let session = stmt
        .query_row([&id], |row| {
            Ok(ShotClockSession {
                id: row.get(0)?,
                project_id: row.get(1)?,
                phase_number: row.get(2)?,
                allocated_time_seconds: row.get(3)?,
                bonus_time_seconds: row.get(4)?,
                time_remaining_seconds: row.get(5)?,
                status: row.get(6)?,
                started_at: row.get(7)?,
                completed_at: row.get(8)?,
                locked_until: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(session)
}

/// Delete a shot clock session (for cleanup/reset)
#[tauri::command]
pub fn delete_shot_clock(app_handle: AppHandle, id: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM shot_clock_sessions WHERE id = ?1", [&id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Initialize shot clocks for all 13 phases of a project
#[tauri::command]
pub fn init_project_shot_clocks(
    app_handle: AppHandle,
    project_id: String,
) -> Result<Vec<ShotClockSession>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut sessions = Vec::new();

    for (phase, _name, allocated) in PHASE_DEFAULTS.iter() {
        let id = Uuid::new_v4().to_string();
        let started_at = Utc::now().to_rfc3339();

        // Use INSERT OR IGNORE to skip if already exists
        conn.execute(
            "INSERT OR IGNORE INTO shot_clock_sessions
             (id, project_id, phase_number, allocated_time_seconds, bonus_time_seconds,
              time_remaining_seconds, status, started_at)
             VALUES (?1, ?2, ?3, ?4, 0, ?4, 'active', ?5)",
            (&id, &project_id, phase, allocated, &started_at),
        )
        .map_err(|e| e.to_string())?;

        sessions.push(ShotClockSession {
            id,
            project_id: project_id.clone(),
            phase_number: *phase,
            allocated_time_seconds: *allocated,
            bonus_time_seconds: 0,
            time_remaining_seconds: *allocated,
            status: "active".to_string(),
            started_at,
            completed_at: None,
            locked_until: None,
        });
    }

    Ok(sessions)
}
