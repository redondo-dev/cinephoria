import Film from '../models/film.model.js';
import request from "supertest";

// POST /api/films - Crée un nouveau film dans la base de données.

export const createFilm = async (req, res) => {
  try {
    const { titre, description, affiche, age_min, duree, date_ajout, coup_coeur, note_moyenne, nb_avis, genre_id } = req.body;

    if (!titre || !duree || !genre_id) {
      return res.status(400).json({ message: 'Titre, durée et genre_id sont obligatoires.' });
    }

    const film = await Film.create({ titre, description, affiche, age_min, duree, date_ajout, coup_coeur, note_moyenne, nb_avis, genre_id });
    res.status(201).json(film);
  } catch (err) {
    console.error(err);   
    res.status(500).json({ message: 'Erreur lors de la création du film.' });
  }
};

// GET /api/films -Recuperer tous les  films  de la base de données.

export const getAllFilms = async (req, res) => {
  try {
    const films = await Film.findAll();
    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des films.' });
  }
};

// GET /api/films/:id  - Recuperer les  films  par Identifiant de la base de données.

export const getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findByPk(id);
    if (!film) return res.status(404).json({ message: 'Film non trouvé.' });
    res.json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération du film.' });
  }
}

// PUT /api/films/:id  - Modifier des films  par Identifiant de la base de données.

export const updateFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findByPk(id);
    if (!film) return res.status(404).json({ message: 'Film non trouvé.' });

    await film.update(req.body);
    res.json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du film.' });
  }
};

// DELETE /api/films/:id - Supprimer les films par identifiant de la base de données.

export const deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;
    // Convertir en entier
    const filmId = Number.parseInt(id, 10);

    // Vérifier que l'ID est bien un entier positif
    if (Number.isNaN(filmId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const film = await Film.findByPk(id);
    if (!film) return res.status(404).json({ message: 'Film non trouvé' });
    
    await Film.destroy({ where: { id } });

    res.json({ message: 'Film supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression du film' });
  }
};


