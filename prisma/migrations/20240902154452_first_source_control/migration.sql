/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Enum(EnumId(0))`.
  - Added the required column `salt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `salt` VARCHAR(45) NOT NULL,
    MODIFY `role` ENUM('Admin', 'Writer', 'User') NOT NULL DEFAULT 'User';
