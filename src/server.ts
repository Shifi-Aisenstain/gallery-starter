import express, { type Request, type Response } from 'express';
import { listGalleriesForUser } from './db.js';

export const app = express();
const port = 3000;

app.get('/api/galleries', (req: Request, res: Response) => {
  const userId = req.get('X-User-Id') ?? '';
  const galleries = listGalleriesForUser(userId);
  res.json(galleries);
});

export function startServer() {
  return app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  startServer();
}
