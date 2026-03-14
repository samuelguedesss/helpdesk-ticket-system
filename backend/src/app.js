import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true}))

app.use('/api', router);

// Servir arquivos de upload locais
app.use('/uploads', express.static(path.join(dirname, '../uploads')));

// Static frontend
app.use(express.static(path.join(dirname, '../../frontend/dist')));

// SPA fallback
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(dirname, '..', '..', 'frontend', 'dist', 'index.html'));
});

export default app;