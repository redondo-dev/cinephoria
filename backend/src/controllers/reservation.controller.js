import Reservation from '../models/reservation.model.js';

// Créer une réservation
export const createReservation = async (req, res) => {
  try {
    const { seance_id, nb_places, prix_unitaire } = req.body;
    const prix_total = nb_places * prix_unitaire;

    const reservation = await Reservation.create({
      seance_id,
      nb_places,
      prix_unitaire,
      prix_total,
      date_expiration: new Date(Date.now() + 2 * 60 * 60 * 1000), 
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur lors de la création :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la réservation.' });
  }
};

// Lister toutes les réservations
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Impossible de récupérer les réservations.' });
  }
};

// Récupérer une réservation par ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée.' });
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une réservation
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Réservation non trouvée.' });
    res.json({ message: 'Réservation supprimée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
};
