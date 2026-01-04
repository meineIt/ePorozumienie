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
    "involvedUserId" TEXT NOT NULL,
    CONSTRAINT "Affair_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Affair_involvedUserId_fkey" FOREIGN KEY ("involvedUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
