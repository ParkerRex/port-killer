# Testing Guide for Port Killer

## Overview
This guide explains how to add and run unit tests for the Port Killer application, focusing on the Rust backend code.

## Running Tests

### Run all tests
```bash
cd src-tauri
cargo test
```

### Run tests with output
```bash
cargo test -- --nocapture
```

### Run specific test
```bash
cargo test test_parse_lsof_line
```

### Run ignored tests (integration tests)
```bash
cargo test -- --ignored
```

## Test Structure

Tests are organized in the following structure:
```
src-tauri/src/
├── commands/
│   ├── ports.rs      # Main port scanning logic
│   └── tests.rs      # Unit tests for ports module
└── lib.rs            # App initialization (tests can be added here too)
```

## Writing Unit Tests

### 1. Basic Unit Test Structure
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function_name() {
        // Arrange
        let input = "test data";
        
        // Act
        let result = function_under_test(input);
        
        // Assert
        assert_eq!(result, expected_value);
    }
}
```

### 2. Testing Pure Functions
Pure functions (like `parse_lsof_line` and `is_dev_port`) are easiest to test:

```rust
#[test]
fn test_is_dev_port() {
    // Test valid development ports
    assert!(is_dev_port(3000));
    assert!(is_dev_port(8080));
    
    // Test invalid ports
    assert!(!is_dev_port(22));   // SSH
    assert!(!is_dev_port(443));  // HTTPS
}
```

### 3. Testing with Mock Data
For functions that interact with the system (like `scan_ports`), create test helpers:

```rust
#[cfg(test)]
fn create_mock_port() -> Port {
    Port {
        port: 3000,
        process_name: "node".to_string(),
        pid: 12345,
        protocol: "TCP".to_string(),
        state: "LISTEN".to_string(),
        address: "127.0.0.1".to_string(),
    }
}
```

### 4. Testing Error Cases
Always test error conditions:

```rust
#[test]
fn test_parse_invalid_input() {
    let result = parse_lsof_line("invalid");
    assert!(result.is_none());
}
```

### 5. Integration Tests
For tests that require actual system interaction, use the `#[ignore]` attribute:

```rust
#[test]
#[ignore] // Run with: cargo test -- --ignored
fn test_actual_port_scanning() {
    let ports = scan_ports().unwrap();
    // This will actually scan system ports
    assert!(ports.len() >= 0);
}
```

## Test Categories

### 1. Parser Tests (`parse_lsof_line`)
- Valid lsof output parsing
- Invalid/malformed input handling
- Edge cases (missing fields, unusual formats)

### 2. Port Filter Tests (`is_dev_port`)
- All defined development port ranges
- Boundary conditions (start/end of ranges)
- Non-development ports

### 3. Data Structure Tests
- Serialization/deserialization of Port struct
- Field validation
- JSON compatibility

### 4. Command Tests
- Error handling for invalid PIDs
- Permission errors (requires elevated privileges)
- Process not found scenarios

### 5. Menu State Tests
- Port list updates
- Menu building logic
- State synchronization

## Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
   ```rust
   test_parse_lsof_line_with_ipv6_address()
   test_kill_process_with_invalid_pid_returns_error()
   ```

2. **Test Organization**: Group related tests using nested modules
   ```rust
   #[cfg(test)]
   mod tests {
       mod parser_tests { ... }
       mod command_tests { ... }
   }
   ```

3. **Test Data**: Use constants for test data
   ```rust
   const VALID_LSOF_LINE: &str = "node 12345 user 23u IPv6 0x123 0t0 TCP *:3000 (LISTEN)";
   ```

4. **Assertions**: Use appropriate assertion macros
   ```rust
   assert!(condition);           // Boolean assertions
   assert_eq!(actual, expected); // Equality assertions
   assert!(result.is_ok());      // Result type assertions
   assert!(result.is_err());
   ```

5. **Error Messages**: Provide helpful error messages
   ```rust
   assert_eq!(
       port.process_name, 
       "node", 
       "Process name should be parsed correctly from lsof output"
   );
   ```

## Coverage

To check test coverage, you can use `cargo-tarpaulin`:

```bash
# Install
cargo install cargo-tarpaulin

# Run coverage
cargo tarpaulin --out Html

# Open coverage report
open tarpaulin-report.html
```

## Continuous Integration

Add this to your CI pipeline (e.g., GitHub Actions):

```yaml
- name: Run tests
  run: |
    cd src-tauri
    cargo test --all-features
```

## Mock External Commands

For testing commands that shell out (like `lsof` and `kill`), consider using dependency injection:

```rust
trait CommandRunner {
    fn run_lsof(&self) -> Result<String, String>;
    fn kill_process(&self, pid: u32) -> Result<(), String>;
}

// In tests, implement a MockCommandRunner
struct MockCommandRunner {
    lsof_output: String,
}

impl CommandRunner for MockCommandRunner {
    fn run_lsof(&self) -> Result<String, String> {
        Ok(self.lsof_output.clone())
    }
    // ...
}
```

## Next Steps

1. Add more edge case tests for `parse_lsof_line`
2. Create integration tests for the tray menu functionality
3. Add performance benchmarks for port scanning
4. Set up automated testing in CI/CD pipeline
5. Add property-based tests using `proptest` crate