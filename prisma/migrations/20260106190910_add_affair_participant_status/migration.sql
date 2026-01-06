-- CreateTable
CREATE TABLE "AffairParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "affairId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AffairParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AffairParticipant_affairId_fkey" FOREIGN KEY ("affairId") REFERENCES "Affair" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AffairParticipant_userId_idx" ON "AffairParticipant"("userId");

-- CreateIndex
CREATE INDEX "AffairParticipant_affairId_idx" ON "AffairParticipant"("affairId");

-- CreateIndex
CREATE INDEX "AffairParticipant_status_idx" ON "AffairParticipant"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AffairParticipant_userId_affairId_key" ON "AffairParticipant"("userId", "affairId");

-- Populate existing affairs with participant records
-- Creator gets WAITING status
INSERT INTO "AffairParticipant" ("id", "userId", "affairId", "status", "createdAt", "updatedAt")
SELECT 
    lower(hex(randomblob(16))) as id,
    "creatorId" as userId,
    "id" as affairId,
    'WAITING' as status,
    "createdAt" as createdAt,
    "updatedAt" as updatedAt
FROM "Affair";

-- InvolvedUser (if exists) gets REACTION_NEEDED status
INSERT INTO "AffairParticipant" ("id", "userId", "affairId", "status", "createdAt", "updatedAt")
SELECT 
    lower(hex(randomblob(16))) as id,
    "involvedUserId" as userId,
    "id" as affairId,
    'REACTION_NEEDED' as status,
    "createdAt" as createdAt,
    "updatedAt" as updatedAt
FROM "Affair"
WHERE "involvedUserId" IS NOT NULL;
