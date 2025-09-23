import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    nom: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false ,  field: 'isconfirmed'  },
    mustChangePassword: { type: DataTypes.BOOLEAN, defaultValue: false,field: 'mustchangepassword'  },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW,field: 'createdat' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW ,field: 'updatedat'},
    role_id: { type: DataTypes.INTEGER, allowNull: false , references: {
    model: 'role', 
    key: 'id'
  } } // clé étrangère
  },
  {
    tableName: "utilisateur",
    freezeTableName: true,
  }
);

User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export default User;

