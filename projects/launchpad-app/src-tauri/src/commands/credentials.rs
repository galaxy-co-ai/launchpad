use keyring::Entry;
use tauri::AppHandle;

const SERVICE_NAME: &str = "launchpad";

#[derive(Debug)]
pub enum CredentialError {
    NotFound,
    StorageError(String),
}

impl std::fmt::Display for CredentialError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CredentialError::NotFound => write!(f, "Credential not found"),
            CredentialError::StorageError(msg) => write!(f, "Storage error: {}", msg),
        }
    }
}

fn get_entry(key: &str) -> Result<Entry, CredentialError> {
    Entry::new(SERVICE_NAME, key).map_err(|e| CredentialError::StorageError(e.to_string()))
}

pub fn store_credential(key: &str, value: &str) -> Result<(), CredentialError> {
    let entry = get_entry(key)?;
    entry
        .set_password(value)
        .map_err(|e| CredentialError::StorageError(e.to_string()))
}

pub fn get_credential(key: &str) -> Result<String, CredentialError> {
    let entry = get_entry(key)?;
    entry.get_password().map_err(|e| match e {
        keyring::Error::NoEntry => CredentialError::NotFound,
        _ => CredentialError::StorageError(e.to_string()),
    })
}

pub fn delete_credential(key: &str) -> Result<(), CredentialError> {
    let entry = get_entry(key)?;
    match entry.delete_credential() {
        Ok(_) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()), // Already deleted, no error
        Err(e) => Err(CredentialError::StorageError(e.to_string())),
    }
}

pub fn has_credential(key: &str) -> bool {
    get_credential(key).is_ok()
}

#[tauri::command]
pub fn set_api_key(_app_handle: AppHandle, key: String, value: String) -> Result<(), String> {
    store_credential(&key, &value).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_api_key(_app_handle: AppHandle, key: String) -> Result<Option<String>, String> {
    match get_credential(&key) {
        Ok(value) => Ok(Some(value)),
        Err(CredentialError::NotFound) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn delete_api_key(_app_handle: AppHandle, key: String) -> Result<(), String> {
    delete_credential(&key).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn has_api_key(_app_handle: AppHandle, key: String) -> Result<bool, String> {
    Ok(has_credential(&key))
}
