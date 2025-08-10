-- CreateEnum
CREATE TYPE "public"."Frequency" AS ENUM ('Daily', 'Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "public"."Telco" AS ENUM ('Safaricom', 'Airtel', 'Equitel');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('INITIATED', 'RETRY', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavingSchedule" (
    "id" SERIAL NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "telco" "public"."Telco" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "frequency" "public"."Frequency" NOT NULL DEFAULT 'Monthly',
    "startDate" TIMESTAMP(3) NOT NULL,
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SavingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavingLog" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status",
    "message" TEXT,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "SavingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Saving" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,

    CONSTRAINT "Saving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceCharge" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT NOT NULL,

    CONSTRAINT "ServiceCharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavingSchedule_userId_key" ON "public"."SavingSchedule"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavingLog_scheduleId_key" ON "public"."SavingLog"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Saving_userId_key" ON "public"."Saving"("userId");

-- AddForeignKey
ALTER TABLE "public"."SavingSchedule" ADD CONSTRAINT "SavingSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavingLog" ADD CONSTRAINT "SavingLog_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."SavingSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Saving" ADD CONSTRAINT "Saving_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
