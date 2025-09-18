//route/film.routes.js

import { Router } from 'express';
import { createFilm, getAllFilms, getFilmById, updateFilm,deleteFilm} from '../controllers/film.controller.js';
import { filterFilms } from '../controllers/film.filter.controller.js';

const router = Router();

router.get('/filter', filterFilms); //filter films par genre , cinema ,et date de seance.

router.post('/', createFilm);         // Créer un film
router.get('/', getAllFilms);   // Récupérer tous les films
router.get('/:id', getFilmById); // Récupérer un film par id
router.put('/:id', updateFilm);       // Mettre à jour un film par id
router.delete('/:id', deleteFilm);    // Supprimer un film par id






export default router;
