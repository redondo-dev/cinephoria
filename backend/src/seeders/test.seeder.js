// src/seeders/test.seeder.js
import bcrypt from 'bcrypt'
import {User } from '../models/index.js'
import sequelize from '../config/database.js' 

export const seedTestData = async () => {
  console.log('🌱 Insertion des données de test...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  
  const users = [
    { email: 'test@cinema.fr',    prenom: 'Test',    nom: 'Cypress', role_id: 1 },
    { email: 'admin@cinema.fr',   prenom: 'Admin',   nom: 'Test',    role_id: 2 },
    { email: 'employe@cinema.fr', prenom: 'Employe', nom: 'Test',    role_id: 3 },
  ]

  for (const u of users) {
    await User.upsert({
      ...u,
      password: hashedPassword,
      isConfirmed: true,          // ← force toujours à true
      mustChangePassword: false
    })
    console.log(`  ✓ ${u.email}`)
  }

  console.log('✅ Données de test insérées')

 // === 2. SÉANCES DE TEST (AJOUT) ===
  console.log('  🌱 Ajout des séances de test...')
  
 const seances = [
  { 
    id: 15, 
    film_id: 1, 
    salle_id: 1, 
    date_heure_debut: new Date(Date.now() + 86400000),  // demain
    date_heure_fin: new Date(Date.now() + 86400000 + 7200000),  // +2h
  },
  { 
    id: 3725, 
    film_id: 1, 
    salle_id: 1, 
    date_heure_debut: new Date(Date.now() + 172800000),  // dans 2 jours
    date_heure_fin: new Date(Date.now() + 172800000 + 7200000),  // +2h
  }
];

for (const s of seances) {
  await sequelize.query(
    `INSERT INTO seance (id, film_id, salle_id, date_heure_debut, date_heure_fin)
     VALUES (?,?,?,?,?)
     ON CONFLICT (id) DO NOTHING`,
    { replacements: [s.id, s.film_id, s.salle_id, s.date_heure_debut, s.date_heure_fin] }
  );
}
 
  console.log('  ✅ Séances de test ajoutées (15, 3725)')
  console.log('✅ Données de test insérées')
}

export const cleanTestData = async () => {
  console.log('🧹 Nettoyage...')

await sequelize.query(
    `DELETE FROM seance WHERE id IN (15, 3725)`
  )
  await User.destroy({
    where: {
      email: ['test@cinema.fr', 'admin@cinema.fr', 'employe@cinema.fr']
    }
  })
  console.log('✅ Données supprimées')
}
  


