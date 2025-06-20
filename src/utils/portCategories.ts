export type PortCategory = 'frontend' | 'backend' | 'database' | 'other';

interface ProcessPattern {
  pattern: RegExp;
  category: PortCategory;
  displayName?: string;
}

const DEVELOPMENT_PATTERNS: ProcessPattern[] = [
  // Frontend
  { pattern: /node.*next/i, category: 'frontend', displayName: 'Next.js' },
  { pattern: /node.*vite/i, category: 'frontend', displayName: 'Vite' },
  { pattern: /node.*react/i, category: 'frontend', displayName: 'React' },
  { pattern: /node.*vue/i, category: 'frontend', displayName: 'Vue' },
  { pattern: /node.*angular/i, category: 'frontend', displayName: 'Angular' },
  { pattern: /node.*webpack/i, category: 'frontend', displayName: 'Webpack' },
  { pattern: /node.*parcel/i, category: 'frontend', displayName: 'Parcel' },
  { pattern: /node.*astro/i, category: 'frontend', displayName: 'Astro' },
  { pattern: /node.*nuxt/i, category: 'frontend', displayName: 'Nuxt' },
  { pattern: /node.*gatsby/i, category: 'frontend', displayName: 'Gatsby' },
  { pattern: /node.*remix/i, category: 'frontend', displayName: 'Remix' },
  
  // Backend
  { pattern: /python.*fastapi/i, category: 'backend', displayName: 'FastAPI' },
  { pattern: /python.*django/i, category: 'backend', displayName: 'Django' },
  { pattern: /python.*flask/i, category: 'backend', displayName: 'Flask' },
  { pattern: /node.*express/i, category: 'backend', displayName: 'Express' },
  { pattern: /node.*fastify/i, category: 'backend', displayName: 'Fastify' },
  { pattern: /node.*koa/i, category: 'backend', displayName: 'Koa' },
  { pattern: /node.*nest/i, category: 'backend', displayName: 'NestJS' },
  { pattern: /node.*strapi/i, category: 'backend', displayName: 'Strapi' },
  { pattern: /ruby.*rails/i, category: 'backend', displayName: 'Rails' },
  { pattern: /php.*laravel/i, category: 'backend', displayName: 'Laravel' },
  { pattern: /java.*spring/i, category: 'backend', displayName: 'Spring Boot' },
  { pattern: /beam\.smp/i, category: 'backend', displayName: 'Elixir/Phoenix' },
  { pattern: /bun.*run/i, category: 'backend', displayName: 'Bun' },
  { pattern: /deno/i, category: 'backend', displayName: 'Deno' },
  
  // Databases
  { pattern: /postgres/i, category: 'database', displayName: 'PostgreSQL' },
  { pattern: /mysql/i, category: 'database', displayName: 'MySQL' },
  { pattern: /mongod/i, category: 'database', displayName: 'MongoDB' },
  { pattern: /redis-server/i, category: 'database', displayName: 'Redis' },
  { pattern: /supabase/i, category: 'database', displayName: 'Supabase' },
  { pattern: /docker.*postgres/i, category: 'database', displayName: 'PostgreSQL (Docker)' },
  { pattern: /docker.*mysql/i, category: 'database', displayName: 'MySQL (Docker)' },
  { pattern: /docker.*mongo/i, category: 'database', displayName: 'MongoDB (Docker)' },
  { pattern: /docker.*redis/i, category: 'database', displayName: 'Redis (Docker)' },
  { pattern: /elasticsearch/i, category: 'database', displayName: 'Elasticsearch' },
  { pattern: /cassandra/i, category: 'database', displayName: 'Cassandra' },
  { pattern: /couchdb/i, category: 'database', displayName: 'CouchDB' },
  { pattern: /neo4j/i, category: 'database', displayName: 'Neo4j' },
];

// Common development ports
const COMMON_DEV_PORTS = new Set([
  3000, 3001, 3002, 3003, // React, Next.js
  4200, 4201, // Angular
  5000, 5001, 5173, 5174, // Vite, Flask
  8000, 8001, 8080, 8081, // Django, FastAPI, general web servers
  8888, // Jupyter
  9000, 9001, // PHP-FPM
  4000, 4001, // Phoenix
  1337, // Strapi
  5432, // PostgreSQL
  3306, // MySQL
  27017, // MongoDB
  6379, // Redis
  9200, 9300, // Elasticsearch
  5984, // CouchDB
  7474, 7687, // Neo4j
]);

export function categorizePort(processName: string, port: number): { category: PortCategory; displayName?: string } {
  // Check against known patterns
  for (const { pattern, category, displayName } of DEVELOPMENT_PATTERNS) {
    if (pattern.test(processName)) {
      return { category, displayName };
    }
  }
  
  // Check if it's a common dev port
  if (COMMON_DEV_PORTS.has(port)) {
    // Try to guess based on port number
    if (port >= 3000 && port < 4000) return { category: 'frontend' };
    if (port >= 5000 && port < 6000) return { category: 'backend' };
    if (port === 5432 || port === 3306 || port === 27017 || port === 6379) return { category: 'database' };
    return { category: 'backend' };
  }
  
  // Check for Node.js processes on common ports
  if (processName.toLowerCase().includes('node') && COMMON_DEV_PORTS.has(port)) {
    return { category: 'frontend' };
  }
  
  return { category: 'other' };
}

export function isDevelopmentPort(processName: string, port: number): boolean {
  const { category } = categorizePort(processName, port);
  return category !== 'other';
}