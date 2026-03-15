import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";
import { generateTestToken } from "./helpers/generateToken";

const token = generateTestToken();

// ----------------------------------------------------------------
// GET /api/v1/categories
// ----------------------------------------------------------------
describe("GET /api/v1/categories", () => {
    it("Deve retornar uma lista de todas as categorias. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/categories")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/categories/:id
// ----------------------------------------------------------------
describe("GET /api/v1/categories/:id", () => {
    it("Deve retornar uma categoria específica. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/categories/1")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_category");
    });

    it("Deve retornar erro pois a categoria não existe. STATUS: 404", async () => {
        const response = await request(app)
            .get("/api/v1/categories/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .get("/api/v1/categories/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/categories
// ----------------------------------------------------------------
describe("POST /api/v1/categories", () => {
    it("Deve retornar erro pois o nome está faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/categories")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe uma categoria com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/categories")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Literatura" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/categories/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/categories/:id", () => {
    it("Deve retornar erro pois a categoria não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/categories/999999999")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o nome está faltando. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/categories/1")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe outra categoria com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/categories/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Tecnologia" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve atualizar a categoria com o mesmo nome sem retornar erro. STATUS: 200", async () => {
        const response = await request(app)
            .put("/api/v1/categories/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Literatura" });

        expect(response.status).toBe(HTTPCODES.OK);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/categories/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/categories/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/categories/:id", () => {
    it("Deve retornar erro pois a categoria não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/categories/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/categories/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});