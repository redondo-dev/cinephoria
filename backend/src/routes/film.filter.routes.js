//route/film.filter.routes.js

import { Router } from 'express';
import { filterFilms } from '../controllers/film.filter.controller.js';

const router = Router();

// GET /films/filter?genre_id=x&cinema_id=x&date_seance=xxxx-xx-xx
router.get('/filter', filterFilms);

export default router;
