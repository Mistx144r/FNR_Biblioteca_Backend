import { z } from "zod";
import { PrismaClient, Prisma } from "@prisma/client";
import { bookFilterSchema } from "../schemas/bookSchema";

type PossibleFilters = z.infer<typeof bookFilterSchema>;
type PaginatedReturnData = {
    data: any[],
    meta: {
        total: number
        pages: number
        limit: number
        totalPages: number
        hasNextPage: boolean,
        hasPreviousPage: boolean
    }
}

const currentSearchThreshold = 0.3;

export async function searchBooksByNameWithFuzzy(
    prisma: PrismaClient,
    skip: number,
    limit: number,
    filters: PossibleFilters
): Promise<PaginatedReturnData> {
    const { name, category, language, edition, isbn, published_at } = filters;

    const [books, countResult] = await Promise.all([
        prisma.$queryRaw<any[]>`
            SELECT
                b.*,
                COALESCE(
                        json_agg(
                                json_build_object('id_author', a.id_author, 'name', a.name)
                        ) FILTER (WHERE a.id_author IS NOT NULL),
                        '[]'
                ) as authors,
                json_build_object('id_category', c.id_category, 'name', c.name) as category
            FROM "book" b
                     LEFT JOIN "authors_in_book" aib ON aib.fk_book_id = b.id_book
                     LEFT JOIN "author" a ON a.id_author = aib.fk_author_id
                     LEFT JOIN "category" c ON c.id_category = b.fk_category_id
            WHERE (similarity(b.name, ${name}) > ${currentSearchThreshold}
                OR b.name ILIKE ${'%' + name + '%'})
                ${category ? Prisma.sql`AND b.fk_category_id = ${BigInt(category)}` : Prisma.sql``}
                  ${language ? Prisma.sql`AND b.language = ${language}` : Prisma.sql``}
                  ${edition ? Prisma.sql`AND b.edition = ${edition}` : Prisma.sql``}
                  ${isbn ? Prisma.sql`AND b.isbn ILIKE ${'%' + isbn + '%'}` : Prisma.sql``}
                  ${published_at ? Prisma.sql`AND b.published_at = ${new Date(published_at)}` : Prisma.sql``}
            GROUP BY b.id_book, c.id_category, c.name
            ORDER BY similarity(b.name, ${name}) DESC
                LIMIT ${limit} OFFSET ${skip}
        `,

        prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(DISTINCT b.id_book) FROM "book" b
            WHERE (similarity(b.name, ${name}) > ${currentSearchThreshold}
                OR b.name ILIKE ${'%' + name + '%'})
                ${category ? Prisma.sql`AND b.fk_category_id = ${BigInt(category)}` : Prisma.sql``}
                  ${language ? Prisma.sql`AND b.language = ${language}` : Prisma.sql``}
                  ${edition ? Prisma.sql`AND b.edition = ${edition}` : Prisma.sql``}
                  ${isbn ? Prisma.sql`AND b.isbn ILIKE ${'%' + isbn + '%'}` : Prisma.sql``}
                  ${published_at ? Prisma.sql`AND b.published_at = ${new Date(published_at)}` : Prisma.sql``}
        `
    ]);

    const total = Number(countResult[0].count);

    return {
        data: books,
        meta: {
            total,
            pages: skip / limit + 1,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: skip / limit + 1 < Math.ceil(total / limit),
            hasPreviousPage: skip / limit + 1 > 1
        }
    };
}