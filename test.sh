#!/bin/bash
echo "Testing Port Killer..."

# Kill any existing processes
pkill -f "port-killer" 2>/dev/null || true
pkill -f "cargo.*port-killer" 2>/dev/null || true

# Run with debug output
cd src-tauri
RUST_LOG=debug cargo run 2>&1 | grep -E "(window|tray|click|event)"