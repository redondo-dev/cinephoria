// Modèle Role /src/models/role.model.js

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";



const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    permission: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "role",      // correspond à ta table existante
    freezeTableName: true,  // pas de pluriel automatique
    timestamps: false       // pas de createdAt/updatedAt
  }
);

export default Role;
