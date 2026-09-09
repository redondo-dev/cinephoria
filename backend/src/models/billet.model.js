// src/models/billet.model.js
import { DataTypes, Op } from "sequelize";
import sequelize from "../config/database.js";

const STATUTS_BILLET = ["en_attente", "valide", "utilise", "annule"];

const Billet = sequelize.define(
  "Billet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // corrige l'absence de NOT NULL constatée en base
      references: {
        model: "reservation",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // si la réservation est supprimée, ses billets le sont aussi
    },

    siege_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "siege",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // interdit de supprimer un siège tant qu'un billet y fait référence
    },

    seance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "seance",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    tarif_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tarif",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    // STRING + validate, pas ENUM : correspond au character varying + CHECK réel en base
    statut_billet: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "en_attente",
      validate: {
        isIn: {
          args: [STATUTS_BILLET],
          msg: `statut_billet doit être l'une des valeurs : ${STATUTS_BILLET.join(", ")}`,
        },
      },
    },

    qr_code: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    prix_final: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Le prix final ne peut pas être négatif",
        },
      },
    },

    date_expiration_qr: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    date_utilisation_qr: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "billet",
    timestamps: true,
    createdAt: "created_at",
     updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["qr_code"],
        name: "unique_billet_qr_code",
      },
      {
        // Un siège ne peut avoir qu'UN SEUL billet actif (non annulé) par séance.
        // Index partiel : un billet annulé libère le siège pour une nouvelle vente.
        unique: true,
        fields: ["siege_id", "seance_id"],
        name: "unique_siege_actif_par_seance",
        where: {
          statut_billet: { [Op.ne]: "annule" },
        },
      },
    ],
  }
);

export default Billet;
export { STATUTS_BILLET };