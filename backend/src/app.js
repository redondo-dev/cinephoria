import express from 'express';
import reservationRoutes from './routes/reservation.routes.js';
const app = express();

// Middleware pour parser le JSON
app.use(express.json());



app.use('/api/reservations', reservationRoutes);



export default app;

