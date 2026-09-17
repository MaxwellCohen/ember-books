import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

function connectionString() {
  return (process.env.POSTGRES_URL || process.env.DATABASE_URL || '').trim();
}

let sql = null;
let db = null;

export function getDb() {
  const url = connectionString();
  if (!url) return null;
  if (!sql) sql = neon(url, { disableWarningInBrowsers: true });
  if (!db) db = drizzle(sql);
  return db;
}
