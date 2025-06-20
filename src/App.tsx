import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { PortList } from './components/PortList';
import { usePorts } from './hooks/usePorts';

function App() {
  const { ports, loading, error, killProcess } = usePorts();

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const window = getCurrentWindow();
        await window.hide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-gray-900 px-6 py-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Port Killer
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Monitor and manage your development servers
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Press ESC to hide
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <PortList
          ports={ports}
          onKillProcess={killProcess}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;