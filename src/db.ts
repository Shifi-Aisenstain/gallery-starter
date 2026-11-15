import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

export type Gallery = {
  id: number;
  name: string;
  photographer: string;
  status: 'draft' | 'published';
};

const DB_PATH = 'data/app.db';

export function getDatabase(): DatabaseSync {
  mkdirSync('data', { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS galleries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photographer TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published'))
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as count FROM galleries').get() as { count: number };
  if (count.count === 0) {
    db.prepare(
      'INSERT INTO galleries (name, photographer, status) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)'
    ).run(
      'Levi wedding', 'dana', 'draft',
      'Cohen bar mitzvah', 'dana', 'published',
      'Tel Aviv portraits', 'noa', 'published'
    );
  }

  return db;
}

export function listGalleriesForUser(userId: string): Gallery[] {
  const db = getDatabase();
  const rows = db.prepare(
    'SELECT id, name, photographer, status FROM galleries WHERE photographer = ? ORDER BY id ASC'
  ).all(userId) as Array<{ id: number; name: string; photographer: string; status: 'draft' | 'published' }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    photographer: row.photographer,
    status: row.status,
  }));
}
