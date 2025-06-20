#!/bin/bash
echo "Testing Port Manager..."

# Kill any existing processes
pkill -f "port-manager" 2>/dev/null || true
pkill -f "cargo.*port-manager" 2>/dev/null || true

# Run with debug output
cd src-tauri
RUST_LOG=debug cargo run 2>&1 | grep -E "(window|tray|click|event)"