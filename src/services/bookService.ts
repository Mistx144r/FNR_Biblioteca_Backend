import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Book } from "@prisma/client";
import { env } from "../schemas/envSchema";
import { createBookSchema, updateBookSchema, bookFilterSchema } from "../schemas/bookSchema";
import { prisma } from "../utils/prisma";
import { redis } from "../utils/redis";
import { serializeBigInt, returnNumberedID } from "../utils/utils";
import { searchBooksByNameWithFuzzy } from "../utils/bookSearch";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateBookDTO = z.infer<typeof createBookSchema>;
type UpdateBookDTO = z.infer<typeof updateBookSchema>;
type PossibleFilters = z.infer<typeof bookFilterSchema>;
type PaginatedReturnData = {
    data: Book[],
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean,
        hasPreviousPage: boolean
    }
}

const repository = prisma;

//================================
// Reminders
//================================
// 1. Talvez adicionar uma paginação no retorno dos Book Copies.
// 2. ...

//================================
// Single Book Caching
//================================
function isBookInCache(bookId: number) {
    return redis.exists(`${env.NODE_ENV}:Book:${bookId}`);
}

function saveBookInCache(bookId: number, data: Book) {
    return redis.multi().set(`${env.NODE_ENV}:Book:${bookId}`, JSON.stringify(serializeBigInt(data))).expire(`${env.NODE_ENV}:Book:${bookId}`, 1800).exec();
}

async function returnCachedBook(bookId: number) {
    const data = await redis.get(`${env.NODE_ENV}:Book:${bookId}`);
    return JSON.parse(data!);
}

function invalidateCachedBook(bookId: number) {
    return redis.del(`${env.NODE_ENV}:Book:${bookId}`);
}

//================================
// Paginated Books Caching
//================================
function isPaginatedBooksInCache(page: number, limit: number) {
    return redis.exists(`${env.NODE_ENV}:Book:${page}:${limit}`);
}

function savePaginatedBooksInCache(pages: number, limit: number, data: PaginatedReturnData) {
    return redis.multi().set(`${env.NODE_ENV}:Book:${pages}:${limit}`, JSON.stringify(serializeBigInt(data))).expire(`${env.NODE_ENV}:Book:${pages}:${limit}`, 900).exec();
}

async function returnCachedPaginatedBooks(page: number, limit: number) {
    const data = await redis.get(`${env.NODE_ENV}:Book:${page}:${limit}`);
    return JSON.parse(data!); // A exclamação avisa que os dados podem estar nulos.
}

//================================
// Main Book Functions
//================================
export async function getAll(pageS: string = "1", limitS: string = "10", possibleFilters: PossibleFilters) {
    const page = Number(pageS);
    const limit = Number(limitS);
    const hasFilters = possibleFilters && Object.values(possibleFilters).some(v => v !== undefined);

    if (!page) {
        throw new AppError("O valor enviado de Páginas é inválido ou igual a zero (0). 💀🔥🔥 (Erro souvenir)", HTTPCODES.BADREQUEST);
    }

    if (!limit) {
        throw new AppError("O valor enviado para o Limite é inválido ou igual a zero (0). 💀🔥🔥 (Erro souvenir)", HTTPCODES.BADREQUEST);
    }

    if ((page > 50 || page < 0) || (limit > 50 || limit < 0)) {
        throw new AppError("O valor das Páginas ou Limite não pode ser maior que 50 ou menor que zero (0)", HTTPCODES.BADREQUEST);
    }

    const skip = (page - 1) * limit;

    if (await isPaginatedBooksInCache(page, limit) && !hasFilters) {
        return await returnCachedPaginatedBooks(page, limit);
    }

    if (possibleFilters?.name) {
        return await searchBooksByNameWithFuzzy(prisma, skip, limit, possibleFilters);
    }

    const where: Prisma.BookWhereInput = {
        ...(possibleFilters?.isbn && {
            isbn: { contains: possibleFilters.isbn, mode: Prisma.QueryMode.insensitive }
        }),
        fk_category_id: possibleFilters.category,
        language: possibleFilters?.language,
        edition: possibleFilters.edition,
        ...(possibleFilters?.published_at && { published_at: possibleFilters.published_at }),
    };

    const [books, total] = await Promise.all([
        repository.book.findMany({
            skip,
            take: limit,
            orderBy: { id_book: "asc" },
            where,
            include: {
                category: true,
                Authors_In_Book: {
                    include: {
                        author: true
                    }
                }
            }
        }),
        repository.book.count({ where })
    ]);

    const booksWithAuthors = books.map(book => ({
        ...book,
        authors: book.Authors_In_Book.map(a => a.author),
        Authors_In_Book: undefined
    }));

    const data = {
        data: booksWithAuthors,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
        }
    }

    if (!hasFilters) {
        await savePaginatedBooksInCache(page, limit, data);
    }

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

export async function getAllBookCopiesWithBookId_AllInfo(bookIdS: string | string[]) {
    const bookId = returnNumberedID(bookIdS);

    if (!bookId) {
        throw new AppError("ID do livro inválido.", HTTPCODES.BADREQUEST);
    }

    const bookExists = await repository.book.findUnique({ where: { id_book: bookId } });

    if (!bookExists) {
        throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.book_Copy.findMany({
        where: { fk_book_id: bookId },
        include: {
            institution: true,
            bookcase: {
                include: {
                    sector: true
                }
            }
        }
    });
}

export async function create(body: CreateBookDTO){
    const { isbn, category } = body;
    const categoryId = category;

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
                published_at: body.published_at,
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

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async(tx) => {
        const book = await tx.book.findUnique({where: {id_book: idBook}});

        if (!book) {
            throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
        }

        if (category) {
            const doesCategoryExists = await tx.category.findUnique({where: {id_category: category}});

            if (!doesCategoryExists) {
                throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
            }
        }

        if (body.isbn) {
            const doesBookAlreadyExistsWithThisISBN = await tx.book.findUnique({ where: { isbn: body.isbn as string } });

            if ((doesBookAlreadyExistsWithThisISBN && Number(doesBookAlreadyExistsWithThisISBN.id_book)) !== idBook) {
                throw new AppError("Livro já existe com esse ISBN.", HTTPCODES.BADREQUEST);
            }
        }

        const updatedBook = tx.book.update({
            where: { id_book: idBook },
            data: {
                ...rest,
                ...(published_at && { published_at: body.published_at }),
                ...(category && { category: { connect: { id_category: category } } })
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