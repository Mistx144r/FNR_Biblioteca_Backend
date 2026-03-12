import { PrismaClient, Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";
import pino = require("pino");

const repository = new PrismaClient();
const logger = pino();

// Main Book Functions
export async function getAll(pageS: string = "1", limitS: string = "10") {
    const page = Number(pageS);
    const limit = Number(limitS);

    if (!page) {
        throw new AppError("O valor enviado pela página não é um número ou é menor ou igual a 0.", 400);
    }

    if (!limit) {
        throw new AppError("O valor enviado pelo limite não é um número ou é menor ou igual a 0.", 400);
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

export async function getById(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBook) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const book = await repository.book.findUnique({where: {id_book: idBook}});

    if (!book) {
        throw new AppError("Livro não encontrado.", 404);
    }

    return book;
}

// Retorna todos os dados de um Livro (Dados Padroes, Autor, Sub-Categorias)
export async function getAllBookInfoById(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBook) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const [book, authors, subCategories] = await Promise.all([
        getById(idBookS),
        getAuthors(idBookS),
        getSubCategories(idBookS)
    ]);

    return {
        book,
        authors,
        subCategories
    };
}

export async function create(body: Prisma.BookCreateInput){
    const { name, isbn, description, publisher, language, edition, pages, bookcover, category } = body;
    const categoryId = Number(Array.isArray(category) ? category[0] : category);

    if (body.id_book) {
        delete body.id_book;
    }

    if (!name || !isbn || !description || !publisher || !language || !edition || !pages || !bookcover) {
        throw new AppError("Dados insuficientes para atualização do funcionário.", 400);
    }

    if (!categoryId) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const bookAlreadyExistsWithISBN = await repository.book.findUnique({where: {isbn: isbn}});

    if (bookAlreadyExistsWithISBN) {
        throw new AppError("Livro já existe com esse ISBN.", 400);
    }

    const doesCategoryExists = await repository.category.findUnique({where: {id_category: categoryId}});

    if (!doesCategoryExists) {
        throw new AppError("Categoria não existe.", 400);
    }

    return repository.book.create({
        data: {
            ...body,
            published_at: new Date(body.published_at as string),
            category: {
                connect: { id_category: categoryId }
            }
        }
    });
}

export async function update(idBookS: string | string[], body: Prisma.BookUpdateInput) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const { category } = body;
    const categoryId = Number(Array.isArray(category) ? category[0] : category);

    if (body.id_book) {
        delete body.id_book;
    }

    if (body.created_at) {
        delete body.created_at;
    }

    if (!idBook) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    if (!categoryId) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const book = await repository.book.findUnique({where: {id_book: idBook}});

    if (!book) {
        throw new AppError("Livro não encontrado.", 404)
    }

    const doesCategoryExists = await repository.category.findUnique({where: {id_category: categoryId}});

    if (!doesCategoryExists) {
        throw new AppError("Categoria não existe.", 400);
    }

    return repository.book.update({
        where: {id_book: idBook}, data: {
            ...body,
            published_at: new Date(body.published_at as string),
            category: {
                connect: { id_category: categoryId }
            }
        }
    });
}

export async function deleteById(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBook) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const book = await repository.book.findUnique({where: {id_book: idBook}});

    if (!book) {
        throw new AppError("Livro não encontrado.", 404);
    }

    return repository.book.delete({where: {id_book: idBook}})
}

// Book Author Functions
export async function getAuthors(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBook) {
        throw new AppError("ID do livro inválido.", 400);
    }

    const authors = await repository.authors_In_Book.findMany({
        where: {
            fk_book_id: idBook
        },
        include: {
            author: true
        }
    });

    return authors.map(a => a.author);
}

export async function addAuthor(idBookS: string | string[], idAuthorS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idAuthor = Number(Array.isArray(idAuthorS) ? idAuthorS[0] : idAuthorS);

    if (!idBook || !idAuthor) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const isAuthorAlreadyInBook =
        await repository.authors_In_Book.findUnique({
            where: {
                fk_author_id_fk_book_id: {
                    fk_author_id: idAuthor,
                    fk_book_id: idBook
                }
            }
        });

    if (isAuthorAlreadyInBook){
        throw new AppError("Autor já relacionado ao Livro.", 400)
    }

    return repository.authors_In_Book.create({data: {fk_book_id: idBook, fk_author_id: idAuthor}});
}

export async function removeAuthor(idBookS: string | string[], idAuthorS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idAuthor = Number(Array.isArray(idAuthorS) ? idAuthorS[0] : idAuthorS);

    if (!idBookS || !idAuthor) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const isAuthorAlreadyInBook =
        await repository.authors_In_Book.findUnique({
            where: {
                fk_author_id_fk_book_id: {
                    fk_author_id: idAuthor,
                    fk_book_id: idBook
                }
            }
        });

    if (!isAuthorAlreadyInBook) {
        throw new AppError("Autor não relacionado ao Livro.", 400)
    }

    return repository.authors_In_Book.delete({where: {fk_author_id_fk_book_id: {fk_book_id: idBook, fk_author_id: idAuthor}}});
}

// Book Sub-Category Functions
export async function getSubCategories(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBookS) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const subcategories = await repository.sub_Categories_Of_Book.findMany({
        where: {
            fk_book_id: idBook
        },
        include: {
            sub_category: true
        }
    });

    return subcategories.map(a => a.sub_category);
}

export async function addSubCategory(idBookS: string | string[], idSubCategoryS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idSubCategory = Number(Array.isArray(idSubCategoryS) ? idSubCategoryS[0] : idSubCategoryS);

    console.log(idSubCategoryS);
    console.log(idSubCategory);

    if (!idBookS || !idSubCategory) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const doesCategoryExists = await repository.sub_Category.findUnique({where: {id_sub_category: idSubCategory}});

    if (!doesCategoryExists) {
        throw new AppError("Categoria não existe.", 400);
    }

    const isSubCategoryAlreadyInBook =
        await repository.sub_Categories_Of_Book.findUnique({
            where: {
                fk_sub_category_fk_book_id: {
                    fk_book_id: idBook,
                    fk_sub_category: idSubCategory
                }
            }
        });

    if (isSubCategoryAlreadyInBook) {
        throw new AppError("Sub-Categoria já relacionada ao Livro.", 400);
    }

    return repository.sub_Categories_Of_Book.create({data: {fk_book_id: idBook, fk_sub_category: idSubCategory}});
}

export async function removeSubCategory(idBookS: string | string[], idSubCategoryS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idSubCategory = Number(Array.isArray(idSubCategoryS) ? idSubCategoryS[0] : idSubCategoryS);

    if (!idBookS || !idSubCategory) {
        throw new AppError("O valor do ID não é um número ou é menor ou igual a 0.", 400);
    }

    const isSubCategoryAlreadyInBook =
        await repository.sub_Categories_Of_Book.findUnique({
            where: {
                fk_sub_category_fk_book_id: {
                    fk_book_id: idBook,
                    fk_sub_category: idSubCategory
                }
            }
        });

    if (!isSubCategoryAlreadyInBook) {
        throw new AppError("Sub-Categoria não relacionada ao Livro.", 400);
    }

    return repository.sub_Categories_Of_Book.delete({where: {fk_sub_category_fk_book_id: {fk_book_id: idBook, fk_sub_category: idSubCategory}}});
}