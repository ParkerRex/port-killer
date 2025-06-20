# Port Manager - Architecture Design

## Technology Stack
- **Framework**: Tauri 2.0
- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust (Tauri commands)
- **UI**: Tailwind CSS
- **Process Management**: macOS native commands (lsof, kill)

## Architecture Overview

### 1. Backend (Rust/Tauri)
```
src-tauri/
├── src/
│   ├── main.rs           # App initialization & system tray
│   ├── commands/         # Tauri commands
│   │   ├── ports.rs      # Port scanning logic
│   │   └── process.rs    # Process management
│   └── utils/
│       └── parser.rs     # Parse lsof output
```

**Key Functions:**
- `scan_ports()` - Uses `lsof -i -P -n` to list all network connections
- `get_process_info(pid)` - Gets process name from PID
- `kill_process(pid)` - Terminates a process
- `refresh_ports()` - Periodic port scanning

### 2. Frontend (React/TypeScript)
```
src/
├── components/
│   ├── PortList.tsx      # Main port list view
│   ├── PortItem.tsx      # Individual port entry
│   └── SearchBar.tsx     # Filter ports
├── hooks/
│   ├── usePorts.ts       # Port data management
│   └── useRefresh.ts     # Auto-refresh logic
└── types/
    └── port.ts           # TypeScript interfaces
```

### 3. Data Flow
```
User clicks menu bar icon
    ↓
Tauri shows popup window
    ↓
Frontend requests port scan
    ↓
Backend executes: lsof -i -P -n
    ↓
Parse output to extract:
  - Port number
  - Process name (not PID)
  - Protocol (TCP/UDP)
  - State (LISTEN/ESTABLISHED)
    ↓
Return formatted data to frontend
    ↓
Display in sortable/filterable list
    ↓
User clicks "Kill" button
    ↓
Backend executes kill command
    ↓
Auto-refresh port list
```

### 4. Port Information Structure
```typescript
interface Port {
  port: number;
  processName: string;
  pid: number;
  protocol: 'TCP' | 'UDP';
  state: 'LISTEN' | 'ESTABLISHED' | 'CLOSE_WAIT';
  address: string;
}
```

### 5. Key Features
1. **Auto-refresh**: Updates port list every 2 seconds when window is open
2. **Smart grouping**: Group multiple connections from same process
3. **Quick actions**: One-click kill with confirmation
4. **Search/filter**: Filter by port number or process name
5. **Status indicators**: Different colors for different states

### 6. Security Considerations
- Request user permission for process termination
- Validate PID before killing
- Prevent killing system-critical processes
- Run with minimal required permissions

### 7. Performance Optimizations
- Cache process names to avoid repeated lookups
- Debounce refresh requests
- Virtual scrolling for large port lists
- Lazy load process icons

## Implementation Plan
1. Set up Tauri project with React template
2. Implement port scanning command in Rust
3. Create basic UI with port list
4. Add kill functionality
5. Implement search/filter
6. Add auto-refresh
7. Polish UI and add icons