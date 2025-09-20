import express from 'express';
import filmRoutes from './routes/film.routes.js';
import reservationRoutes from "./routes/reservation.route.js";


const app = express();

// Middleware pour parser le JSON
app.use(express.json());

app.use('/films', filmRoutes);
app.use("/api/reservations", reservationRoutes);


export default app;

