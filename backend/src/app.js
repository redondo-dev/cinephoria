import express from 'express';
const app = express();

// Middleware pour parser le JSON
app.use(express.json());


export default app;

