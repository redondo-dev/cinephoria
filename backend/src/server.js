import 'dotenv/config';
import app from './app.js';
import { sequelize, Film, Seance, Salle, Cinema } from './models/index.js';



const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
  
    await sequelize.sync({ alter: true }); 
    console.log('✅ Modèles synchronisés avec la base');

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Impossible de se connecter à la BDD:', err);
    process.exit(1);
  }
};

startServer();
