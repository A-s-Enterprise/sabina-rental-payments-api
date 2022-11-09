/*
  Warnings:

  - You are about to drop the column `name` on the `additional_fees` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `additional_fees` table. All the data in the column will be lost.
  - Added the required column `description` to the `additional_fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `additional_fees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "additional_fees" DROP CONSTRAINT "additional_fees_userId_fkey";

-- AlterTable
ALTER TABLE "additional_fees" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "description" VARCHAR(50) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "additional_fees" ADD CONSTRAINT "additional_fees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
