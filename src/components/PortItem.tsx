import { useState } from 'react';
import { Port } from '../types/port';

interface PortItemProps {
  port: Port;
  onKill: (pid: number) => void;
}

export const PortItem: React.FC<PortItemProps> = ({ port, onKill }) => {
  const [confirmKill, setConfirmKill] = useState(false);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'LISTEN':
        return 'text-emerald-600';
      case 'ESTABLISHED':
        return 'text-blue-600';
      case 'CLOSE_WAIT':
        return 'text-amber-600';
      case 'TIME_WAIT':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'frontend':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'backend':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'database':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'frontend':
        return '🎨';
      case 'backend':
        return '⚙️';
      case 'database':
        return '🗄️';
      default:
        return '📦';
    }
  };

  const handleKillClick = () => {
    if (!confirmKill) {
      setConfirmKill(true);
      // Reset after 3 seconds
      setTimeout(() => setConfirmKill(false), 3000);
    } else {
      onKill(port.pid);
      setConfirmKill(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">:{port.port}</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(port.category)}`}>
            {getCategoryIcon(port.category)} {port.displayName || port.processName}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span className={`font-medium ${getStateColor(port.state)}`}>● {port.state}</span>
          <span className="text-gray-500">{port.protocol}</span>
          <span className="text-gray-400">PID: {port.pid}</span>
        </div>
      </div>
      
      <button
        onClick={handleKillClick}
        className={`
          px-4 py-2 text-sm font-medium rounded-lg transition-all
          ${confirmKill 
            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {confirmKill ? '⚠️ Confirm Kill' : 'Kill Process'}
      </button>
    </div>
  );
};