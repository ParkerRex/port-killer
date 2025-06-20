mod commands;

use tauri::{
    Manager,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{TrayIconBuilder, MouseButton, MouseButtonState, TrayIconEvent},
    AppHandle,
};
use commands::{scan_ports, kill_process, Port};
use std::sync::Mutex;

#[derive(Default)]
struct AppState {
    ports: Mutex<Vec<Port>>,
}

// Common development port ranges
const DEV_PORT_RANGES: &[(u32, u32)] = &[
    (3000, 3010),  // React, Next.js, Node.js apps
    (4000, 4010),  // Various frameworks
    (5000, 5010),  // Flask, other Python frameworks
    (5173, 5173),  // Vite
    (5432, 5432),  // PostgreSQL
    (6379, 6379),  // Redis
    (8000, 8010),  // Django, other frameworks
    (8080, 8090),  // Common web servers
    (9000, 9010),  // PHP-FPM, other services
    (9200, 9200),  // Elasticsearch
    (27017, 27017), // MongoDB
    (1420, 1420),  // Tauri dev server
];

fn is_dev_port(port: u32) -> bool {
    DEV_PORT_RANGES.iter().any(|(start, end)| port >= *start && port <= *end)
}

fn update_tray_menu(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let state = app_handle.state::<AppState>();
    let all_ports = scan_ports().unwrap_or_default();
    
    // Filter for development ports
    let dev_ports: Vec<Port> = all_ports.iter()
        .filter(|p| is_dev_port(p.port))
        .cloned()
        .collect();
    
    // Update state with all ports
    *state.ports.lock().unwrap() = all_ports;
    
    // Build new menu
    let menu = Menu::new(app_handle)?;
    
    if dev_ports.is_empty() {
        let no_ports_item = MenuItem::with_id(app_handle, "no_ports", "No development ports detected", false, None::<&str>)?;
        no_ports_item.set_enabled(false)?;
        menu.append(&no_ports_item)?;
    } else {
        // Add port items
        for port in dev_ports {
            let label = format!("Port {} - {} (PID: {})", port.port, port.process_name, port.pid);
            let menu_item = MenuItem::with_id(
                app_handle,
                &format!("port_{}", port.pid),
                label,
                true,
                None::<&str>
            )?;
            menu.append(&menu_item)?;
        }
    }
    
    // Add separator and refresh option
    menu.append(&PredefinedMenuItem::separator(app_handle)?)?;
    menu.append(&MenuItem::with_id(app_handle, "refresh", "Refresh", true, None::<&str>)?)?;
    
    // Add separator and quit option
    menu.append(&PredefinedMenuItem::separator(app_handle)?)?;
    menu.append(&MenuItem::with_id(app_handle, "quit", "Quit", true, None::<&str>)?)?;
    
    // Update the tray menu
    if let Some(tray) = app_handle.tray_by_id("main") {
        tray.set_menu(Some(menu))?;
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![scan_ports, kill_process])
        .manage(AppState::default())
        .setup(|app| {
            println!("App setup starting...");
            
            // Show the main window
            if let Some(window) = app.get_webview_window("main") {
                println!("Window found, showing it...");
                let _ = window.show();
                let _ = window.center();
                println!("Window should be visible now!");
            } else {
                println!("ERROR: No window found!");
            }
            
            // Create tray icon
            let _tray = TrayIconBuilder::with_id("main")
                .tooltip("Port Killer")
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(|tray, event| {
                    match event {
                        TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            // Update menu on left click
                            if let Err(e) = update_tray_menu(&tray.app_handle()) {
                                eprintln!("Failed to update tray menu: {}", e);
                            }
                        }
                        _ => {}
                    }
                })
                .on_menu_event(move |app_handle, event| {
                    let menu_id = event.id().as_ref();
                    
                    match menu_id {
                        "quit" => {
                            app_handle.exit(0);
                        }
                        "refresh" => {
                            if let Err(e) = update_tray_menu(app_handle) {
                                eprintln!("Failed to refresh menu: {}", e);
                            }
                        }
                        id if id.starts_with("port_") => {
                            // Extract PID from menu item ID
                            if let Some(pid_str) = id.strip_prefix("port_") {
                                if let Ok(pid) = pid_str.parse::<u32>() {
                                    // Kill the process
                                    match kill_process(pid) {
                                        Ok(_) => {
                                            println!("Successfully killed process {}", pid);
                                            // Refresh the menu after killing
                                            if let Err(e) = update_tray_menu(app_handle) {
                                                eprintln!("Failed to refresh menu: {}", e);
                                            }
                                        }
                                        Err(e) => {
                                            eprintln!("Failed to kill process {}: {}", pid, e);
                                        }
                                    }
                                }
                            }
                        }
                        _ => {}
                    }
                })
                .build(app)?;
            
            // Initial menu update
            update_tray_menu(&app.app_handle())?;
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_dev_port() {
        // Test development port ranges
        assert!(is_dev_port(3000));
        assert!(is_dev_port(3005));
        assert!(is_dev_port(5173));
        assert!(is_dev_port(8080));
        assert!(is_dev_port(5432));
        assert!(is_dev_port(27017));
        assert!(is_dev_port(1420));
        
        // Test non-development ports
        assert!(!is_dev_port(22));    // SSH
        assert!(!is_dev_port(443));   // HTTPS
        assert!(!is_dev_port(80));    // HTTP
        assert!(!is_dev_port(12000)); // Random high port
        assert!(!is_dev_port(2999));  // Just below range
        assert!(!is_dev_port(3011));  // Just above range
    }

    #[test]
    fn test_dev_port_ranges_boundaries() {
        // Test range boundaries
        assert!(is_dev_port(3000));  // Start of range
        assert!(is_dev_port(3010));  // End of range
        assert!(!is_dev_port(2999)); // Just before
        assert!(!is_dev_port(3011)); // Just after
        
        // Test single port ranges
        assert!(is_dev_port(5173));  // Vite
        assert!(!is_dev_port(5172));
        assert!(!is_dev_port(5174));
    }
}