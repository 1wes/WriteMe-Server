/*
  Warnings:

  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Active';
