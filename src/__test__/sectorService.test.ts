import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";
import { generateTestToken } from "./helpers/generateToken";

const token = generateTestToken();

// ----------------------------------------------------------------
// GET /api/v1/sectors
// ----------------------------------------------------------------
describe("GET /api/v1/sectors", () => {
    it("Deve retornar uma lista de todos os setores. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/sectors");

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/sectors/:id
// ----------------------------------------------------------------
describe("GET /api/v1/sectors/:id", () => {
    it("Deve retornar um setor específico. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/sectors/1");

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_sector");
    });

    it("Deve retornar erro pois o setor não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/sectors/999999999");

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/sectors/abc");

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/sectors
// ----------------------------------------------------------------
describe("POST /api/v1/sectors", () => {
    it("Deve retornar erro pois os dados estão faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/sectors")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe um setor com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/sectors")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Setor de Literatura", letter: "Z", category: 1 }); // nome já existe na seed

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe um setor com essa letra. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/sectors")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Setor Novo", letter: "A", category: 1 }); // letra A já existe na seed

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois a categoria não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/sectors")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Setor Novo", letter: "Z", category: 999999999, institution: 1 });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .post("/api/v1/sectors")
            .send({ name: "Setor Novo", letter: "Z", category: 1 });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/sectors/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/sectors/:id", () => {
    it("Deve retornar erro pois o setor não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/999999999")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois já existe outro setor com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Setor de Tecnologia" }); // nome de outro setor existente

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe outro setor com essa letra. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ letter: "B" }); // letra de outro setor existente

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve atualizar o setor com o mesmo nome e letra sem retornar erro. STATUS: 200", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Setor de Literatura", letter: "A" }); // mesmo nome e letra do próprio setor

        expect(response.status).toBe(HTTPCODES.OK);
    });

    it("Deve retornar erro pois o ID da categoria não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ category: "abc" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .put("/api/v1/sectors/1")
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/sectors/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/sectors/:id", () => {
    it("Deve retornar erro pois o setor não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/sectors/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/sectors/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .delete("/api/v1/sectors/1");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});