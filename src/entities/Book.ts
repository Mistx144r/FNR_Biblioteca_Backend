export interface Book{
    id_book: bigint
    name: string
    isbn: string
    description: string
    publisher: string // Pode ser modificado para uma FK
    language: string
    fk_category_id: bigint
    edition: number
    pages: number
    bookcover: string
    is_consult: boolean
    published_at: Date
}