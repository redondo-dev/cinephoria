// Charger .env.test si on est en mode test
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
}
// tests/films/film.controller.test.js
import request from "supertest";
import app from "../../src/app.js";
import sequelize from "../../src/config/database.js";
import Genre from "../../src/models/genre.model.js";
import Film from "../../src/models/film.model.js";
import dotenv from 'dotenv';



beforeAll(async () => {
  // Recréer la base de données
  await sequelize.sync({ force: true });
  
  // creer un genre pour les tests de films
  await Genre.create({
    id: 1,
    nom: 'Science-fiction'
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Routes Film", () => {
  let filmId; // Variable partagée pour tous les tests

  // Tests POST - doivent être exécutés en premier
  it("POST /films - crée un film avec genre", async () => {
    const res = await request(app)
      .post("/films")
      .send({
        titre: "Matrix",
        description: "Film de science-fiction", 
        age_min: 12,
        duree: 136,
        genre_id: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.titre).toBe("Matrix");
    expect(res.body.id).toBeDefined();
    filmId = res.body.id; // Sauvegarder l'ID pour les tests suivants
  });

  it("POST /films - crée un deuxième film", async () => {
    const res = await request(app)
      .post("/films")
      .send({
        titre: "Inception",
        description: "Science-fiction",
        duree: 148,
        age_min: 13,
        genre_id: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.titre).toBe("Inception");
  });

  it("POST /films - retourne 400 sans titre", async () => {
    const res = await request(app)
      .post("/films")
      .send({
        description: "Film sans titre",
        duree: 120,
        genre_id: 1
      });
    
    expect(res.statusCode).toBe(400);
  });

  it("POST /films - retourne 400 sans genre_id", async () => {
    const res = await request(app)
      .post("/films")
      .send({
        titre: "Film sans genre",
        description: "Description",
        duree: 120
      });
    
    expect(res.statusCode).toBe(400);
  });

  // Tests GET
  it("GET /films - récupère tous les films", async () => {
    const res = await request(app).get("/films");
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /films/:id - récupère un film par ID", async () => {
    const res = await request(app).get(`/films/${filmId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.titre).toBe("Matrix");
    expect(res.body.id).toBe(filmId);
  });

  it("GET /films/:id - retourne 404 pour un film inexistant", async () => {
    const res = await request(app).get("/films/999");
    
    expect(res.statusCode).toBe(404);
  });

 // Tests PUT
  it("PUT /films/:id - modifie un film existant", async () => {
    const res = await request(app)
      .put(`/films/${filmId}`)
      .send({
        titre: "Matrix Reloaded",
        description: "Suite de Matrix",
        duree: 138,
        age_min: 12,
        genre_id: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.titre).toBe("Matrix Reloaded");
    expect(res.body.description).toBe("Suite de Matrix");
    expect(res.body.duree).toBe(138);
  });

  it("PUT /films/:id - modifie partiellement un film", async () => {
    const res = await request(app)
      .put(`/films/${filmId}`)
      .send({
        titre: "Matrix Updated"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.titre).toBe("Matrix Updated");
  });

  it("PUT /films/:id - retourne 404 pour un film inexistant", async () => {
    const res = await request(app)
      .put("/films/999")
      .send({
        titre: "Film inexistant"
      });

    expect(res.statusCode).toBe(404);
  });
// Tests DELETE
describe("DELETE /films/:id", () => {
    let filmToDeleteId;

    beforeEach(async () => {
      // Créer un film spécialement pour le test de suppression
      const film = await Film.create({
        titre: "Film à supprimer",
        description: "Ce film sera supprimé",
        duree: 90,
        age_min: 10,
        genre_id: 1
      });
      filmToDeleteId = film.id;
    });

    it("supprime un film existant", async () => {
      const res = await request(app)
        .delete(`/films/${filmToDeleteId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Film supprimé avec succès");

      // Vérifier que le film a bien été supprimé
      const deletedFilm = await Film.findByPk(filmToDeleteId);
      expect(deletedFilm).toBeNull();
    });

    it("retourne 404 pour un film inexistant", async () => {
      const res = await request(app)
        .delete("/films/999");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Film non trouvé");
    });

    it("retourne 400 avec un ID invalide", async () => {
      const res = await request(app)
        .delete("/films/abc");

      expect(res.statusCode).toBe(400);
    });
  });
});
