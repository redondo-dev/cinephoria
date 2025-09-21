import express from 'express';
import filmRoutes from './routes/film.routes.js';



const app = express();

// Middleware pour parser le JSON
app.use(express.json());

app.use('/films', filmRoutes);



export default app;

