import { Router } from 'express';
import { createFilm, getAllFilms ,updateFilm,deleteFilm, getFilmById} from '../controllers/film.controller.js';

const router = Router();

router.post('/', createFilm);         // Créer un film
router.get('/', getAllFilms);   // Récupérer tous les films
router.get('/:id', getFilmById); // Récupérer un film par id
router.put('/:id', updateFilm);       // Mettre à jour un film par id
router.delete('/:id', deleteFilm);    // Supprimer un film par id

export default router;
