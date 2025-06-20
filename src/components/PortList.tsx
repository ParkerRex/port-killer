import { useState, useMemo } from 'react';
import { Port } from '../types/port';
import { PortItem } from './PortItem';
import { SearchBar } from './SearchBar';

interface PortListProps {
  ports: Port[];
  onKillProcess: (pid: number) => void;
  loading: boolean;
  error: string | null;
}

export const PortList: React.FC<PortListProps> = ({ 
  ports, 
  onKillProcess, 
  loading, 
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDev, setShowOnlyDev] = useState(true);

  const filteredPorts = useMemo(() => {
    let filtered = ports;
    
    // Filter by development ports if enabled
    if (showOnlyDev) {
      filtered = filtered.filter(port => port.category !== 'other');
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(port => 
        port.port.toString().includes(term) ||
        port.processName.toLowerCase().includes(term) ||
        port.displayName?.toLowerCase().includes(term) ||
        port.state.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [ports, searchTerm, showOnlyDev]);

  const categorizedPorts = useMemo(() => {
    const categories = {
      frontend: [] as Port[],
      backend: [] as Port[],
      database: [] as Port[],
      other: [] as Port[]
    };
    
    filteredPorts.forEach(port => {
      const category = port.category || 'other';
      categories[category].push(port);
    });
    
    // Sort ports within each category
    Object.keys(categories).forEach(key => {
      categories[key as keyof typeof categories].sort((a, b) => a.port - b.port);
    });
    
    return categories;
  }, [filteredPorts]);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'frontend': return '🎨 Frontend';
      case 'backend': return '⚙️ Backend';
      case 'database': return '🗄️ Databases';
      case 'other': return '📦 Other Services';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Scanning ports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const totalDevPorts = ports.filter(p => p.category !== 'other').length;
  const totalPorts = ports.length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyDev}
              onChange={(e) => setShowOnlyDev(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Show development ports only
            </span>
          </label>
          
          <div className="text-sm text-gray-500">
            {showOnlyDev ? (
              <span>{totalDevPorts} dev {totalDevPorts === 1 ? 'port' : 'ports'}</span>
            ) : (
              <span>{totalPorts} total {totalPorts === 1 ? 'port' : 'ports'}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPorts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">
              {searchTerm ? 'No ports found matching your search' : 'No active development ports found'}
            </p>
            {showOnlyDev && totalPorts > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Try unchecking "Show development ports only" to see all ports
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {(['frontend', 'backend', 'database', 'other'] as const).map(category => {
              const categoryPorts = categorizedPorts[category];
              if (categoryPorts.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
                    {getCategoryTitle(category)} ({categoryPorts.length})
                  </h3>
                  <div className="space-y-2">
                    {categoryPorts.map((port) => (
                      <PortItem
                        key={`${port.port}-${port.pid}`}
                        port={port}
                        onKill={onKillProcess}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};