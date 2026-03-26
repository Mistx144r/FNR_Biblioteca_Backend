-- CreateEnum
CREATE TYPE "state_enum" AS ENUM ('DISPONIVEL', 'RESERVADO', 'EMPRESTADO', 'INDISPONIVEL');

-- CreateTable
CREATE TABLE "worker" (
    "id_worker" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(9),
    "cellphone" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fk_institution_id" BIGINT NOT NULL,

    CONSTRAINT "worker_pkey" PRIMARY KEY ("id_worker")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_roles" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_roles")
);

-- CreateTable
CREATE TABLE "worker_roles" (
    "worker_roles_id" BIGSERIAL NOT NULL,
    "fk_role_id" BIGINT NOT NULL,
    "fk_worker_id" BIGINT NOT NULL,

    CONSTRAINT "worker_roles_pkey" PRIMARY KEY ("worker_roles_id")
);

-- CreateTable
CREATE TABLE "book" (
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

    CONSTRAINT "book_pkey" PRIMARY KEY ("id_book")
);

-- CreateTable
CREATE TABLE "author" (
    "id_author" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id_author")
);

-- CreateTable
CREATE TABLE "authors_in_book" (
    "authors_in_book_id" BIGSERIAL NOT NULL,
    "fk_author_id" BIGINT NOT NULL,
    "fk_book_id" BIGINT NOT NULL,

    CONSTRAINT "authors_in_book_pkey" PRIMARY KEY ("authors_in_book_id")
);

-- CreateTable
CREATE TABLE "sector" (
    "id_sector" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "letter" VARCHAR(1) NOT NULL,
    "fk_category_id" BIGINT NOT NULL,
    "fk_institution_id" BIGINT NOT NULL,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "bookcase" (
    "id_bookcase" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fk_sector_id" BIGINT NOT NULL,

    CONSTRAINT "bookcase_pkey" PRIMARY KEY ("id_bookcase")
);

-- CreateTable
CREATE TABLE "book_copy" (
    "id_book_copy" BIGSERIAL NOT NULL,
    "fk_book_id" BIGINT NOT NULL,
    "fk_bookcase_id" BIGINT NOT NULL,
    "fk_institution_id" BIGINT NOT NULL,
    "is_consult" BOOLEAN NOT NULL DEFAULT false,
    "state" "state_enum" NOT NULL DEFAULT 'DISPONIVEL',
    "is_virtual" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "book_copy_pkey" PRIMARY KEY ("id_book_copy")
);

-- CreateTable
CREATE TABLE "institution" (
    "id_institution" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id_institution")
);

-- CreateTable
CREATE TABLE "category" (
    "id_category" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id_category")
);

-- CreateTable
CREATE TABLE "sub_category" (
    "id_sub_category" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "sub_category_pkey" PRIMARY KEY ("id_sub_category")
);

-- CreateTable
CREATE TABLE "sub_categories_in_book" (
    "id_sub_categories_of_book" BIGSERIAL NOT NULL,
    "fk_sub_category" BIGINT NOT NULL,
    "fk_book_id" BIGINT NOT NULL,

    CONSTRAINT "sub_categories_in_book_pkey" PRIMARY KEY ("id_sub_categories_of_book")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_cpf_key" ON "worker"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "worker_email_key" ON "worker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "worker_roles_fk_role_id_fk_worker_id_key" ON "worker_roles"("fk_role_id", "fk_worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "authors_in_book_fk_author_id_fk_book_id_key" ON "authors_in_book"("fk_author_id", "fk_book_id");

-- CreateIndex
CREATE UNIQUE INDEX "sector_fk_institution_id_name_key" ON "sector"("fk_institution_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sector_fk_institution_id_letter_key" ON "sector"("fk_institution_id", "letter");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_in_book_fk_sub_category_fk_book_id_key" ON "sub_categories_in_book"("fk_sub_category", "fk_book_id");

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_fk_institution_id_fkey" FOREIGN KEY ("fk_institution_id") REFERENCES "institution"("id_institution") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_roles" ADD CONSTRAINT "worker_roles_fk_role_id_fkey" FOREIGN KEY ("fk_role_id") REFERENCES "roles"("id_roles") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_roles" ADD CONSTRAINT "worker_roles_fk_worker_id_fkey" FOREIGN KEY ("fk_worker_id") REFERENCES "worker"("id_worker") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_fk_category_id_fkey" FOREIGN KEY ("fk_category_id") REFERENCES "category"("id_category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors_in_book" ADD CONSTRAINT "authors_in_book_fk_author_id_fkey" FOREIGN KEY ("fk_author_id") REFERENCES "author"("id_author") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors_in_book" ADD CONSTRAINT "authors_in_book_fk_book_id_fkey" FOREIGN KEY ("fk_book_id") REFERENCES "book"("id_book") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector" ADD CONSTRAINT "sector_fk_category_id_fkey" FOREIGN KEY ("fk_category_id") REFERENCES "category"("id_category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector" ADD CONSTRAINT "sector_fk_institution_id_fkey" FOREIGN KEY ("fk_institution_id") REFERENCES "institution"("id_institution") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookcase" ADD CONSTRAINT "bookcase_fk_sector_id_fkey" FOREIGN KEY ("fk_sector_id") REFERENCES "sector"("id_sector") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_copy" ADD CONSTRAINT "book_copy_fk_bookcase_id_fkey" FOREIGN KEY ("fk_bookcase_id") REFERENCES "bookcase"("id_bookcase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_copy" ADD CONSTRAINT "book_copy_fk_book_id_fkey" FOREIGN KEY ("fk_book_id") REFERENCES "book"("id_book") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_copy" ADD CONSTRAINT "book_copy_fk_institution_id_fkey" FOREIGN KEY ("fk_institution_id") REFERENCES "institution"("id_institution") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories_in_book" ADD CONSTRAINT "sub_categories_in_book_fk_sub_category_fkey" FOREIGN KEY ("fk_sub_category") REFERENCES "sub_category"("id_sub_category") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories_in_book" ADD CONSTRAINT "sub_categories_in_book_fk_book_id_fkey" FOREIGN KEY ("fk_book_id") REFERENCES "book"("id_book") ON DELETE CASCADE ON UPDATE CASCADE;
