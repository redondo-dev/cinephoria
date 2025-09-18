// models/seance.model.js

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";



const Seance = sequelize.define("Seance", {

    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date_seance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },


}, {
  tableName: "seance",
  timestamps: false,
});




export default Seance;
