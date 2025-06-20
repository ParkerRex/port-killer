# Port Manager

A lightweight macOS menu bar app for monitoring and managing development ports. Built with Tauri and React.

## Features

- **⚡ Menu Bar Integration** - Quick access from macOS menu bar with one-click port termination
- **🚀 Smart Port Detection** - Automatically identifies and categorizes development services
- **🎯 Developer-Focused** - Filters out non-development ports by default (hide system processes like Cursor, Adobe, etc.)
- **🎨 Service Categorization** - Organizes ports by type: Frontend, Backend, Database
- **⚡ Real-time Updates** - Auto-refreshes every 2 seconds
- **🔍 Instant Search** - Filter by port number, process name, or framework
- **✅ Safe Process Termination** - Two-click confirmation system to prevent accidents
- **🪶 Lightweight** - ~2.5MB app size (vs 85MB+ with Electron)

## Supported Frameworks

Automatically recognizes 50+ development tools including:
- **Frontend**: Next.js, Vite, React, Vue, Angular, Astro, Nuxt, Gatsby
- **Backend**: FastAPI, Django, Flask, Express, Rails, Laravel, Spring Boot
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, Supabase, Elasticsearch

## Installation

### Prerequisites
- macOS 10.15+
- [Bun](https://bun.sh) runtime
- Rust (for building from source)

### Install from Release
1. Download the latest `.dmg` from [Releases](https://github.com/yourusername/port-manager/releases)
2. Open the DMG and drag Port Manager to Applications
3. Launch from Applications or Spotlight

### Build from Source
```bash
# Clone the repository
git clone https://github.com/yourusername/port-manager.git
cd port-manager

# Install dependencies
bun install

# Run in development
bun run tauri dev

# Build for production
bun run tauri build
```

## Usage

### Menu Bar (System Tray)
1. Click the menu bar icon (⚡) to see active development ports
2. Click any port to instantly terminate the process
3. Select "Refresh" to update the port list
4. Select "Quit" to exit the application

### Main Window
1. Click the menu bar icon to open the main window
2. View all active development ports organized by category
3. Use the search bar to filter specific ports or services
4. Toggle "Show development ports only" to see all system ports
5. Click "Kill Process" twice to terminate a service (safer two-step process)
6. Press `ESC` to hide the window

### Supported Development Ports
The menu bar automatically shows ports in these ranges:
- **3000-3010**: React, Next.js, Node.js apps
- **4000-4010**: Various frameworks
- **5000-5010**: Flask, Python frameworks
- **5173**: Vite
- **5432**: PostgreSQL
- **6379**: Redis
- **8000-8010**: Django, other frameworks
- **8080-8090**: Common web servers
- **9000-9010**: PHP-FPM, other services
- **9200**: Elasticsearch
- **27017**: MongoDB
- **1420**: Tauri dev server

## Project Structure

```
port-manager/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Port categorization logic
│   └── types/             # TypeScript definitions
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri commands (port scanning, process management)
│   │   └── lib.rs         # App initialization & tray menu
│   └── tauri.conf.json    # Tauri configuration
└── package.json           # Frontend dependencies
```

## Technical Details

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Rust + Tauri 2.0
- **Port Scanning**: Uses `lsof` command to list network connections
- **Process Management**: Native macOS process termination

## Configuration

The app uses smart defaults but can be customized:

- **Refresh Interval**: 2 seconds (hardcoded in `usePorts` hook)
- **Default Filter**: Development ports only (toggle available in UI)
- **Window Size**: 400x600px (configured in `tauri.conf.json`)

## Development

```bash
# Start development server
bun run dev

# Run Tauri in development mode
bun run tauri dev

# Build for production
bun run tauri build

# Type checking
bun run tsc
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Port history tracking
- [ ] Custom port labels/aliases
- [ ] Export port list
- [ ] Windows/Linux support
- [ ] Keyboard shortcuts
- [ ] Port conflict detection
- [ ] Integration with Docker containers

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with [Tauri](https://tauri.app) - A framework for building tiny, blazing fast binaries for all major desktop platforms.