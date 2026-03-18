import { PrismaClient, stateEnum } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedSubCategories() {
    const subCategories = [
        // Literatura
        { name: "Romance" },
        { name: "Fantasia" },
        { name: "Terror" },
        { name: "Ficção Científica" },
        { name: "Poesia" },
        { name: "Biografia" },

        // Ciências Exatas
        { name: "Matemática" },
        { name: "Física" },
        { name: "Química" },
        { name: "Estatística" },

        // Ciências Humanas
        { name: "Filosofia" },
        { name: "Sociologia" },
        { name: "História" },
        { name: "Geografia" },
        { name: "Psicologia" },

        // Ciências Biológicas
        { name: "Botânica" },
        { name: "Zoologia" },
        { name: "Ecologia" },
        { name: "Genética" },

        // Tecnologia
        { name: "Programação" },
        { name: "Redes" },
        { name: "Inteligência Artificial" },
        { name: "Banco de Dados" },

        // Artes
        { name: "Música" },
        { name: "Cinema" },
        { name: "Pintura" },
        { name: "Fotografia" },

        // Direito
        { name: "Direito Civil" },
        { name: "Direito Penal" },
        { name: "Direito Trabalhista" },
        { name: "Direito Constitucional" },

        // Negócios
        { name: "Marketing" },
        { name: "Finanças" },
        { name: "Empreendedorismo" },
        { name: "Gestão" },

        // Educação
        { name: "Pedagogia" },
        { name: "EAD" },
        { name: "Didática" },

        // Religião e Espiritualidade
        { name: "Cristianismo" },
        { name: "Budismo" },
        { name: "Espiritismo" },
        { name: "Islamismo" },
    ];

    await prisma.sub_Category.createMany({
        data: subCategories,
        skipDuplicates: true,
    });

    console.log("✅ Sub-categories seed concluído!");
}

export async function seedRoles() {
    const roles = [
        { name: "Administrador" },
        { name: "Bibliotecário" },
        { name: "Auxiliar" },
    ];

    await prisma.roles.createMany({
        data: roles,
        skipDuplicates: true,
    });

    console.log("✅ Roles seed concluído!");
}

export async function seedAuthors() {
    const authors = [
        { name: "Robert C. Martin" },
        { name: "Andrew Hunt" },
        { name: "David Thomas" },
        { name: "Erich Gamma" },
        { name: "Richard Helm" },
        { name: "Ralph Johnson" },
        { name: "John Vlissides" },
        { name: "Eric Evans" },
        { name: "Thomas H. Cormen" },
        { name: "Charles E. Leiserson" },
        { name: "Ronald L. Rivest" },
        { name: "Clifford Stein" },
        { name: "Michael T. Goodrich" },
        { name: "Roberto Tamassia" },
    ];

    await prisma.author.createMany({
        data: authors,
        skipDuplicates: true,
    });

    console.log("✅ Authors seed concluído!");
}

