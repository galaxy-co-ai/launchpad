use rusqlite::{Connection, Result};
use std::sync::Mutex;
use tauri::AppHandle;
use tauri::Manager;

pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(app_handle: &AppHandle) -> Result<Self> {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .map_err(|e| rusqlite::Error::InvalidPath(e.to_string().into()))?;

        std::fs::create_dir_all(&app_dir)
            .map_err(|e| rusqlite::Error::InvalidPath(e.to_string().into()))?;

        let db_path = app_dir.join("launchpad.db");
        let conn = Connection::open(&db_path)?;

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    pub fn init(&self) -> Result<()> {
        let conn = self.conn.lock()
            .map_err(|_| rusqlite::Error::InvalidQuery)?;

        // Enable foreign keys
        conn.execute("PRAGMA foreign_keys = ON", [])?;

        // Settings table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )",
            [],
        )?;

        // Projects table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                local_path TEXT,
                github_url TEXT,
                current_phase INTEGER DEFAULT 0,
                status_report TEXT,
                last_analyzed TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )",
            [],
        )?;

        // Conversations table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                project_id TEXT,
                title TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Messages table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                conversation_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Roadmap items table (SOP checkpoints)
        conn.execute(
            "CREATE TABLE IF NOT EXISTS roadmap_items (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                sop_number INTEGER NOT NULL,
                sop_name TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                ai_notes TEXT,
                completed_at TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // SOPs table with versioning
        conn.execute(
            "CREATE TABLE IF NOT EXISTS sops (
                id TEXT PRIMARY KEY,
                sop_number INTEGER NOT NULL,
                version TEXT NOT NULL,
                name TEXT NOT NULL,
                phase TEXT NOT NULL,
                content TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                tags TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                archived_at TEXT,
                UNIQUE(sop_number, version)
            )",
            [],
        )?;

        // Ideas table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS ideas (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                problem_statement TEXT,
                proposed_solution TEXT,
                source TEXT,
                status TEXT DEFAULT 'pending',
                audit_result TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                audited_at TEXT,
                activated_at TEXT,
                project_id TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id)
            )",
            [],
        )?;

        // Shot clock sessions table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS shot_clock_sessions (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                phase_number INTEGER NOT NULL,
                allocated_time_seconds INTEGER NOT NULL,
                bonus_time_seconds INTEGER DEFAULT 0,
                time_remaining_seconds INTEGER NOT NULL,
                status TEXT DEFAULT 'active',
                started_at TEXT NOT NULL DEFAULT (datetime('now')),
                completed_at TEXT,
                locked_until TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Create indexes for performance
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_messages_conversation
             ON messages(conversation_id)",
            [],
        )?;

        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_roadmap_project
             ON roadmap_items(project_id)",
            [],
        )?;

        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_conversations_project
             ON conversations(project_id)",
            [],
        )?;

        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_sops_number
             ON sops(sop_number)",
            [],
        )?;

        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_ideas_status
             ON ideas(status)",
            [],
        )?;

        Ok(())
    }
}

// Helper to get database from app state
pub fn get_db(app_handle: &AppHandle) -> &Database {
    app_handle.state::<Database>().inner()
}
