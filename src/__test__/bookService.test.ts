import request from "supertest";
import { app } from "../testApp";
import { HTTPCODES } from "../utils/httpCodes";

// ----------------------------------------------------------------
// GET /api/v1/books
// ----------------------------------------------------------------
describe("GET /api/v1/books", () => {
    it("Deve retornar uma lista paginada de todos os livros. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/books/");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("meta");
    });

    it("Deve retornar a meta de paginação corretamente. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/books/?page=1&limit=5");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body.meta.limit).toBe(5);
        expect(response.body.meta.page).toBe(1);
    });

    it("Deve retornar erro pois a página enviada é inválida. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/books/?page=0");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o limite enviado é inválido. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/books/?limit=0");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/books/:id
// ----------------------------------------------------------------
describe("GET /api/v1/books/:id", () => {
    it("Deve retornar um livro específico. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/books/1");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("id_book");
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/books/5842785724975984");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/books/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/books/:id/everything
// ----------------------------------------------------------------
describe("GET /api/v1/books/:id/everything", () => {
    it("Deve retornar todas as informações do livro (dados, autores, sub-categorias). STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/books/1/everything");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(response.body).toHaveProperty("book");
        expect(response.body).toHaveProperty("authors");
        expect(response.body).toHaveProperty("subCategories");
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).get("/api/v1/books/999999/everything");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/books/abc/everything");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/books
// ----------------------------------------------------------------
describe("POST /api/v1/books/", () => {
    it("Deve retornar erro pois o ISBN já está cadastrado. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/books/")
            .send({
                name: "Clean Architecture",
                isbn: "12345678902",
                description: "Arquitetura Limpa.",
                publisher: "HarperCollins",
                language: "pt-BR",
                category: 5,
                edition: 1,
                pages: 700,
                bookcover: "https://covers.openlibrary.org/b/id/8743161-L.jpg",
                published_at: "1990-07-29"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois os dados estão faltando. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/books/")
            .send({ name: "Clean Architecture" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois a categoria não existe. STATUS: 404", async () => {
        const response = await request(app)
            .post("/api/v1/books/")
            .send({
                name: "Livro Teste",
                isbn: "00000000001",
                description: "Descrição teste.",
                publisher: "Editora Teste",
                language: "pt-BR",
                category: 999999,
                edition: 1,
                pages: 100,
                bookcover: "https://exemplo.com/capa.jpg",
                published_at: "2020-01-01"
            });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID da categoria não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .post("/api/v1/books/")
            .send({
                name: "Livro Teste",
                isbn: "00000000002",
                description: "Descrição teste.",
                publisher: "Editora Teste",
                language: "pt-BR",
                category: "abc",
                edition: 1,
                pages: 100,
                bookcover: "https://exemplo.com/capa.jpg",
                published_at: "2020-01-01"
            });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// PUT /api/v1/books/:id
// ----------------------------------------------------------------
describe("PUT /api/v1/books/:id", () => {
    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/books/8932983298382")
            .send({ category: 2 });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois a categoria não existe. STATUS: 404", async () => {
        const response = await request(app)
            .put("/api/v1/books/1")
            .send({ category: 999999999 });

        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve atualizar o livro com o mesmo ISBN sem retornar erro. STATUS: 200", async () => {
        const response = await request(app)
            .put("/api/v1/books/1")
            .send({ isbn: "12345678902", category: 5 });

        expect(response.status).toBe(HTTPCODES.OK);
    });

    it("Deve retornar erro pois o ID da categoria não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/books/1")
            .send({ category: "awdd8awd8aw" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/books/dwadaw1231gas")
            .send({ name: "Livro Teste" });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve atualizar apenas o nome sem exigir outros campos. STATUS: 200", async () => {
        const response = await request(app)
            .put("/api/v1/books/1")
            .send({ name: "Novo Nome" });

        expect(response.status).toBe(HTTPCODES.OK);
    });

    it("Deve retornar erro pois a data enviada é inválida. STATUS: 400", async () => {
        const response = await request(app)
            .put("/api/v1/books/1")
            .send({ published_at: "data-invalida", category: 5 });

        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/books/:id
// ----------------------------------------------------------------
describe("DELETE /api/v1/books/:id", () => {
    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).delete("/api/v1/books/999999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID não é um número. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/books/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/books/:id/authors
// ----------------------------------------------------------------
describe("GET /api/v1/books/:id/authors", () => {
    it("Deve retornar a lista de autores do livro. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/books/1/authors");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/books/abc/authors");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/books/:id/authors/:idAuthor
// ----------------------------------------------------------------
describe("POST /api/v1/books/:id/authors/:idAuthor", () => {
    it("Deve retornar erro pois o autor não existe. STATUS: 404", async () => {
        const response = await request(app).post("/api/v1/books/1/authors/999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).post("/api/v1/books/999999/authors/1");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app).post("/api/v1/books/abc/authors/1");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID do autor não é um número. STATUS: 400", async () => {
        const response = await request(app).post("/api/v1/books/1/authors/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/books/:id/authors/:idAuthor
// ----------------------------------------------------------------
describe("DELETE /api/v1/books/:id/authors/:idAuthor", () => {
    it("Deve retornar erro pois o autor não está relacionado ao livro. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/books/1/authors/999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).delete("/api/v1/books/999999/authors/1");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/books/abc/authors/1");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// GET /api/v1/books/:id/subcategories
// ----------------------------------------------------------------
describe("GET /api/v1/books/:id/subcategories", () => {
    it("Deve retornar a lista de sub-categorias do livro. STATUS: 200", async () => {
        const response = await request(app).get("/api/v1/books/1/subcategories");
        expect(response.status).toBe(HTTPCODES.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app).get("/api/v1/books/abc/subcategories");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// POST /api/v1/books/:id/subcategories/:idSubCategory
// ----------------------------------------------------------------
describe("POST /api/v1/books/:id/subcategories/:idSubCategory", () => {
    it("Deve retornar erro pois a sub-categoria não existe. STATUS: 404", async () => {
        const response = await request(app).post("/api/v1/books/1/subcategories/999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).post("/api/v1/books/999999/subcategories/1");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app).post("/api/v1/books/abc/subcategories/1");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });

    it("Deve retornar erro pois o ID da sub-categoria não é um número. STATUS: 400", async () => {
        const response = await request(app).post("/api/v1/books/1/subcategories/abc");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});

// ----------------------------------------------------------------
// DELETE /api/v1/books/:id/subcategories/:idSubCategory
// ----------------------------------------------------------------
describe("DELETE /api/v1/books/:id/subcategories/:idSubCategory", () => {
    it("Deve retornar erro pois a sub-categoria não está relacionada ao livro. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/books/1/subcategories/999999");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o livro não existe. STATUS: 404", async () => {
        const response = await request(app).delete("/api/v1/books/999999/subcategories/1");
        expect(response.status).toBe(HTTPCODES.NOTFOUND);
    });

    it("Deve retornar erro pois o ID do livro não é um número. STATUS: 400", async () => {
        const response = await request(app).delete("/api/v1/books/abc/subcategories/1");
        expect(response.status).toBe(HTTPCODES.BADREQUEST);
    });
});