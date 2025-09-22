import express from 'express';
import filmRoutes from './routes/film.routes.js';
import reservationRoutes from './routes/reservation.route.js';
import cors from 'cors';

const app = express();
app.use(cors());
// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/films', filmRoutes);
app.use('/api/reservations', reservationRoutes);



export default app;

