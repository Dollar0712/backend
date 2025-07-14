import express from 'express';
import cors from 'cors';

import apiRoutes from '../app/routes/api.js';

export default function loadExpress(app) {

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
}
