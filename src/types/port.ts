import { PortCategory } from '../utils/portCategories';

export interface Port {
  port: number;
  processName: string;
  pid: number;
  protocol: 'TCP' | 'UDP';
  state: 'LISTEN' | 'ESTABLISHED' | 'CLOSE_WAIT' | 'TIME_WAIT' | 'SYN_SENT' | 'SYN_RECV';
  address: string;
  category?: PortCategory;
  displayName?: string;
}

export interface GroupedPort {
  processName: string;
  ports: Port[];
  totalConnections: number;
}