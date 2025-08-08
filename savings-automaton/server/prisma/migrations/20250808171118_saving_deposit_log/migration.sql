/*
  Warnings:

  - Added the required column `mobileNumber` to the `SavingSchedule` table without a default value. This is not possible if the table is not empty.
  - The required column `reference` was added to the `SavingSchedule` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `telco` to the `SavingSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Saving" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    CONSTRAINT "Saving_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceCharge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavingSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mobileNumber" TEXT NOT NULL,
    "telco" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "frequency" TEXT NOT NULL DEFAULT 'Monthly',
    "startDate" DATETIME NOT NULL,
    "nextRunAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SavingSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavingSchedule" ("amount", "createdAt", "frequency", "id", "isActive", "nextRunAt", "startDate", "userId") SELECT "amount", "createdAt", "frequency", "id", "isActive", "nextRunAt", "startDate", "userId" FROM "SavingSchedule";
DROP TABLE "SavingSchedule";
ALTER TABLE "new_SavingSchedule" RENAME TO "SavingSchedule";
CREATE UNIQUE INDEX "SavingSchedule_userId_key" ON "SavingSchedule"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Saving_userId_key" ON "Saving"("userId");
