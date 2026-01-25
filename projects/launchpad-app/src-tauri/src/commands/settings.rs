use crate::db::get_db;
use crate::commands::credentials;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

const API_KEY_CREDENTIAL_NAME: &str = "anthropic_api_key";

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

fn migrate_api_key_to_secure_storage(app_handle: &AppHandle) {
    let db = get_db(app_handle);
    let conn = match db.conn.lock() {
        Ok(c) => c,
        Err(_) => return,
    };

    let result: Result<String, _> = conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        [API_KEY_CREDENTIAL_NAME],
        |row| row.get(0),
    );

    if let Ok(plaintext_key) = result {
        if !plaintext_key.is_empty() {
            if credentials::store_credential(API_KEY_CREDENTIAL_NAME, &plaintext_key).is_ok() {
                let _ = conn.execute(
                    "DELETE FROM settings WHERE key = ?1",
                    [API_KEY_CREDENTIAL_NAME],
                );
                log::info!("Migrated API key from SQLite to secure storage");
            }
        }
    }
}

#[tauri::command]
pub fn get_setting(app_handle: AppHandle, key: String) -> Result<Option<String>, String> {
    // Retrieve API key from secure storage
    if key == API_KEY_CREDENTIAL_NAME {
        return match credentials::get_credential(&key) {
            Ok(value) => Ok(Some(value)),
            Err(credentials::CredentialError::NotFound) => Ok(None),
            Err(e) => Err(e.to_string()),
        };
    }

    // Get non-sensitive settings from SQLite
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
    // Route API key to secure storage instead of SQLite
    if key == API_KEY_CREDENTIAL_NAME {
        if value.is_empty() {
            credentials::delete_credential(&key).map_err(|e| e.to_string())?;
        } else {
            credentials::store_credential(&key, &value).map_err(|e| e.to_string())?;
        }
        return Ok(());
    }

    // Store non-sensitive settings in SQLite
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
    // Migrate any existing plaintext API keys to secure storage
    migrate_api_key_to_secure_storage(&app_handle);

    let db = get_db(&app_handle);
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut settings = AppSettings::default();

    // Get API key from secure storage (Windows Credential Manager)
    settings.anthropic_api_key = credentials::get_credential(API_KEY_CREDENTIAL_NAME).ok();

    // Get other settings from SQLite (non-sensitive data)
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
                "theme" => settings.theme = value,
                "auto_analyze" => settings.auto_analyze = value == "true",
                // Note: anthropic_api_key is now retrieved from secure storage above
                _ => {}
            }
        }
    }

    Ok(settings)
}
