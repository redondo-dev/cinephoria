

import bcrypt from 'bcrypt'
import { User } from '../models/index.js'
import sequelize from '../config/database.js'

export const seedTestData = async () => {
  console.log('🌱 Insertion des données de test...')

  // === 1. UTILISATEURS ===
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
      isConfirmed: true,
      mustChangePassword: false
    })
    console.log(`  ✓ ${u.email}`)
  }

  // === 2. SIÈGES DE TEST ===
  console.log('  🌱 Ajout des sièges de test...')
  
  const sieges = [
    { id: 43, salle_id: 1, rangee: 'A', numero_siege: 1, type_siege: 'classique', etat_siege: 'Libre', statut_siege: 'Disponible' },
    { id: 44, salle_id: 1, rangee: 'A', numero_siege: 2, type_siege: 'classique', etat_siege: 'Libre', statut_siege: 'Disponible' }
  ]

  for (const s of sieges) {
    await sequelize.query(
      `INSERT INTO siege (id, salle_id, rangee, numero_siege, type_siege, etat_siege, statut_siege)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (id) DO NOTHING`,
      { replacements: [s.id, s.salle_id, s.rangee, s.numero_siege, s.type_siege, s.etat_siege, s.statut_siege] }
    )
  }
  console.log('  ✅ Sièges de test ajoutés (43, 44)')

  console.log('✅ Données de test insérées')
}

export const cleanTestData = async () => {
  console.log('🧹 Nettoyage...')
  
  // Nettoyer les sièges de test
  await sequelize.query(`DELETE FROM siege WHERE id IN (43, 44)`)
  
  await User.destroy({
    where: {
      email: ['test@cinema.fr', 'admin@cinema.fr', 'employe@cinema.fr']
    }
  })
  console.log('✅ Données supprimées')
}
