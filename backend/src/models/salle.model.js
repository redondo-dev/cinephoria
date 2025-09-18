// models/salle.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Salle = sequelize.define("Salle", {

     id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nom_salle: {
    type: DataTypes.STRING,
    allowNull: false
  },

  capacite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  tableName: "salle",
  timestamps: false,
});



export default Salle;
