-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SavingSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "frequency" TEXT NOT NULL DEFAULT 'Monthly',
    "startDate" DATETIME NOT NULL,
    "nextRunAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SavingSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavingLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "executedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "scheduleId" INTEGER NOT NULL,
    CONSTRAINT "SavingLog_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "SavingSchedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavingSchedule_userId_key" ON "SavingSchedule"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavingLog_scheduleId_key" ON "SavingLog"("scheduleId");
