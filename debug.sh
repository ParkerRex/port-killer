#!/bin/bash

echo "Checking if Rust/Cargo is working..."
cargo --version

echo -e "\nChecking Tauri CLI..."
bunx tauri --version

echo -e "\nChecking for running processes..."
ps aux | grep -E "(port-manager|cargo|vite)" | grep -v grep

echo -e "\nChecking localhost:1420..."
curl -s http://localhost:1420 | head -n 5

echo -e "\nDone."