use serde::{Deserialize, Serialize};
use std::process::Command;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Port {
    pub port: u32,
    #[serde(rename = "processName")]
    pub process_name: String,
    pub pid: u32,
    pub protocol: String,
    pub state: String,
    pub address: String,
}

#[tauri::command]
pub fn scan_ports() -> Result<Vec<Port>, String> {
    let output = Command::new("lsof")
        .args(&["-i", "-P", "-n"])
        .output()
        .map_err(|e| format!("Failed to execute lsof: {}", e))?;

    if !output.status.success() {
        return Err(format!("lsof failed with status: {}", output.status));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut ports = Vec::new();
    let mut seen_ports = HashMap::new();

    for line in stdout.lines().skip(1) {
        if let Some(port_info) = parse_lsof_line(line) {
            let key = format!("{}:{}", port_info.port, port_info.pid);
            if !seen_ports.contains_key(&key) {
                seen_ports.insert(key, true);
                ports.push(port_info);
            }
        }
    }

    ports.sort_by(|a, b| a.port.cmp(&b.port));
    Ok(ports)
}

fn parse_lsof_line(line: &str) -> Option<Port> {
    let parts: Vec<&str> = line.split_whitespace().collect();
    if parts.len() < 10 {
        return None;
    }

    let process_name = parts[0].to_string();
    let pid = parts[1].parse::<u32>().ok()?;
    let protocol = parts[7].to_string();
    
    let address_parts = parts[8].split(':').collect::<Vec<&str>>();
    if address_parts.len() < 2 {
        return None;
    }

    let address = address_parts[0].to_string();
    let port = address_parts.last()?.parse::<u32>().ok()?;
    
    let state = if parts.len() > 9 && parts[9].contains('(') {
        parts[9].trim_matches(|c| c == '(' || c == ')').to_string()
    } else {
        "UNKNOWN".to_string()
    };

    Some(Port {
        port,
        process_name,
        pid,
        protocol,
        state,
        address,
    })
}

#[tauri::command]
pub fn kill_process(pid: u32) -> Result<(), String> {
    let output = Command::new("kill")
        .arg("-9")
        .arg(pid.to_string())
        .output()
        .map_err(|e| format!("Failed to execute kill: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to kill process: {}", stderr));
    }

    Ok(())
}

#[cfg(test)]
#[path = "tests.rs"]
mod tests;