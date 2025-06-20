use super::*;

#[test]
fn test_parse_lsof_line() {
        // Test parsing a typical lsof line
        let line = "node      12345    user   23u  IPv6 0x1234567890abcdef      0t0  TCP *:3000 (LISTEN)";
        let result = parse_lsof_line(line);
        
        assert!(result.is_some());
        let port = result.unwrap();
        assert_eq!(port.process_name, "node");
        assert_eq!(port.pid, 12345);
        assert_eq!(port.port, 3000);
        assert_eq!(port.protocol, "TCP");
        assert_eq!(port.state, "LISTEN");
    }

    #[test]
    fn test_parse_lsof_line_invalid() {
        // Test with invalid line (too few fields)
        let line = "invalid line";
        let result = parse_lsof_line(line);
        assert!(result.is_none());
    }

    #[test]
    fn test_parse_lsof_line_no_port() {
        // Test with line that doesn't have a port
        let line = "node      12345    user   23u  IPv6 0x1234567890abcdef      0t0  TCP";
        let result = parse_lsof_line(line);
        assert!(result.is_none());
    }

    // Note: is_dev_port is defined in lib.rs, so we can't test it here directly
    // You would need to move it to a shared module or test it in lib.rs

    #[test]
    fn test_port_struct_serialization() {
        use serde_json;
        
        let port = Port {
            port: 3000,
            process_name: "node".to_string(),
            pid: 12345,
            protocol: "TCP".to_string(),
            state: "LISTEN".to_string(),
            address: "127.0.0.1".to_string(),
        };
        
        // Test serialization
        let json = serde_json::to_string(&port).unwrap();
        assert!(json.contains("\"port\":3000"));
        assert!(json.contains("\"processName\":\"node\""));
        assert!(json.contains("\"pid\":12345"));
        
        // Test deserialization
        let deserialized: Port = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.port, port.port);
        assert_eq!(deserialized.process_name, port.process_name);
        assert_eq!(deserialized.pid, port.pid);
    }

    // Integration test example (requires mock or test environment)
    #[test]
    #[ignore] // Ignore by default as it requires actual processes
    fn test_scan_ports_integration() {
        let result = scan_ports();
        assert!(result.is_ok());
        
        let ports = result.unwrap();
        // Verify the result is a valid vector
        assert!(ports.is_empty() || ports.iter().all(|p| p.port > 0));
    }

    // Mock example for kill_process
    #[test]
    #[cfg(target_os = "macos")]
    fn test_kill_process_invalid_pid() {
        // Test with PID 0 which should fail
        let result = kill_process(0);
        assert!(result.is_err());
    }