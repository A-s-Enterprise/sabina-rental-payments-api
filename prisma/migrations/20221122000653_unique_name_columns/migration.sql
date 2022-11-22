/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `floors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `room_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "floors_name_key" ON "floors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_name_key" ON "room_types"("name");
