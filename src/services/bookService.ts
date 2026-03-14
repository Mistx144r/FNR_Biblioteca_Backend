import { z } from "zod";
import { Book } from "@prisma/client";
import { createBookSchema, updateBookSchema } from "../schemas/bookSchema";
import { prisma } from "../utils/prisma";
import { redis } from "../utils/redis";
import { serializeBigInt, returnNumberedID } from "../utils/utils";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateBookDTO = z.infer<typeof createBookSchema>;
type UpdateBookDTO = z.infer<typeof updateBookSchema>;
type PaginatedReturnData = {
    data: Book[],
    meta: {
        total: number
        pages: number
        limit: number
        totalPages: number
        hasNextPage: boolean,
        hasPreviousPage: boolean
    }
}

const repository = prisma;

//================================
// Utils
//================================
function haveAllRequiredData(data: UpdateBookDTO) {
    const { name, isbn, description, publisher, language, edition, pages, category } = data;
    return !(!name || !isbn || !description || !publisher || !language || !edition || !pages || !category);
}

//================================
// Single Book Caching
//================================
function isBookInCache(bookId: number) {
    return redis.exists(`${process.env.NODE_ENV}:Book:${bookId}`);
}

function saveBookInCache(bookId: number, data: Book) {
    return redis.multi().set(`${process.env.NODE_ENV}:Book:${bookId}`, JSON.stringify(serializeBigInt(data))).expire(`${process.env.NODE_ENV}:Book:${bookId}`, 1800).exec();
}

async function returnCachedBook(bookId: number) {
    const data = await redis.get(`${process.env.NODE_ENV}:Book:${bookId}`);
    return JSON.parse(data!);
}

function invalidateCachedBook(bookId: number) {
    return redis.del(`${process.env.NODE_ENV}:Book:${bookId}`);
}

//================================
// Paginated Books Caching
//================================
function isPaginatedBooksInCache(page: number, limit: number) {
    return redis.exists(`${process.env.NODE_ENV}:Book:${page}:${limit}`);
}

function savePaginatedBooksInCache(pages: number, limit: number, data: PaginatedReturnData) {
    return redis.multi().set(`${process.env.NODE_ENV}:Book:${pages}:${limit}`, JSON.stringify(serializeBigInt(data))).expire(`${process.env.NODE_ENV}:Book:${pages}:${limit}`, 900).exec();
}

async function returnCachedPaginatedBooks(page: number, limit: number) {
    const data = await redis.get(`${process.env.NODE_ENV}:Book:${page}:${limit}`);
    return JSON.parse(data!); // A Exclamacao avisa que os dados podem estar nulos.
}

//================================
// Main Book Functions
//================================
export async function getAll(pageS: string = "1", limitS: string = "10") {
    const pages = Number(pageS);
    const limit = Number(limitS);

    if (!pages) {
        throw new AppError("O valor enviado de Páginas é inválido ou igual a zero (0). 💀🔥🔥 (Erro souvenir)", HTTPCODES.BADREQUEST);
    }

    if (!limit) {
        throw new AppError("O valor enviado para o Limite é inválido ou igual a zero (0). 💀🔥🔥 (Erro souvenir)", HTTPCODES.BADREQUEST);
    }

    if ((pages > 50 || pages < 0) || (limit > 50 || limit < 0)) {
        throw new AppError("O valor das Páginas ou Limite não pode ser maior que 50 ou menor que zero (0)", HTTPCODES.BADREQUEST);
    }

    const skip = (pages - 1) * limit;

    if (await isPaginatedBooksInCache(pages, limit)) {
        return await returnCachedPaginatedBooks(pages, limit);
    }

    const [books, total] = await Promise.all([
        repository.book.findMany({
            skip,
            take: limit,
            orderBy: { id_book: "asc" }
        }),
        repository.book.count()
    ]);

    const data = {
        data: books,
        meta: {
            total,
            pages,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: pages < Math.ceil(total / limit),
            hasPreviousPage: pages > 1
        }
    }

    await savePaginatedBooksInCache(pages, limit, data);

    return data;
}

