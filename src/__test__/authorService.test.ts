import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";
import { generateTestToken } from "./helpers/generateToken";

const token = generateTestToken();

// ----------------------------------------------------------------
// GET /api/v1/authors
// ----------------------------------------------------------------
describe("GET /api/v1/authors", () => {
    it("Deve retornar uma lista de todos os autores. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/authors")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/authors/:id
// ----------------------------------------------------------------
describe("GET /api/v1/authors/:id", () => {
    it("Deve retornar um autor específico. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/authors/1")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_author");
    });

    it("Deve retornar erro pois o autor não existe. STATUS: 404", async () => {
        const response = await request(app)
            .get("/api/v1/authors/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .get("/api/v1/authors/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/authors
// ----------------------------------------------------------------
describe("POST /api/v1/authors", () => {
    it("Deve retornar erro pois o nome está faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/authors")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe um autor com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/authors")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Robert C. Martin" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o nome não é uma string. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/authors")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: 123 });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/authors/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/authors/:id", () => {
    it("Deve retornar erro pois o autor não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/authors/999999999")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o nome está faltando. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/authors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe outro autor com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/authors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Robert C. Martin" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve atualizar o autor com o mesmo nome sem retornar erro. STATUS: 200", async () => {
        const response = await request(app)
            .put("/api/v1/authors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Gardiner Harris" });

        expect(response.status).toBe(HTTPCODES.OK);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/authors/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/authors/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/authors/:id", () => {
    it("Deve retornar erro pois o autor não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/authors/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/authors/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});