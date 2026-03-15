import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";
import { generateTestToken } from "./helpers/generateToken";

const token = generateTestToken();

// ----------------------------------------------------------------
// GET /api/v1/bookcases
// ----------------------------------------------------------------
describe("GET /api/v1/bookcases", () => {
    it("Deve retornar uma lista de todas as prateleiras. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/bookcases");

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/bookcases/:id
// ----------------------------------------------------------------
describe("GET /api/v1/bookcases/:id", () => {
    it("Deve retornar uma prateleira específica. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/bookcases/1");

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_bookcase");
    });

    it("Deve retornar erro pois a prateleira não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/bookcases/999999999");

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/bookcases/abc");

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/bookcases
// ----------------------------------------------------------------
describe("POST /api/v1/bookcases", () => {
    it("Deve retornar erro pois os dados estão faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/bookcases")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois já existe uma prateleira com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/bookcases")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Estante A1", sector: 1 });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o setor não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/bookcases")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Estante Nova", sector: 999999999 });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .post("/api/v1/bookcases")
            .send({ name: "Estante Nova", sector: 1 });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/bookcases/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/bookcases/:id", () => {
    it("Deve retornar erro pois a prateleira não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/bookcases/999999999")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois já existe outra prateleira com esse nome. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/bookcases/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Estante A2" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve atualizar a prateleira com o mesmo nome sem retornar erro. STATUS: 200", async () => {
        const response = await request(app)
            .put("/api/v1/bookcases/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Estante A1" });

        expect(response.status).toBe(HTTPCODES.OK);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/bookcases/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .put("/api/v1/bookcases/1")
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/bookcases/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/bookcases/:id", () => {
    it("Deve retornar erro pois a prateleira não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/bookcases/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/bookcases/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .delete("/api/v1/bookcases/1");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});