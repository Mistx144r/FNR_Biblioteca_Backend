import { PrismaClient, Prisma } from "@prisma/client";

const repository = new PrismaClient();

export async function getAll(pageS: string | string[] = "1", limitS: string | string[] = "10") {
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

export async function getById(id: string | string[]) {
    const book = await repository.book.findUnique({where: {id_book: Number(id)}});

    if (!book) {
        throw new Error("Livro não encontrado.");
    }

    return book;
}

export async function create(body: Prisma.BookCreateInput){
    body = {
        ...body,
        published_at: new Date(body.published_at)
    }

    return repository.book.create({data: body});
}

export async function deleteById(id: string | string[]) {
   return repository.book.delete({
       where: {
           id_book: Number(id)
       }
   })
}



