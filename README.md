# Port Killer

A lightweight macOS menu bar app that shows your development ports and lets you kill them with one click. Built with Tauri for a tiny 2.5MB app size.

## What it does

- **Click the ⚡ icon in your menu bar** to see all your dev servers
- **Click any port to kill it instantly** - no more hunting for PIDs
- **Only shows development ports** (3000, 5173, 8080, etc.) - no system noise
- **Tiny 2.5MB app** built with Rust + Tauri (not Electron!)

## Quick Start

1. Download the latest `.dmg` from [Releases](https://github.com/yourusername/port-killer/releases)
2. Drag Port Killer to Applications
3. Launch it - you'll see a ⚡ in your menu bar
4. Click the ⚡ to see and kill your dev ports

## Build from Source

```bash
git clone https://github.com/yourusername/port-killer.git
cd port-killer
bun install
bun run tauri build
```

## How to Use

**Menu Bar:**
- Click ⚡ to see ports
- Click any port to kill it
- That's it!

**Main Window** (optional):
- Opens when you launch the app
- Search, filter, and categorize ports
- Two-click kill for safety
- Press ESC to hide

## Supported Ports

Automatically detects:
- **3000-3010** - React, Next.js, Node.js
- **4000-4010** - Various frameworks  
- **5000-5010** - Flask, Python
- **5173** - Vite
- **5432** - PostgreSQL
- **6379** - Redis
- **8000-8010** - Django
- **8080-8090** - Web servers
- **And more...**

## Why Port Killer?

- **Faster than** `lsof -i :3000` + finding the PID + `kill -9`
- **Safer than** killing the wrong process
- **Lighter than** Activity Monitor or other Electron apps
- **Focused on** development ports only

## Contributing

PRs welcome! The codebase is small and easy to understand.

## Built With

- [Tauri](https://tauri.app) - Rust-based app framework
- React + TypeScript - UI
- `lsof` - Port detection

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with [Tauri](https://tauri.app) - A framework for building tiny, blazing fast binaries for all major desktop platforms.