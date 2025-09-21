// tests/film.model.test.js
import sequelize from "../../src/config/database.js";
import Film from "../../src/models/film.model.js";

beforeAll(async () => {
  await sequelize.sync({ force: true }); // recrée la DB pour les tests
});

afterAll(async () => {
  await sequelize.close();
});

describe("Modèle Film", () => {
  it("doit créer un film", async () => {
    const film = await Film.create({
      titre: "Inception",
      description: "Film de science-fiction",
      duree: 148,
      age_min: 13
    });
    expect(film.id).toBeDefined();
    expect(film.titre).toBe("Inception");
  });

  it("doit récupérer un film par id", async () => {
    const film = await Film.findByPk(1);
    expect(film.titre).toBe("Inception");
  });
});
