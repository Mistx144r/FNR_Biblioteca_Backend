import { z } from "zod";
import { createBookSchema, updateBookSchema } from "../schemas/bookSchema";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateBookDTO = z.infer<typeof createBookSchema>;
type UpdateBookDTO = z.infer<typeof updateBookSchema>;

const repository = prisma;

// Main Book Functions
export async function getAll(pageS: string = "1", limitS: string = "10") {
    const page = Number(pageS);
    const limit = Number(limitS);

    if (!page) {
        throw new AppError("O valor enviado de Páginas é inválido ou igual a zero (0). 💀🔥🔥 (Erro souvenir)", HTTPCODES.BADREQUEST);
    }

    if (!limit) {
        throw new AppError("O valor enviado para o Limite é inválido ou igual a zero (0). 💀🔥🔥 (Erro souvenir)", HTTPCODES.BADREQUEST);
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
        throw new AppError("ID do livro inválido.", HTTPCODES.BADREQUEST);
    }

    const book = await repository.book.findUnique({where: {id_book: idBook}});

    if (!book) {
        throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
    }

    return book;
}

export async function getAllBookInfoById(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
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

export async function create(body: CreateBookDTO){
    const { name, isbn, description, publisher, language, edition, pages, category } = body;
    const categoryId = Number(Array.isArray(category) ? category[0] : category);

    if (!name || !isbn || !description || !publisher || !language || !edition || !pages) {
        throw new AppError("Dados insuficientes para atualização do Livro.", HTTPCODES.BADREQUEST);
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
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
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

        return tx.book.update({
            where: { id_book: idBook },
            data: {
                ...rest,
                ...(published_at && { published_at: new Date(published_at) }),
                ...(categoryId && { category: { connect: { id_category: categoryId } } })
            }
        });
    });
}

export async function deleteById(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

    if (!idBook) {
        throw new AppError("ID do Livro inválido.", HTTPCODES.BADREQUEST);
    }

    const book = await repository.book.findUnique({where: {id_book: idBook}});

    if (!book) {
        throw new AppError("Livro não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.book.delete({where: {id_book: idBook}});
}

// Book Author Functions
export async function getAuthors(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

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
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idAuthor = Number(Array.isArray(idAuthorS) ? idAuthorS[0] : idAuthorS);

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
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idAuthor = Number(Array.isArray(idAuthorS) ? idAuthorS[0] : idAuthorS);

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

// Book Sub-Category Functions
export async function getSubCategories(idBookS: string | string[]) {
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);

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
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idSubCategory = Number(Array.isArray(idSubCategoryS) ? idSubCategoryS[0] : idSubCategoryS);

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
    const idBook = Number(Array.isArray(idBookS) ? idBookS[0] : idBookS);
    const idSubCategory = Number(Array.isArray(idSubCategoryS) ? idSubCategoryS[0] : idSubCategoryS);

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