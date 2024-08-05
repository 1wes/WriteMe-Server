-- CreateTable
CREATE TABLE `orderModification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modification_id` VARCHAR(45) NOT NULL,
    `order_id` VARCHAR(45) NOT NULL,
    `modification_type` VARCHAR(45) NOT NULL,
    `reason` VARCHAR(6000) NOT NULL,

    PRIMARY KEY (`id`, `modification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(45) NOT NULL,
    `created_by` VARCHAR(45) NOT NULL,
    `service` VARCHAR(45) NOT NULL,
    `subject` VARCHAR(45) NOT NULL,
    `level` VARCHAR(45) NOT NULL,
    `ref_style` VARCHAR(45) NOT NULL,
    `language` VARCHAR(45) NOT NULL,
    `sources` VARCHAR(45) NOT NULL,
    `files` VARCHAR(45) NULL,
    `instructions` VARCHAR(6000) NOT NULL,
    `topic` VARCHAR(6000) NOT NULL,
    `words_or_pages` VARCHAR(45) NOT NULL,
    `amount` VARCHAR(45) NOT NULL,
    `date_deadline` DATE NOT NULL,
    `time_deadline` TIME(0) NOT NULL,
    `status` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`, `order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sentOrders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(45) NOT NULL,
    `order_id` VARCHAR(45) NOT NULL,
    `files` VARCHAR(45) NOT NULL,
    `additionalMessage` VARCHAR(5000) NULL,
    `timestamp` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`, `transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(45) NOT NULL,
    `first_name` VARCHAR(45) NOT NULL,
    `last_name` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `phone_no` VARCHAR(45) NULL,
    `password` VARCHAR(6000) NOT NULL,
    `role` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`, `uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