export async function seedBooks() {
    const books = [
        {
            name: "Clean Code",
            isbn: "9780132350884",
            description: "Um guia de boas práticas para escrever código limpo e legível.",
            publisher: "Prentice Hall",
            language: "pt-BR",
            fk_category_id: 5n,
            edition: 1,
            pages: 431,
            bookcover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
            published_at: new Date("2008-08-01"),
        },
        {
            name: "Clean Architecture",
            isbn: "9780134494166",
            description: "Um guia sobre estruturação de sistemas de software.",
            publisher: "Prentice Hall",
            language: "pt-BR",
            fk_category_id: 5n,
            edition: 1,
            pages: 432,
            bookcover: "https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg",
            published_at: new Date("2017-09-20"),
        },
        {
            name: "The Pragmatic Programmer",
            isbn: "9780135957059",
            description: "Conselhos práticos para desenvolvedores de software.",
            publisher: "Addison-Wesley",
            language: "en-US",
            fk_category_id: 5n,
            edition: 2,
            pages: 352,
            bookcover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg",
            published_at: new Date("2019-09-23"),
        },
        {
            name: "Design Patterns",
            isbn: "9780201633610",
            description: "Soluções reutilizáveis para problemas comuns em software.",
            publisher: "Addison-Wesley",
            language: "en-US",
            fk_category_id: 5n,
            edition: 1,
            pages: 395,
            bookcover: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
            published_at: new Date("1994-10-31"),
        },
        {
            name: "Domain-Driven Design",
            isbn: "9780321125217",
            description: "Abordagem para o desenvolvimento de software complexo.",
            publisher: "Addison-Wesley",
            language: "en-US",
            fk_category_id: 5n,
            edition: 1,
            pages: 560,
            bookcover: "https://covers.openlibrary.org/b/isbn/9780321125217-L.jpg",
            published_at: new Date("2003-08-30"),
        },
        {
            name: "Introdução aos Algoritmos",
            isbn: "9788535236996",
            description: "O livro mais completo sobre algoritmos e estruturas de dados.",
            publisher: "Campus",
            language: "pt-BR",
            fk_category_id: 2n,
            edition: 3,
            pages: 926,
            bookcover: "https://covers.openlibrary.org/b/isbn/9788535236996-L.jpg",
            published_at: new Date("2012-01-01"),
        },
        {
            name: "Estruturas de Dados e Algoritmos em Java",
            isbn: "9788582605837",
            description: "Fundamentos de estruturas de dados com implementações em Java.",
            publisher: "Bookman",
            language: "pt-BR",
            fk_category_id: 2n,
            edition: 6,
            pages: 736,
            bookcover: "https://covers.openlibrary.org/b/isbn/9788582605837-L.jpg",
            published_at: new Date("2014-01-01"),
        },
        {
            name: "O Programador Pragmático",
            isbn: "9788577807048",
            description: "De aprendiz a mestre no desenvolvimento de software.",
            publisher: "Bookman",
            language: "pt-BR",
            fk_category_id: 5n,
            edition: 1,
            pages: 296,
            bookcover: "https://covers.openlibrary.org/b/isbn/9788577807048-L.jpg",
            published_at: new Date("2008-01-01"),
        },
    ];

    for (const book of books) {
        await prisma.book.upsert({
            where: { isbn: book.isbn },
            update: {},
            create: book,
        });
    }

    console.log("✅ Books seed concluído!");
}

export async function seedWorkers() {
    const workers = [
        {
            name: "Admin Master",
            cpf: "52998224725",
            password: await bcrypt.hash("Admin@123", 10),
            email: "admin@biblioteca.edu.br",
            cellphone: "(81) 99999-0001",
            telephone: "3333-0001",
        },
        {
            name: "Maria Bibliotecária",
            cpf: "11144477735",
            password: await bcrypt.hash("Maria@123", 10),
            email: "maria@biblioteca.edu.br",
            cellphone: "(81) 99999-0002",
            telephone: "3333-0002",
        },
        {
            name: "João Auxiliar",
            cpf: "47392923840",
            password: await bcrypt.hash("Joao@123", 10),
            email: "joao@biblioteca.edu.br",
            cellphone: "(81) 99999-0003",
        },
    ];

    for (const worker of workers) {
        await prisma.worker.upsert({
            where: { cpf: worker.cpf },
            update: {},
            create: worker,
        });
    }

    console.log("✅ Workers seed concluído!");
}

export async function seedCategories() {
    const categories = [
        { name: "Literatura" },
        { name: "Ciências Exatas" },
        { name: "Ciências Humanas" },
        { name: "Ciências Biológicas" },
        { name: "Tecnologia" },
        { name: "Artes" },
        { name: "Direito" },
        { name: "Saúde" },
        { name: "Negócios" },
        { name: "Educação" },
        { name: "Religião e Espiritualidade" },
        { name: "Entretenimento" },
    ];

    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true,
    });

    console.log("✅ Categories seed concluído!");
}

export async function seedSectors() {
    const sectors = [
        { name: "Setor de Literatura",        letter: "A", fk_category_id: 1n },
        { name: "Setor de Tecnologia",         letter: "B", fk_category_id: 5n },
        { name: "Setor de Ciências Humanas",   letter: "C", fk_category_id: 3n },
        { name: "Setor de Ciências Exatas",    letter: "D", fk_category_id: 2n },
        { name: "Setor de Saúde",              letter: "E", fk_category_id: 8n },
    ];

    await prisma.sector.createMany({
        data: sectors,
        skipDuplicates: true,
    });

    console.log("✅ Sectors seed concluído!");
}

