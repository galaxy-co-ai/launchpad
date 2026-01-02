use crate::db::get_db;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize)]
pub struct AppSettings {
    pub anthropic_api_key: Option<String>,
    pub theme: String,
    pub auto_analyze: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            anthropic_api_key: None,
            theme: "system".to_string(),
            auto_analyze: true,
        }
    }
}

#[tauri::command]
pub fn get_setting(app_handle: AppHandle, key: String) -> Result<Option<String>, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let result: Result<String, _> = conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        [&key],
        |row| row.get(0),
    );

    match result {
        Ok(value) => Ok(Some(value)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn set_setting(app_handle: AppHandle, key: String, value: String) -> Result<(), String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = ?2",
        [&key, &value],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_all_settings(app_handle: AppHandle) -> Result<AppSettings, String> {
    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut settings = AppSettings::default();

    let mut stmt = conn
        .prepare("SELECT key, value FROM settings")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            let key: String = row.get(0)?;
            let value: String = row.get(1)?;
            Ok((key, value))
        })
        .map_err(|e| e.to_string())?;

    for row in rows {
        if let Ok((key, value)) = row {
            match key.as_str() {
                "anthropic_api_key" => settings.anthropic_api_key = Some(value),
                "theme" => settings.theme = value,
                "auto_analyze" => settings.auto_analyze = value == "true",
                _ => {}
            }
        }
    }

    Ok(settings)
}
