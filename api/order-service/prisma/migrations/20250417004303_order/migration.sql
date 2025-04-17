-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('STOPPED', 'PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "products" JSONB NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusOrder" NOT NULL DEFAULT 'STOPPED',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