export async function seedBookcases() {
    const bookcases = [
        // Setor A - Literatura
        { name: "Estante A1", fk_sector_id: 1n },
        { name: "Estante A2", fk_sector_id: 1n },
        { name: "Estante A3", fk_sector_id: 1n },

        // Setor B - Tecnologia
        { name: "Estante B1", fk_sector_id: 2n },
        { name: "Estante B2", fk_sector_id: 2n },

        // Setor C - Ciências Humanas
        { name: "Estante C1", fk_sector_id: 3n },
        { name: "Estante C2", fk_sector_id: 3n },

        // Setor D - Ciências Exatas
        { name: "Estante D1", fk_sector_id: 4n },
        { name: "Estante D2", fk_sector_id: 4n },

        // Setor E - Saúde
        { name: "Estante E1", fk_sector_id: 5n },
        { name: "Estante E2", fk_sector_id: 5n },
    ];

    await prisma.bookcase.createMany({
        data: bookcases,
        skipDuplicates: true,
    });

    console.log("✅ Bookcases seed concluído!");
}

export async function seedInstitutions() {
    const categories = [
        { name: "Nova Roma - Boa Viagem" },
        { name: "Nova Roma - Caruaru" },
    ];

    await prisma.institution.createMany({
        data: categories,
        skipDuplicates: true,
    });

    console.log("✅ Categories seed concluído!");
}

export async function seedBookCopies() {
    const bookCopies = [
        // Livro 1 - 3 cópias
        { fk_book_id: 1n, fk_bookcase_id: 1n, fk_institution_id: 1n, is_virtual: false, is_consult: false, state: stateEnum.DISPONIVEL,  description: "Exemplar em bom estado." },
        { fk_book_id: 1n, fk_bookcase_id: 1n, fk_institution_id: 2n, is_virtual: false, is_consult: false, state: stateEnum.EMPRESTADO,  description: "Exemplar com pequenos riscos na capa." },
        { fk_book_id: 1n, fk_bookcase_id: 1n, fk_institution_id: 1n, is_virtual: false, is_consult: true,  state: stateEnum.DISPONIVEL,  description: "Exemplar exclusivo para consulta local." },

        // Livro 2 - 2 cópias
        { fk_book_id: 2n, fk_bookcase_id: 2n, fk_institution_id: 1n,  is_virtual: false, is_consult: false, state: stateEnum.DISPONIVEL,  description: "Exemplar em bom estado." },
        { fk_book_id: 2n, fk_bookcase_id: 2n, fk_institution_id: 1n,  is_virtual: false, is_consult: false, state: stateEnum.RESERVADO,   description: "Exemplar com páginas amareladas." },

        // Livro 3 - 3 cópias
        { fk_book_id: 3n, fk_bookcase_id: 3n, fk_institution_id: 2n,  is_virtual: false, is_consult: false, state: stateEnum.DISPONIVEL,  description: "Exemplar em bom estado." },
        { fk_book_id: 3n, fk_bookcase_id: 3n, fk_institution_id: 2n,  is_virtual: false, is_consult: false, state: stateEnum.DISPONIVEL,  description: "Exemplar em bom estado." },
        { fk_book_id: 3n, fk_bookcase_id: 3n, fk_institution_id: 2n,  is_virtual: false, is_consult: true,  state: stateEnum.INDISPONIVEL, description: "Exemplar danificado, aguardando reparo." },

        // Livro 4 - 2 cópias
        { fk_book_id: 4n, fk_bookcase_id: 4n, fk_institution_id: 1n,  is_virtual: false, is_consult: false, state: stateEnum.DISPONIVEL,  description: "Exemplar em bom estado." },
        { fk_book_id: 4n, fk_bookcase_id: 4n, fk_institution_id: 2n,  is_virtual: false, is_consult: false, state: stateEnum.EMPRESTADO,  description: "Exemplar com capa plastificada." },

        // Livro 5 - 2 cópias
        { fk_book_id: 5n, fk_bookcase_id: 5n, fk_institution_id: 1n,  is_virtual: false, is_consult: false, state: stateEnum.DISPONIVEL,  description: "Exemplar em bom estado." },
        { fk_book_id: 5n, fk_bookcase_id: 5n, fk_institution_id: 1n,  is_virtual: false, is_consult: true,  state: stateEnum.DISPONIVEL,  description: "Exemplar exclusivo para consulta local." },
    ];

    await prisma.book_Copy.createMany({
        data: bookCopies,
        skipDuplicates: true,
    });

    console.log("✅ Book Copies seed concluído!");
}

