/*
  Warnings:

  - Added the required column `availableFrom` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTo` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" ALTER COLUMN "isAvailable" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "availableFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "availableTo" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'GUEST';
