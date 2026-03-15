import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";
import { generateTestToken } from "./helpers/generateToken";

const token = generateTestToken();

// ----------------------------------------------------------------
// GET /api/v1/workers
// ----------------------------------------------------------------
describe("GET /api/v1/workers", () => {
    it("Deve retornar uma lista de todos os funcionários. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/workers")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/workers/:id
// ----------------------------------------------------------------
describe("GET /api/v1/workers/:id", () => {
    it("Deve retornar um funcionário específico. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/workers/1")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_worker");
    });

    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app)
            .get("/api/v1/workers/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .get("/api/v1/workers/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/workers/:id/everything
// ----------------------------------------------------------------
describe("GET /api/v1/workers/:id/everything", () => {
    it("Deve retornar todas as informações do funcionário com roles. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/workers/1/everything")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("worker");
        expect(response.body).toHaveProperty("roles");
    });

    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app)
            .get("/api/v1/workers/999999999/everything")
            .set("Cookie", `accessToken=${token}`);

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
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Funcionário Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o CPF já está cadastrado. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .set("Cookie", `accessToken=${token}`)
            .send({
                name: "Funcionário Teste",
                cpf: "52998224725",
                email: "novo@biblioteca.edu.br",
                password: "Senha@123",
                cellphone: "(81) 99999-0099"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o email já está cadastrado. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .set("Cookie", `accessToken=${token}`)
            .send({
                name: "Funcionário Teste",
                cpf: "11144477706",
                email: "admin@biblioteca.edu.br",
                password: "Senha@123",
                cellphone: "(81) 99999-0099"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o CPF é inválido. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers")
            .set("Cookie", `accessToken=${token}`)
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
            .set("Cookie", `accessToken=${token}`)
            .send({
                name: "Funcionário Teste",
                cpf: "47392923840",
                email: "teste2@biblioteca.edu.br",
                password: "Senha@123",
                cellphone: "99999999"
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
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o CPF já está cadastrado em outro funcionário. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/workers/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ cpf: "11144477735" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o email já está cadastrado em outro funcionário. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/workers/1")
            .set("Cookie", `accessToken=${token}`)
            .send({ email: "maria@biblioteca.edu.br" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/workers/abc")
            .set("Cookie", `accessToken=${token}`)
            .send({ name: "Nome Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/workers/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/workers/:id", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/workers/:id/roles
// ----------------------------------------------------------------
describe("GET /api/v1/workers/:id/roles", () => {
    it("Deve retornar a lista de roles do funcionário. STATUS: 200", async () => {
        const response = await request(app)
            .get("/api/v1/workers/1/roles")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .get("/api/v1/workers/abc/roles")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/workers/:id/roles/:idRole
// ----------------------------------------------------------------
describe("POST /api/v1/workers/:id/roles/:idRole", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/workers/999999999/roles/1")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a role não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/workers/1/roles/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do funcionário não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers/abc/roles/1")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID da role não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/workers/1/roles/abc")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/workers/:id/roles/:idRole
// ----------------------------------------------------------------
describe("DELETE /api/v1/workers/:id/roles/:idRole", () => {
    it("Deve retornar erro pois o funcionário não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/999999999/roles/1")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a role não existe. STATUS: 404", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/1/roles/999999999")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o funcionário não pertence a essa role. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/1/roles/3")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID do funcionário não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/abc/roles/1")
            .set("Cookie", `accessToken=${token}`);

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

// ----------------------------------------------------------------
// POST /api/v1/workers/auth/refresh
// ----------------------------------------------------------------
describe("POST /api/v1/workers/auth/refresh", () => {
    it("Deve retornar erro pois o refresh token não foi enviado. STATUS: 401", async () => {
        const response = await request(app)
            .post("/api/v1/workers/auth/refresh");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });

    it("Deve retornar erro pois o refresh token é inválido. STATUS: 401", async () => {
        const response = await request(app)
            .post("/api/v1/workers/auth/refresh")
            .set("Cookie", "refreshToken=tokeninvalido");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });

    it("Deve retornar erro pois o refresh token está expirado. STATUS: 401", async () => {
        const expiredRefreshToken = require("jsonwebtoken").sign(
            { id: "1", name: "Teste", roles: ["Administrador"] },
            String(process.env.JWTSECRETKEY),
            { expiresIn: "0s" }
        );

        const response = await request(app)
            .post("/api/v1/workers/auth/refresh")
            .set("Cookie", `refreshToken=${expiredRefreshToken}`);

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/workers/auth/logout
// ----------------------------------------------------------------
describe("DELETE /api/v1/workers/auth/logout", () => {
    it("Deve retornar erro pois o access token não foi enviado. STATUS: 401", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/auth/logout");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });

    it("Deve retornar erro pois o access token é inválido. STATUS: 401", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/auth/logout")
            .set("Cookie", "accessToken=tokeninvalido");

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });

    it("Deve retornar erro pois o access token está expirado. STATUS: 401", async () => {
        const expiredToken = require("jsonwebtoken").sign(
            { id: "1", name: "Teste", roles: ["Administrador"] },
            String(process.env.JWTSECRETKEY),
            { expiresIn: "0s" }
        );

        const response = await request(app)
            .delete("/api/v1/workers/auth/logout")
            .set("Cookie", `accessToken=${expiredToken}`);

        expect(response.status).toBe(HTTPCODES.UNAUTHORIZED);
    });

    it("Deve realizar o logout com sucesso e limpar os cookies. STATUS: 200", async () => {
        const response = await request(app)
            .delete("/api/v1/workers/auth/logout")
            .set("Cookie", `accessToken=${token}`);

        expect(response.status).toBe(HTTPCODES.OK);
        // verifica se os cookies foram limpos
        const cookies = response.headers["set-cookie"] as unknown as string[];
        expect(cookies.some((c: string) => c.includes("accessToken=;"))).toBe(true);
        expect(cookies.some((c: string) => c.includes("refreshToken=;"))).toBe(true);
    });
});