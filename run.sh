#!/bin/bash
# Kill any existing process on port 1420
lsof -i :1420 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Start the development server
echo "Starting Port Killer..."
bun run tauri dev