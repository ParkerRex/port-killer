import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Port } from '../types/port';
import { categorizePort } from '../utils/portCategories';

export const usePorts = (refreshInterval: number = 2000) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scanPorts = useCallback(async () => {
    try {
      setError(null);
      const result = await invoke<Port[]>('scan_ports');
      
      // Add category information to each port
      const categorizedPorts = result.map(port => {
        const { category, displayName } = categorizePort(port.processName, port.port);
        return {
          ...port,
          category,
          displayName
        };
      });
      
      setPorts(categorizedPorts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan ports');
    } finally {
      setLoading(false);
    }
  }, []);

  const killProcess = useCallback(async (pid: number) => {
    try {
      await invoke('kill_process', { pid });
      await scanPorts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to kill process');
    }
  }, [scanPorts]);

  useEffect(() => {
    scanPorts();
    const interval = setInterval(scanPorts, refreshInterval);
    return () => clearInterval(interval);
  }, [scanPorts, refreshInterval]);

  return { ports, loading, error, refreshPorts: scanPorts, killProcess };
};