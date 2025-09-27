import express from 'express';

import reservationRoutes from './routes/reservation.route.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(cors());
// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

// Routes pour les réservations
app.use('/api/reservations', reservationRoutes);

// Routes

app.get("/", (req, res) => res.send("Bienvenue sur Cinephoria API"));


export default app;

