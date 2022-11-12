-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_room_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "room_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
