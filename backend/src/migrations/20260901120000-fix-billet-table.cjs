'use strict';

/**
 * Corrige la table billet pour l'option B (Billet = source de vérité unique) :
 *  1. Supprime les billets orphelins / cassés trouvés en base (reservation_id
 *     NULL ou pointant vers une réservation qui n'existe plus).
 *  2. Étend la contrainte CHECK sur statut_billet pour inclure 'en_attente'.
 *  3. Rend reservation_id obligatoire (NOT NULL).
 *  4. Ajoute un index unique PARTIEL sur (siege_id, seance_id) qui exclut les
 *     billets annulés — un siège annulé redevient réservable.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      // 1. Nettoyage des données cassées (cf. investigation : 11/11 billets étaient
      //    orphelins ou incomplets, résidus de tests manuels)
      await queryInterface.sequelize.query(
        `DELETE FROM billet
         WHERE reservation_id IS NULL
            OR reservation_id NOT IN (SELECT id FROM reservation);`,
        { transaction: t }
        
      );

      // 2. Recherche dynamique du nom réel de la contrainte CHECK existante
      //    (on ne suppose pas son nom, on l'interroge dans le catalogue système)
      const [constraints] = await queryInterface.sequelize.query(
        `SELECT con.conname
         FROM pg_constraint con
         JOIN pg_class rel ON rel.oid = con.conrelid
         WHERE rel.relname = 'billet'
           AND con.contype = 'c'
           AND pg_get_constraintdef(con.oid) ILIKE '%statut_billet%';`,
        { transaction: t }
      );

      for (const c of constraints) {
        await queryInterface.sequelize.query(
          `ALTER TABLE billet DROP CONSTRAINT "${c.conname}";`,
          { transaction: t }
        );
      }

      await queryInterface.sequelize.query(
        `ALTER TABLE billet
         ADD CONSTRAINT billet_statut_billet_check
         CHECK (statut_billet IN ('en_attente', 'valide', 'utilise', 'annule'));`,
        { transaction: t }
      );

      // 3. reservation_id devient obligatoire
      await queryInterface.changeColumn(
        'billet',
        'reservation_id',
        { type: Sequelize.INTEGER, allowNull: false },
        { transaction: t }
      );

      // 4. Index unique partiel : un siège ne peut avoir qu'UN billet actif
      //    (non annulé) par séance
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS unique_siege_actif_par_seance;`,
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX unique_siege_actif_par_seance
         ON billet (siege_id, seance_id)
         WHERE statut_billet != 'annule';`,
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS unique_siege_actif_par_seance;`
    );
    await queryInterface.changeColumn('billet', 'reservation_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      `ALTER TABLE billet DROP CONSTRAINT IF EXISTS billet_statut_billet_check;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE billet
       ADD CONSTRAINT billet_statut_billet_check
       CHECK (statut_billet IN ('valide', 'utilise', 'annule'));`
    );
    // Note : la suppression ne restaure pas les lignes supprimées par le up() —
    // c'était des données de test cassées, pas des données à préserver.
  },
};