-- CreateTable
CREATE TABLE `Worker` (
    `id_worker` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `birth_date` DATE NULL,
    `telephone` VARCHAR(8) NULL,
    `cellphone` VARCHAR(13) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Worker_cpf_key`(`cpf`),
    UNIQUE INDEX `Worker_email_key`(`email`),
    PRIMARY KEY (`id_worker`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id_roles` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_roles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Worker_Roles` (
    `worker_roles_id` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_role_id` BIGINT NOT NULL,
    `fk_worker_id` BIGINT NOT NULL,

    PRIMARY KEY (`worker_roles_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id_student` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `enrollment` VARCHAR(20) NOT NULL,
    `birth_date` DATE NOT NULL,
    `telephone` VARCHAR(8) NOT NULL,
    `cellphone` VARCHAR(13) NOT NULL,
    `has_fine` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Student_cpf_key`(`cpf`),
    UNIQUE INDEX `Student_email_key`(`email`),
    UNIQUE INDEX `Student_enrollment_key`(`enrollment`),
    PRIMARY KEY (`id_student`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `id_book` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `isbn` VARCHAR(13) NULL,
    `description` TEXT NOT NULL,
    `publisher` VARCHAR(255) NOT NULL,
    `language` VARCHAR(5) NOT NULL,
    `fk_category_id` BIGINT NOT NULL,
    `edition` SMALLINT NOT NULL,
    `pages` INTEGER NULL,
    `bookcover` TEXT NULL,
    `is_consult` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_book`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Author` (
    `id_author` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `nationality` VARCHAR(255) NOT NULL,
    `birth_date` DATE NOT NULL,

    PRIMARY KEY (`id_author`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Authors_In_Book` (
    `authors_in_book_id` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_author_id` BIGINT NOT NULL,
    `fk_book_id` BIGINT NOT NULL,

    PRIMARY KEY (`authors_in_book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sector` (
    `id_sector` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `letter` VARCHAR(1) NOT NULL,
    `fk_category_id` BIGINT NOT NULL,

    UNIQUE INDEX `Sector_letter_key`(`letter`),
    PRIMARY KEY (`id_sector`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookcase` (
    `id_bookcase` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `fk_sector_id` BIGINT NOT NULL,

    PRIMARY KEY (`id_bookcase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book_Copy` (
    `id_book_copy` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_book_id` BIGINT NOT NULL,
    `fk_bookcase_id` BIGINT NOT NULL,
    `is_avaliable` BOOLEAN NOT NULL DEFAULT true,
    `condition` ENUM('VERY_BAD', 'BAD', 'NORMAL', 'GOOD', 'PRISTINE') NOT NULL,
    `barcode` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_book_copy`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fine` (
    `id_fine` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_student_id` BIGINT NOT NULL,
    `fk_loan_id` BIGINT NOT NULL,
    `amount` DECIMAL NOT NULL,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_fine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `id_loan` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_student_id` BIGINT NOT NULL,
    `fk_worker_id` BIGINT NOT NULL,
    `loan_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `due_date` DATE NOT NULL,
    `returned_at` DATE NOT NULL,

    PRIMARY KEY (`id_loan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan_Item` (
    `id_loan_item` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_book_copy_id` BIGINT NOT NULL,
    `fk_loan_item_id` BIGINT NOT NULL,

    PRIMARY KEY (`id_loan_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id_category` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sub_Category` (
    `id_sub_category` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_sub_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sub_Categories_Of_Book` (
    `id_sub_categories_of_book` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_sub_category` BIGINT NOT NULL,
    `fk_book_id` BIGINT NOT NULL,

    PRIMARY KEY (`id_sub_categories_of_book`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Worker_Roles` ADD CONSTRAINT `Worker_Roles_fk_role_id_fkey` FOREIGN KEY (`fk_role_id`) REFERENCES `Roles`(`id_roles`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Worker_Roles` ADD CONSTRAINT `Worker_Roles_fk_worker_id_fkey` FOREIGN KEY (`fk_worker_id`) REFERENCES `Worker`(`id_worker`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_fk_category_id_fkey` FOREIGN KEY (`fk_category_id`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authors_In_Book` ADD CONSTRAINT `Authors_In_Book_fk_author_id_fkey` FOREIGN KEY (`fk_author_id`) REFERENCES `Author`(`id_author`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authors_In_Book` ADD CONSTRAINT `Authors_In_Book_fk_book_id_fkey` FOREIGN KEY (`fk_book_id`) REFERENCES `Book`(`id_book`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sector` ADD CONSTRAINT `Sector_fk_category_id_fkey` FOREIGN KEY (`fk_category_id`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookcase` ADD CONSTRAINT `Bookcase_fk_sector_id_fkey` FOREIGN KEY (`fk_sector_id`) REFERENCES `Sector`(`id_sector`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fine` ADD CONSTRAINT `Fine_fk_student_id_fkey` FOREIGN KEY (`fk_student_id`) REFERENCES `Student`(`id_student`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fine` ADD CONSTRAINT `Fine_fk_loan_id_fkey` FOREIGN KEY (`fk_loan_id`) REFERENCES `Loan`(`id_loan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_fk_student_id_fkey` FOREIGN KEY (`fk_student_id`) REFERENCES `Student`(`id_student`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_fk_worker_id_fkey` FOREIGN KEY (`fk_worker_id`) REFERENCES `Worker`(`id_worker`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan_Item` ADD CONSTRAINT `Loan_Item_fk_book_copy_id_fkey` FOREIGN KEY (`fk_book_copy_id`) REFERENCES `Book_Copy`(`id_book_copy`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan_Item` ADD CONSTRAINT `Loan_Item_fk_loan_item_id_fkey` FOREIGN KEY (`fk_loan_item_id`) REFERENCES `Loan`(`id_loan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_Categories_Of_Book` ADD CONSTRAINT `Sub_Categories_Of_Book_id_sub_categories_of_book_fkey` FOREIGN KEY (`id_sub_categories_of_book`) REFERENCES `Sub_Category`(`id_sub_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_Categories_Of_Book` ADD CONSTRAINT `Sub_Categories_Of_Book_fk_book_id_fkey` FOREIGN KEY (`fk_book_id`) REFERENCES `Book`(`id_book`) ON DELETE RESTRICT ON UPDATE CASCADE;
