import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Seance from './seance.model.js'; 


const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  seance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Seance,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  // utilisateur_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: {
  //     model: Utilisateur,
  //     key: 'id',
  //   },
  //   onDelete: 'SET NULL',
  // },
  nb_places: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  statut_reservation: {
    type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee'),
    defaultValue: 'en_attente',
  },
  date_reservation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  date_expiration: {
    type: DataTypes.DATE,
  },
  prix_unitaire: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  prix_total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'reservation',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Reservation.belongsTo(Seance, { foreignKey: 'seance_id' });
// Reservation.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

export default Reservation;
