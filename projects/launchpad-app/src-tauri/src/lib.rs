mod commands;
mod db;

use tauri::{
    Manager,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use commands::{
    // Settings
    get_setting, set_setting, get_all_settings,
    // Projects
    list_projects, get_project, create_project, update_project, delete_project,
    get_roadmap, update_roadmap_item,
    // Chat
    list_conversations, get_conversation_messages, create_conversation,
    save_message, delete_conversation, send_chat_message,
    // Analyzer
    analyze_project, save_project_analysis,
    // File Tools
    list_files, read_file, grep_files, get_directory_tree,
    // Ideas
    list_ideas, get_idea, create_idea, update_idea_status, save_idea_audit, delete_idea,
    // SOPs
    list_sops, get_sop, create_sop_version, archive_sop_version, get_sop_versions, init_default_sops,
};
use db::Database;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        // Single instance - if app already running, focus existing window
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .setup(|app| {
            // Initialize database
            let db = Database::new(&app.handle())
                .expect("Failed to initialize database");
            db.init().expect("Failed to run database migrations");
            app.manage(db);

            // Focus main window on startup
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }

            // Setup system tray
            let show_item = MenuItem::with_id(app, "show", "Show Launchpad", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .tooltip("Launchpad - AI-Powered Project Launcher")
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // Enable logging in all builds (debug and release)
            app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
            )?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Settings
            get_setting,
            set_setting,
            get_all_settings,
            // Projects
            list_projects,
            get_project,
            create_project,
            update_project,
            delete_project,
            get_roadmap,
            update_roadmap_item,
            // Chat
            list_conversations,
            get_conversation_messages,
            create_conversation,
            save_message,
            delete_conversation,
            send_chat_message,
            // Analyzer
            analyze_project,
            save_project_analysis,
            // File Tools
            list_files,
            read_file,
            grep_files,
            get_directory_tree,
            // Ideas
            list_ideas,
            get_idea,
            create_idea,
            update_idea_status,
            save_idea_audit,
            delete_idea,
            // SOPs
            list_sops,
            get_sop,
            create_sop_version,
            archive_sop_version,
            get_sop_versions,
            init_default_sops,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
