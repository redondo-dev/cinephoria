'use strict';

/**
 * Suppression de la table pivot reservation_siege — Billet devient l'unique
 * source de vérité pour la relation réservation ↔ siège (suite logique de
 * 20260901120000-fix-billet-table.cjs).
 *
 * La procédure de diagnostic verifier_coherence_reservation() est mise à jour
 * pour utiliser billet.siege_id au lieu du pivot avant que celui-ci ne soit
 * supprimé.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `CREATE OR REPLACE PROCEDURE public.verifier_coherence_reservation()
            LANGUAGE plpgsql
            AS $$
        DECLARE
          rec RECORD;
        BEGIN
          FOR rec IN
            SELECT 
              s.id AS seance_id,
              sa.nom_salle,
              sa.capacite,
              COUNT(DISTINCT b.siege_id) AS places_reservees
            FROM seance s
            JOIN salle sa ON s.salle_id = sa.id
            LEFT JOIN billet b ON b.seance_id = s.id AND b.statut_billet != 'annule'
            GROUP BY s.id, sa.nom_salle, sa.capacite
            HAVING COUNT(DISTINCT b.siege_id) > sa.capacite
          LOOP
            RAISE NOTICE 'Dépassement dans salle %: % places réservées > % capacité', rec.nom_salle, rec.places_reservees, rec.capacite;
          END LOOP;

          FOR rec IN
            SELECT r.id FROM reservation r
            LEFT JOIN seance s ON r.seance_id = s.id
            WHERE s.id IS NULL
          LOOP
            RAISE NOTICE 'Réservation orpheline détectée: id %', rec.id;
          END LOOP;
        END;
        $$;`,
        { transaction: t }
      );

      await queryInterface.sequelize.query(
        `DROP TABLE IF EXISTS public.reservation_siege;`,
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS public.reservation_siege (
        "createdAt" timestamp with time zone NOT NULL,
        "updatedAt" timestamp with time zone NOT NULL,
        reservation_id integer NOT NULL,
        siege_id integer NOT NULL,
        PRIMARY KEY (reservation_id, siege_id),
        CONSTRAINT reservation_siege_reservation_id_fkey
          FOREIGN KEY (reservation_id) REFERENCES public.reservation(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT reservation_siege_siege_id_fkey
          FOREIGN KEY (siege_id) REFERENCES public.siege(id)
          ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
  },
};
