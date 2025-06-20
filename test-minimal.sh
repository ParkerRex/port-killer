#!/bin/bash

# Kill any existing processes
pkill -f "port-killer" 2>/dev/null || true
pkill -f "cargo" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Test if we can just open a browser window to the dev server
echo "Starting Vite dev server..."
cd /Users/parkerrex/Developer/ports
bun run dev &
VITE_PID=$!

sleep 3

echo "Opening browser to test if Vite is working..."
open http://localhost:1420

echo "Vite should be running at http://localhost:1420"
echo "Press Ctrl+C to stop"

wait $VITE_PID