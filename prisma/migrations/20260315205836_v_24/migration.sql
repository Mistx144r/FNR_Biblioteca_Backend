-- CreateEnum
CREATE TYPE "stateEnum" AS ENUM ('DISPONIVEL', 'RESERVADO', 'EMPRESTADO', 'INDISPONIVEL');

-- CreateTable
CREATE TABLE "Worker" (
    "id_worker" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(9),
    "cellphone" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id_worker")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id_roles" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_roles")
);

-- CreateTable
CREATE TABLE "Worker_Roles" (
    "worker_roles_id" BIGSERIAL NOT NULL,
    "fk_role_id" BIGINT NOT NULL,
    "fk_worker_id" BIGINT NOT NULL,

    CONSTRAINT "Worker_Roles_pkey" PRIMARY KEY ("worker_roles_id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id_book" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isbn" VARCHAR(13) NOT NULL,
    "description" TEXT NOT NULL,
    "publisher" VARCHAR(255) NOT NULL,
    "language" VARCHAR(5) NOT NULL,
    "fk_category_id" BIGINT NOT NULL,
    "edition" SMALLINT NOT NULL,
    "pages" INTEGER,
    "bookcover" TEXT,
    "published_at" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id_book")
);

-- CreateTable
CREATE TABLE "Author" (
    "id_author" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id_author")
);

-- CreateTable
CREATE TABLE "Authors_In_Book" (
    "authors_in_book_id" BIGSERIAL NOT NULL,
    "fk_author_id" BIGINT NOT NULL,
    "fk_book_id" BIGINT NOT NULL,

    CONSTRAINT "Authors_In_Book_pkey" PRIMARY KEY ("authors_in_book_id")
);

-- CreateTable
CREATE TABLE "Sector" (
    "id_sector" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "letter" VARCHAR(1) NOT NULL,
    "fk_category_id" BIGINT NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "Bookcase" (
    "id_bookcase" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fk_sector_id" BIGINT NOT NULL,

    CONSTRAINT "Bookcase_pkey" PRIMARY KEY ("id_bookcase")
);

-- CreateTable
CREATE TABLE "Book_Copy" (
    "id_book_copy" BIGSERIAL NOT NULL,
    "fk_book_id" BIGINT NOT NULL,
    "fk_bookcase_id" BIGINT NOT NULL,
    "fk_institution_id" BIGINT NOT NULL,
    "is_consult" BOOLEAN NOT NULL DEFAULT false,
    "state" "stateEnum" NOT NULL DEFAULT 'DISPONIVEL',
    "is_virtual" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "Book_Copy_pkey" PRIMARY KEY ("id_book_copy")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id_institution" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id_institution")
);

-- CreateTable
CREATE TABLE "Category" (
    "id_category" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id_category")
);

-- CreateTable
CREATE TABLE "Sub_Category" (
    "id_sub_category" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Sub_Category_pkey" PRIMARY KEY ("id_sub_category")
);

-- CreateTable
CREATE TABLE "Sub_Categories_Of_Book" (
    "id_sub_categories_of_book" BIGSERIAL NOT NULL,
    "fk_sub_category" BIGINT NOT NULL,
    "fk_book_id" BIGINT NOT NULL,

    CONSTRAINT "Sub_Categories_Of_Book_pkey" PRIMARY KEY ("id_sub_categories_of_book")
);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_cpf_key" ON "Worker"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "Worker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_Roles_fk_role_id_fk_worker_id_key" ON "Worker_Roles"("fk_role_id", "fk_worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Authors_In_Book_fk_author_id_fk_book_id_key" ON "Authors_In_Book"("fk_author_id", "fk_book_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_letter_key" ON "Sector"("letter");

-- CreateIndex
CREATE UNIQUE INDEX "Sub_Categories_Of_Book_fk_sub_category_fk_book_id_key" ON "Sub_Categories_Of_Book"("fk_sub_category", "fk_book_id");

-- AddForeignKey
ALTER TABLE "Worker_Roles" ADD CONSTRAINT "Worker_Roles_fk_role_id_fkey" FOREIGN KEY ("fk_role_id") REFERENCES "Roles"("id_roles") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker_Roles" ADD CONSTRAINT "Worker_Roles_fk_worker_id_fkey" FOREIGN KEY ("fk_worker_id") REFERENCES "Worker"("id_worker") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_fk_category_id_fkey" FOREIGN KEY ("fk_category_id") REFERENCES "Category"("id_category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authors_In_Book" ADD CONSTRAINT "Authors_In_Book_fk_author_id_fkey" FOREIGN KEY ("fk_author_id") REFERENCES "Author"("id_author") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authors_In_Book" ADD CONSTRAINT "Authors_In_Book_fk_book_id_fkey" FOREIGN KEY ("fk_book_id") REFERENCES "Book"("id_book") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_fk_category_id_fkey" FOREIGN KEY ("fk_category_id") REFERENCES "Category"("id_category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookcase" ADD CONSTRAINT "Bookcase_fk_sector_id_fkey" FOREIGN KEY ("fk_sector_id") REFERENCES "Sector"("id_sector") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_Copy" ADD CONSTRAINT "Book_Copy_fk_bookcase_id_fkey" FOREIGN KEY ("fk_bookcase_id") REFERENCES "Bookcase"("id_bookcase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_Copy" ADD CONSTRAINT "Book_Copy_fk_book_id_fkey" FOREIGN KEY ("fk_book_id") REFERENCES "Book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book_Copy" ADD CONSTRAINT "Book_Copy_fk_institution_id_fkey" FOREIGN KEY ("fk_institution_id") REFERENCES "Institution"("id_institution") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_Categories_Of_Book" ADD CONSTRAINT "Sub_Categories_Of_Book_fk_sub_category_fkey" FOREIGN KEY ("fk_sub_category") REFERENCES "Sub_Category"("id_sub_category") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_Categories_Of_Book" ADD CONSTRAINT "Sub_Categories_Of_Book_fk_book_id_fkey" FOREIGN KEY ("fk_book_id") REFERENCES "Book"("id_book") ON DELETE CASCADE ON UPDATE CASCADE;
