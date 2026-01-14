-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Affair" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "affairCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "affairValue" REAL,
    "files" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    "involvedUserId" TEXT,
    "inviteToken" TEXT,
    "inviteTokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "aiAnalysis" TEXT,
    "aiAnalysisGeneratedAt" DATETIME,
    CONSTRAINT "Affair_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Affair_involvedUserId_fkey" FOREIGN KEY ("involvedUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffairParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "affairId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "files" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AffairParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AffairParticipant_affairId_fkey" FOREIGN KEY ("affairId") REFERENCES "Affair" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Affair_inviteToken_key" ON "Affair"("inviteToken");

-- CreateIndex
CREATE INDEX "AffairParticipant_userId_idx" ON "AffairParticipant"("userId");

-- CreateIndex
CREATE INDEX "AffairParticipant_affairId_idx" ON "AffairParticipant"("affairId");

-- CreateIndex
CREATE INDEX "AffairParticipant_status_idx" ON "AffairParticipant"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AffairParticipant_userId_affairId_key" ON "AffairParticipant"("userId", "affairId");
