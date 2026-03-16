import { z } from "zod";
import { stateEnum } from "@prisma/client";
import { createBookCopySchema, updateBookCopySchema } from "../schemas/bookcopySchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID } from "../utils/utils";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateBookCopyDTO = z.infer<typeof createBookCopySchema>;
type UpdateBookCopyDTO = z.infer<typeof updateBookCopySchema>;

const repository = prisma;

//================================
// Reminders
//================================
// 1. Adicionar uma paginacao no GetAll.
// 2. ...

//==============================
// Main Copy Book Functions
//==============================
export async function getAll() {
    return repository.book_Copy.findMany();
}

export async function getById(bookCopyIdS: string | string[]) {
    const book_CopyId = returnNumberedID(bookCopyIdS);

    if (!book_CopyId) {
        throw new AppError("ID da Cópia do livro inválido.", HTTPCODES.BADREQUEST);
    }

    const book_Copy = await prisma.book_Copy.findUnique({where: {id_book_copy: book_CopyId}});

    if (!book_Copy) {
        throw new AppError("Cópia do livro não encontrada.", HTTPCODES.NOTFOUND);
    }

    return book_Copy;
}

export async function create(body: CreateBookCopyDTO) {
    const { book, bookcase, institution, ...rest} = body;
    const bookId = book;
    const bookcaseId = bookcase;
    const institutionId = institution;

    if (!bookId) {
        throw new AppError("ID do livro inválido.", HTTPCODES.BADREQUEST);
    }

    if (!bookcaseId) {
        throw new AppError("ID da estante inválida.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const bookExists = await tx.book.findUnique({where: {id_book: book}});

        if (!bookExists) {
            throw new AppError("ID do Livro não encontrado.", HTTPCODES.NOTFOUND);
        }

        const bookcaseExists = await tx.bookcase.findUnique({where: {id_bookcase: bookcase}});

        if (!bookcaseExists) {
            throw new AppError("ID da Prateleira não encontrada.", HTTPCODES.NOTFOUND)
        }

        return tx.book_Copy.create({
            data: {
                ...rest,
                book: { connect: { id_book: bookId } },
                bookcase: { connect: { id_bookcase: bookcaseId } },
                institution: { connect: { id_institution: institutionId } }
            }
        });
    })
}

export async function update(bookCopyIdS: string | string[], body: UpdateBookCopyDTO) {
    const bookCopyId = returnNumberedID(bookCopyIdS);

    const { bookcase, institution, ...rest } = body;
    const bookcaseId = bookcase;
    const institutionId = institution;

    if (!bookCopyId) {
        throw new AppError("ID da cópia do livro inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const bookCopyExists = await tx.book_Copy.findUnique({ where: { id_book_copy: bookCopyId } });

        if (!bookCopyExists) {
            throw new AppError("Cópia do livro não encontrada.", HTTPCODES.NOTFOUND);
        }

        if (bookcaseId) {
            const bookcaseExists = await tx.bookcase.findUnique({ where: { id_bookcase: bookcaseId } });

            if (!bookcaseExists) {
                throw new AppError("Estante não encontrada.", HTTPCODES.NOTFOUND);
            }
        }

        return tx.book_Copy.update({
            where: { id_book_copy: bookCopyId },
            data: {
                ...rest,
                ...(institutionId && { institution: { connect: { id_institution: institutionId } } }),
                ...(bookcaseId && { bookcase: { connect: { id_bookcase: bookcaseId } } })
            }
        });
    });
}

export async function deleteById(bookCopyIdS: string | string[]) {
    const book_CopyId = returnNumberedID(bookCopyIdS);

    if (!book_CopyId) {
        throw new AppError("ID da Cópia do livro inválido.", HTTPCODES.BADREQUEST);
    }

    const book_CopyExists = await prisma.book_Copy.findUnique({where: {id_book_copy: book_CopyId}});

    if (!book_CopyExists) {
        throw new AppError("Cópia do livro não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.book_Copy.delete({where: {id_book_copy: book_CopyId}});
}

//==============================
// Copy Book Utils Functions
//==============================
export async function changeBookCopyState(bookCopyIdS: string | string[], newState: stateEnum) {
    const bookCopyId = returnNumberedID(bookCopyIdS);

    if (!bookCopyId) {
        throw new AppError("ID da cópia do livro inválido", HTTPCODES.BADREQUEST);
    }

    const copyBookExists = await repository.book_Copy.findUnique({where: {id_book_copy: bookCopyId}});

    if (!copyBookExists) {
        throw new AppError("Cópia do livro não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.book_Copy.update({
        where: {
            id_book_copy: bookCopyId
        },
        data: {
            state: newState
        }
    })
}

export async function changeBookCopyVirtual(bookCopyIdS: string | string[]) {
    const bookCopyId = returnNumberedID(bookCopyIdS);

    if (!bookCopyId) {
        throw new AppError("ID da cópia do livro inválido", HTTPCODES.BADREQUEST);
    }

    const copyBookExists = await repository.book_Copy.findUnique({where: {id_book_copy: bookCopyId}});

    if (!copyBookExists) {
        throw new AppError("Cópia do livro não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.book_Copy.update({
        where: { id_book_copy: bookCopyId },
        data: {
            is_virtual: !copyBookExists.is_virtual
        }
    });
}

export async function changeBookCopyConsult(bookCopyIdS: string | string[]) {
    const bookCopyId = returnNumberedID(bookCopyIdS);

    if (!bookCopyId) {
        throw new AppError("ID da cópia do livro inválido", HTTPCODES.BADREQUEST);
    }

    const copyBookExists = await repository.book_Copy.findUnique({where: {id_book_copy: bookCopyId}});

    if (!copyBookExists) {
        throw new AppError("Cópia do livro não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.book_Copy.update({
        where: { id_book_copy: bookCopyId },
        data: {
            is_consult: !copyBookExists.is_consult
        }
    });
}