export async function getById(idBookS: string | string[]) {
    const bookId = returnNumberedID(idBookS);

    if (!bookId) {
        throw new AppError("ID do livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (await isBookInCache(bookId)) {
        return returnCachedBook(bookId);
    }

    const book = await repository.book.findUnique({where: {id_book: bookId}});

    if (!book) {
        throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
    }

    await saveBookInCache(bookId, book);

    return book;
}

export async function getAllBookInfoById(idBookS: string | string[]) {
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

export async function create(body: CreateBookDTO){
    const { isbn, category } = body;
    const categoryId = category;

    if (!haveAllRequiredData(body)) {
        throw new AppError("Dados insuficientes para a criação do Livro.", HTTPCODES.BADREQUEST);
    }

    if (!categoryId) {
        throw new AppError("ID da Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async(tx) => {
        const bookAlreadyExistsWithISBN = await tx.book.findUnique({where: {isbn: isbn}});

        if (bookAlreadyExistsWithISBN) {
            throw new AppError("Livro já existe com esse ISBN.", HTTPCODES.BADREQUEST);
        }

        const doesCategoryExists = await tx.category.findUnique({where: {id_category: categoryId}});

        if (!doesCategoryExists) {
            throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
        }

        return tx.book.create({
            data: {
                ...body,
                published_at: new Date(body.published_at as string),
                category: {
                    connect: { id_category: categoryId }
                }
            }
        });
    })
}

export async function update(idBookS: string | string[], body: UpdateBookDTO) {
    const { category, published_at, ...rest } = body;
    const idBook = returnNumberedID(idBookS);
    const categoryId = body.category;

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (body.category !== undefined && !categoryId) {
        throw new AppError("ID da Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async(tx) => {
        const book = await tx.book.findUnique({where: {id_book: idBook}});

        if (!book) {
            throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
        }

        if (categoryId) {
            const doesCategoryExists = await tx.category.findUnique({where: {id_category: categoryId}});

            if (!doesCategoryExists) {
                throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
            }
        }

        if (body.isbn) {
            const doesBookAlreadyExistsWithThisISBN = await tx.book.findUnique({ where: { isbn: body.isbn as string } });

            if (doesBookAlreadyExistsWithThisISBN && Number(doesBookAlreadyExistsWithThisISBN.id_book) !== idBook) {
                throw new AppError("Livro já existe com esse ISBN.", HTTPCODES.BADREQUEST);
            }
        }

        if (body.published_at !== undefined) {
            const date = new Date(body.published_at as string);

            if (isNaN(date.getTime())) {
                throw new AppError("A data enviada é inválida.", HTTPCODES.BADREQUEST);
            }
        }

        const updatedBook = tx.book.update({
            where: { id_book: idBook },
            data: {
                ...rest,
                ...(published_at && { published_at: new Date(published_at) }),
                ...(categoryId && { category: { connect: { id_category: categoryId } } })
            }
        });

        if (await isBookInCache(idBook)) {
            await invalidateCachedBook(idBook);
        }

        return updatedBook;
    });
}

export async function deleteById(idBookS: string | string[]) {
    const idBook = returnNumberedID(idBookS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    const book = await repository.book.findUnique({where: {id_book: idBook}});

    if (!book) {
        throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
    }

    const deletedBook = await repository.book.delete({where: {id_book: idBook}});
    if (await isBookInCache(idBook)) {
        await invalidateCachedBook(idBook);
    }
    return deletedBook;
}

//================================
// Book Author Functions
//================================
export async function getAuthors(idBookS: string | string[]) {
    const idBook = returnNumberedID(idBookS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
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
    const idBook = returnNumberedID(idBookS);
    const idAuthor = returnNumberedID(idAuthorS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (!idAuthor) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const doesAuthorExists = await tx.author.findUnique({where: {id_author: idAuthor}});

        if (!doesAuthorExists) {
            throw new AppError("Autor não existe.", HTTPCODES.NOTFOUND);
        }

        const doesBookExists = await tx.book.findUnique({where: {id_book: idBook}});

        if (!doesBookExists) {
            throw new AppError("Livro não existe.", HTTPCODES.NOTFOUND);
        }

        const isAuthorAlreadyInBook = await tx.authors_In_Book.findUnique({
            where: {
                fk_author_id_fk_book_id: {
                    fk_author_id: idAuthor,
                    fk_book_id: idBook
                }
            }
        });

        if (isAuthorAlreadyInBook) {
            throw new AppError("Autor já relacionado ao Livro.", HTTPCODES.BADREQUEST);
        }

        return tx.authors_In_Book.create({data: {fk_book_id: idBook, fk_author_id: idAuthor}});
    });
}

export async function removeAuthor(idBookS: string | string[], idAuthorS: string | string[]) {
    const idBook = returnNumberedID(idBookS);
    const idAuthor = returnNumberedID(idAuthorS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (!idAuthor) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const doesBookExists = await tx.book.findUnique({where: {id_book: idBook}});

        if (!doesBookExists) {
            throw new AppError("Livro não existe.", HTTPCODES.NOTFOUND);
        }

        const doesAuthorExists = await tx.author.findUnique({where: {id_author: idAuthor}});

        if (!doesAuthorExists) {
            throw new AppError("Autor não existe.", HTTPCODES.NOTFOUND);
        }

        const isAuthorRelatedToTheBook = await tx.authors_In_Book.findUnique({
            where: {
                fk_author_id_fk_book_id: {
                    fk_author_id: idAuthor,
                    fk_book_id: idBook
                }
            }
        });

        if (!isAuthorRelatedToTheBook) {
            throw new AppError("Autor não relacionado ao Livro.", HTTPCODES.BADREQUEST);
        }

        return tx.authors_In_Book.delete({where: {fk_author_id_fk_book_id: {fk_book_id: idBook, fk_author_id: idAuthor}}});
    });
}

//================================
// Book Sub-Category Functions
//================================
export async function getSubCategories(idBookS: string | string[]) {
    const idBook = returnNumberedID(idBookS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
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
    const idBook = returnNumberedID(idBookS);
    const idSubCategory = returnNumberedID(idSubCategoryS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (!idSubCategory) {
        throw new AppError("ID da Sub Categoria inválida.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const doesBookExists = await tx.book.findUnique({where: {id_book: idBook}});

        if (!doesBookExists) {
            throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
        }

        const doesSubCategoryExists = await tx.sub_Category.findUnique({where: {id_sub_category: idSubCategory}});

        if (!doesSubCategoryExists) {
            throw new AppError("Sub-Categoria não encontrada.", HTTPCODES.NOTFOUND);
        }

        const isSubCategoryAlreadyInBook =
            await tx.sub_Categories_Of_Book.findUnique({
                where: {
                    fk_sub_category_fk_book_id: {
                        fk_book_id: idBook,
                        fk_sub_category: idSubCategory
                    }
                }
            });

        if (isSubCategoryAlreadyInBook) {
            throw new AppError("Sub-Categoria já relacionada ao Livro.", HTTPCODES.BADREQUEST);
        }

        return tx.sub_Categories_Of_Book.create({data: {fk_book_id: idBook, fk_sub_category: idSubCategory}});
    });
}

export async function removeSubCategory(idBookS: string | string[], idSubCategoryS: string | string[]) {
    const idBook = returnNumberedID(idBookS);
    const idSubCategory = returnNumberedID(idSubCategoryS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (!idSubCategory) {
        throw new AppError("ID da Sub-Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const doesBookExists = await tx.book.findUnique({where: {id_book: idBook}});

        if (!doesBookExists) {
            throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
        }

        const doesSubCategoryExists = await tx.sub_Category.findUnique({where: {id_sub_category: idSubCategory}});

        if (!doesSubCategoryExists) {
            throw new AppError("Sub-Categoria não encontrada.", HTTPCODES.NOTFOUND);
        }

        const isSubCategoryRelatedToTheBook =
            await tx.sub_Categories_Of_Book.findUnique({
                where: {
                    fk_sub_category_fk_book_id: {
                        fk_book_id: idBook,
                        fk_sub_category: idSubCategory
                    }
                }
            });

        if (!isSubCategoryRelatedToTheBook) {
            throw new AppError("Sub-Categoria não relacionada ao Livro.", HTTPCODES.BADREQUEST);
        }

        return tx.sub_Categories_Of_Book.delete({where: {fk_sub_category_fk_book_id: {fk_book_id: idBook, fk_sub_category: idSubCategory}}});
    });
}