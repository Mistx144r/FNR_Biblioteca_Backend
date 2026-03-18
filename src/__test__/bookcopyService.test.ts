import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";
import { generateTestToken } from "./helpers/generateToken";

const token = generateTestToken();

// ----------------------------------------------------------------
// GET /api/v1/bookcopies
// ----------------------------------------------------------------
describe("GET /api/v1/bookcopies", () => {
    it("Deve retornar uma lista de todas as cópias. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/bookcopies");

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/bookcopies/:id
// ----------------------------------------------------------------
describe("GET /api/v1/bookcopies/:id", () => {
    it("Deve retornar uma cópia específica. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/bookcopies/1");

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_book_copy");
    });

    it("Deve retornar erro pois a cópia não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/bookcopies/999999999");

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/bookcopies/abc");

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/bookcopies
// ----------------------------------------------------------------
describe("POST /api/v1/bookcopies", () => {
    it("Deve retornar erro pois os dados estão faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/bookcopies")
            .set("Cookie", `accessToken=${token}`)
            .send({});

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/bookcopies")
            .set("Cookie", `accessToken=${token}`)
            .send({
                book: 999999999,
                bookcase: 1,
                institution: 1,
                is_virtual: false,
                is_consult: false,
                state: "DISPONIVEL"
            });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a estante não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/bookcopies")
            .set("Cookie", `accessToken=${token}`)
            .send({
                book: 1,
                bookcase: 99999999999,
                institution: 1,
                is_virtual: false,
                is_consult: false,
                state: "DISPONIVEL"
            });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/bookcopies")
            .set("Cookie", `accessToken=${token}`)
            .send({
                book: "abc",
                bookcase: 1,
                is_consult: false,
                state: "DISPONIVEL"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o estado enviado é inválido. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/bookcopies")
            .set("Cookie", `accessToken=${token}`)
            .send({
                book: 1,
                bookcase: 1,
                is_consult: false,
                state: "ESTADO_INVALIDO"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .post("/api/v1/bookcopies")
            .send({
                book: 1,
                bookcase: 1,
                is_consult: false,
                state: "DISPONIVEL"
            });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/bookcopies/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/bookcopies/:id", () => {
    it("Deve retornar erro pois a cópia não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/bookcopies/999999999")
            .set("Cookie", `accessToken=${token}`)
            .send({ bookcase: 1 });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a estante não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/bookcopies/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ bookcase: 999999999 });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/bookcopies/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ bookcase: 1 });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .put("/api/v1/bookcopies/1")
            .send({ bookcase: 1 });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/bookcopies/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/bookcopies/:id", () => {
    it("Deve retornar erro pois a cópia não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/bookcopies/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/bookcopies/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .delete("/api/v1/bookcopies/1");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// PATCH /api/v1/bookcopies/state/:id
// ----------------------------------------------------------------
describe("PATCH /api/v1/bookcopies/state/:id", () => {
    it("Deve retornar erro pois a cópia não existe. STATUS: 404", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/state/999999999")
            .set("Cookie", `accessToken=${token}`)
            .send({ state: "DISPONIVEL" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o estado enviado é inválido. STATUS: 400", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/state/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ state: "ESTADO_INVALIDO" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/state/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ state: "DISPONIVEL" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/state/1")
            .send({ state: "DISPONIVEL" });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// PATCH /api/v1/bookcopies/consult/:id
// ----------------------------------------------------------------
describe("PATCH /api/v1/bookcopies/consult/:id", () => {
    it("Deve retornar erro pois a cópia não existe. STATUS: 404", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/consult/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/consult/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois não está autenticado. STATUS: 401", async () => {
        const response = await request(app)
            .patch("/api/v1/bookcopies/consult/1");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});