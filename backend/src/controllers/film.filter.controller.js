// src/controllers/film.filter.controller.js
import { Op } from 'sequelize';
import { Film, Seance, Salle, Cinema, Genre } from '../models/index.js';


 // Controller pour filtrer les films selon genre, cinéma et date de séance

export const filterFilms = async (req, res) => {
  try {
    const { genre_id, cinema_id, date_seance } = req.query;

    // 1️- Conditions dynamiques pour Film
    const whereFilm = {};
    if (genre_id) whereFilm.genre_id = genre_id;

    // 2️- Conditions dynamiques pour Seance
    const whereSeance = {};
    if (date_seance) {
      const dateStart = new Date(date_seance);
      const dateEnd = new Date(date_seance);
      dateEnd.setDate(dateEnd.getDate() + 1); // pour inclure toute la journée
      whereSeance.date_seance = { [Op.gte]: dateStart, [Op.lt]: dateEnd };
    }

    // 3️- Conditions dynamiques pour Cinema
    const whereCinema = {};
    if (cinema_id) whereCinema.id = cinema_id;

    // 4️- Recherche avec Sequelize
    const films = await Film.findAll({
      where: whereFilm,
      include: [
        {
          model: Seance,
          as: 'seances', 
          where: Object.keys(whereSeance).length ? whereSeance : undefined,
          required: !!date_seance || !!cinema_id, 
          include: [
            {
              model: Salle,
              as: 'salle', 
              include: [
                {
                  model: Cinema,
                  as: 'cinema', 
                  where: Object.keys(whereCinema).length ? whereCinema : undefined
                }
              ]
            }
          ]
        },
        {
          model: Genre,
          as: 'genre'
        }
      ]
    });

    res.json(films);
  } catch (error) {
    console.error("Erreur dans filterFilms :", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des films.', error: error.message });
  }
};
