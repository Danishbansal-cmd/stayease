-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_couponId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "couponId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
