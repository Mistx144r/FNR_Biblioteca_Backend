import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";

// ----------------------------------------------------------------
// GET /api/v1/workers
// ----------------------------------------------------------------
describe("GET /api/v1/workers", () => {
    it("Deve retornar uma lista de todos os funcionários. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/workers");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/workers/:id
// ----------------------------------------------------------------
describe("GET /api/v1/workers/:id", () => {
    it("Deve retornar um funcionário específico. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/workers/1");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_worker");
    });

    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/workers/999999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/workers/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/workers/:id/everything
// ----------------------------------------------------------------
describe("GET /api/v1/workers/:id/everything", () => {
    it("Deve retornar todas as informações do funcionário com roles. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/workers/1/everything");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("worker");
        expect(response.body).toHaveProperty("roles");
    });

    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/workers/999999999/everything");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/workers
// ----------------------------------------------------------------
describe("POST /api/v1/workers", () => {
    it("Deve retornar erro pois os dados estão faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .send({ name: "Funcionário Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o CPF já está cadastrado. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .send({
                name: "Funcionário Teste",
                cpf: "52998224725", // CPF do seed
                email: "novo@biblioteca.edu.br",
                password: "Senha@123",
                cellphone: "(81) 99999-0099"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o email já está cadastrado. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .send({
                name: "Funcionário Teste",
                cpf: "11144477706",
                email: "admin@biblioteca.edu.br", // email do seed
                password: "Senha@123",
                cellphone: "(81) 99999-0099"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o CPF é inválido. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .send({
                name: "Funcionário Teste",
                cpf: "11111111111",
                email: "teste@biblioteca.edu.br",
                password: "Senha@123",
                cellphone: "(81) 99999-0099"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o formato do celular é inválido. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .send({
                name: "Funcionário Teste",
                cpf: "47392923840",
                email: "teste2@biblioteca.edu.br",
                password: "Senha@123",
                cellphone: "99999999" // formato errado
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/workers/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/workers/:id", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/workers/999999999")
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o CPF já está cadastrado em outro funcionário. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/workers/1")
            .send({ cpf: "11144477735" }); // CPF do worker 2

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o email já está cadastrado em outro funcionário. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/workers/1")
            .send({ email: "maria@biblioteca.edu.br" }); // email do worker 2

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/workers/abc")
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/workers/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/workers/:id", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app).delete("/api/v1/workers/999999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/workers/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/workers/:id/roles
// ----------------------------------------------------------------
describe("GET /api/v1/workers/:id/roles", () => {
    it("Deve retornar a lista de roles do funcionário. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/workers/1/roles");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/workers/abc/roles");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/workers/:id/roles/:idRole
// ----------------------------------------------------------------
describe("POST /api/v1/workers/:id/roles/:idRole", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app).post("/api/v1/workers/999999999/roles/1");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a role não existe. STATUS: 404", async () => {
        const response = await request(app).post("/api/v1/workers/1/roles/999999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do funcionário não é um número. STATUS: 400", async () => {
        const response = await request(app).post("/api/v1/workers/abc/roles/1");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID da role não é um número. STATUS: 400", async () => {
        const response = await request(app).post("/api/v1/workers/1/roles/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/workers/:id/roles/:idRole
// ----------------------------------------------------------------
describe("DELETE /api/v1/workers/:id/roles/:idRole", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app).delete("/api/v1/workers/999999999/roles/1");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a role não existe. STATUS: 404", async () => {
        const response = await request(app).delete("/api/v1/workers/1/roles/999999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o funcionário não pertence a essa role. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/workers/1/roles/3");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID do funcionário não é um número. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/workers/abc/roles/1");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/workers/auth/login
// ----------------------------------------------------------------
describe("POST /api/v1/workers/auth/login", () => {
    it("Deve retornar erro pois o email não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/workers/auth/login")
            .send({
                email: "inexistente@biblioteca.edu.br",
                password: "Senha@123"
            });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a senha está incorreta. STATUS: 401", async () => {
        const response = await request(app)
            .post("/api/v1/workers/auth/login")
            .send({
                email: "admin@biblioteca.edu.br",
                password: "SenhaErrada@123"
            });

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });

    it("Deve retornar erro pois os dados estão faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers/auth/login")
            .send({ email: "admin@biblioteca.edu.br" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});