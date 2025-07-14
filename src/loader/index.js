import express from 'express';
import loadExpress from './express.js';

const app = express();

loadExpress(app);

export default app;