export async function seedAuthorsInBooks() {
    // Busca os IDs dos livros e autores pelo nome/isbn
    const [
        cleanCode, cleanArch, pragProg, designPatterns, ddd,
        introAlgo, estDados, progPragPtBr
    ] = await Promise.all([
        prisma.book.findUnique({ where: { isbn: "9780132350884" } }),
        prisma.book.findUnique({ where: { isbn: "9780134494166" } }),
        prisma.book.findUnique({ where: { isbn: "9780135957059" } }),
        prisma.book.findUnique({ where: { isbn: "9780201633610" } }),
        prisma.book.findUnique({ where: { isbn: "9780321125217" } }),
        prisma.book.findUnique({ where: { isbn: "9788535236996" } }),
        prisma.book.findUnique({ where: { isbn: "9788582605837" } }),
        prisma.book.findUnique({ where: { isbn: "9788577807048" } }),
    ]);

    const [
        martinId, huntId, thomasId,
        gammaId, helmId, johnsonId, vlissidesId,
        evansId, cormenId, leisersonId, rivestId, steinId,
        goodrichId, tamassiaId
    ] = await Promise.all([
        prisma.author.findFirst({ where: { name: "Robert C. Martin" } }),
        prisma.author.findFirst({ where: { name: "Andrew Hunt" } }),
        prisma.author.findFirst({ where: { name: "David Thomas" } }),
        prisma.author.findFirst({ where: { name: "Erich Gamma" } }),
        prisma.author.findFirst({ where: { name: "Richard Helm" } }),
        prisma.author.findFirst({ where: { name: "Ralph Johnson" } }),
        prisma.author.findFirst({ where: { name: "John Vlissides" } }),
        prisma.author.findFirst({ where: { name: "Eric Evans" } }),
        prisma.author.findFirst({ where: { name: "Thomas H. Cormen" } }),
        prisma.author.findFirst({ where: { name: "Charles E. Leiserson" } }),
        prisma.author.findFirst({ where: { name: "Ronald L. Rivest" } }),
        prisma.author.findFirst({ where: { name: "Clifford Stein" } }),
        prisma.author.findFirst({ where: { name: "Michael T. Goodrich" } }),
        prisma.author.findFirst({ where: { name: "Roberto Tamassia" } }),
    ]);

    const relations = [
        // Clean Code → Robert C. Martin
        { fk_book_id: cleanCode!.id_book, fk_author_id: martinId!.id_author },

        // Clean Architecture → Robert C. Martin
        { fk_book_id: cleanArch!.id_book, fk_author_id: martinId!.id_author },

        // The Pragmatic Programmer → Andrew Hunt, David Thomas
        { fk_book_id: pragProg!.id_book, fk_author_id: huntId!.id_author },
        { fk_book_id: pragProg!.id_book, fk_author_id: thomasId!.id_author },

        // Design Patterns → Gang of Four
        { fk_book_id: designPatterns!.id_book, fk_author_id: gammaId!.id_author },
        { fk_book_id: designPatterns!.id_book, fk_author_id: helmId!.id_author },
        { fk_book_id: designPatterns!.id_book, fk_author_id: johnsonId!.id_author },
        { fk_book_id: designPatterns!.id_book, fk_author_id: vlissidesId!.id_author },

        // Domain-Driven Design → Eric Evans
        { fk_book_id: ddd!.id_book, fk_author_id: evansId!.id_author },

        // Introdução aos Algoritmos → CLRS
        { fk_book_id: introAlgo!.id_book, fk_author_id: cormenId!.id_author },
        { fk_book_id: introAlgo!.id_book, fk_author_id: leisersonId!.id_author },
        { fk_book_id: introAlgo!.id_book, fk_author_id: rivestId!.id_author },
        { fk_book_id: introAlgo!.id_book, fk_author_id: steinId!.id_author },

        // Estruturas de Dados → Goodrich, Tamassia
        { fk_book_id: estDados!.id_book, fk_author_id: goodrichId!.id_author },
        { fk_book_id: estDados!.id_book, fk_author_id: tamassiaId!.id_author },

        // O Programador Pragmático PT-BR → Andrew Hunt, David Thomas
        { fk_book_id: progPragPtBr!.id_book, fk_author_id: huntId!.id_author },
        { fk_book_id: progPragPtBr!.id_book, fk_author_id: thomasId!.id_author },
    ];

    for (const relation of relations) {
        await prisma.authors_In_Book.upsert({
            where: {
                fk_author_id_fk_book_id: {
                    fk_author_id: relation.fk_author_id,
                    fk_book_id: relation.fk_book_id
                }
            },
            update: {},
            create: relation,
        });
    }

    console.log("✅ Authors in Books seed concluído!");
}