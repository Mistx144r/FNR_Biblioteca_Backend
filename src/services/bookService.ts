import { PrismaClient, Prisma } from "@prisma/client";

const repository = new PrismaClient();

// Main Book Functions

export async function getAll(pageS: string = "1", limitS: string = "10") {
    const page = Number(pageS);
    const limit = Number(limitS);

    if (!page) {
        throw new Error("O valor enviado pela página não é um número ou é menor ou igual a 0.");
    }

    if (!limit) {
        throw new Error("O valor enviado pelo limite não é um número ou é menor ou igual a 0.");
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
        repository.book.findMany({
            skip,
            take: limit,
            orderBy: { id_book: "asc" }
        }),
        repository.book.count()
    ]);

    return {
        data: books,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
        }
    };
}

export async function getById(idS: string | string[]) {
    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const book = await repository.book.findUnique({where: {id_book: Number(id)}});

    if (!book) {
        throw new Error("Livro não encontrado.");
    }

    return book;
}

// Precisa de um rework!
export async function create(body: Prisma.BookCreateInput){
    body = {
        ...body,
        published_at: new Date(body.published_at)
    }

    return repository.book.create({data: body});
}

export async function update(idS: string | string[], body: Prisma.BookUpdateInput) {
    const id = Number(idS);

    if (body.id_book) {
        delete body.id_book;
    }

    if (body.created_at) {
        delete body.created_at;
    }

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const book = await repository.book.findUnique({where: {id_book: id}});

    if (!book) {
        throw new Error('Livro não encontrado.');
    }

    return repository.book.update({
        where: {id_book: id}, data: body
    });
}

export async function deleteById(idS: string | string[]) {
    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const author = await repository.book.findUnique({where: {id_book: id}});

    if (!author) {
        throw new Error("Livro não encontrado!")
    }

    return repository.book.delete({where: {id_book: id}})
}

// Book Author Functions

// Book Sub-Category Functions


