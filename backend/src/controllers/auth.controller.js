// src/controllers/auth.controller.js
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email et mot de passe requis" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    // Générer un JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    // ✅ Stocker le JWT dans un cookie HttpOnly
    res.cookie("auth_token", token, {
      httpOnly: true,   // inaccessible via JS → protège contre XSS
      secure: process.env.NODE_ENV === "production", // seulement HTTPS en prod
      sameSite: "strict", // protection CSRF basique
      maxAge: 3600000 // 1h en ms
    });

    res.json({ message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGOUT : supprimer le cookie
export const logout = (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Déconnexion réussie" });
};
