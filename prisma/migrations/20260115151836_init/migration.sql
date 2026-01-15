-- CreateEnum
CREATE TYPE "AffairStatus" AS ENUM ('REACTION_NEEDED', 'WAITING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affair" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "affairCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "affairValue" DOUBLE PRECISION,
    "files" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "involvedUserId" TEXT,
    "inviteToken" TEXT,
    "inviteTokenUsed" BOOLEAN NOT NULL DEFAULT false,
    "aiAnalysis" TEXT,
    "aiAnalysisGeneratedAt" TIMESTAMP(3),
    "settlementProposalStatus" TEXT,
    "settlementAcceptedBy" TEXT,
    "settlementModificationRequests" TEXT,

    CONSTRAINT "Affair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffairParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "affairId" TEXT NOT NULL,
    "status" "AffairStatus" NOT NULL,
    "description" TEXT,
    "files" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settlementAcceptedAt" TIMESTAMP(3),
    "settlementModificationRequestedAt" TIMESTAMP(3),

    CONSTRAINT "AffairParticipant_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Affair" ADD CONSTRAINT "Affair_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affair" ADD CONSTRAINT "Affair_involvedUserId_fkey" FOREIGN KEY ("involvedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffairParticipant" ADD CONSTRAINT "AffairParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffairParticipant" ADD CONSTRAINT "AffairParticipant_affairId_fkey" FOREIGN KEY ("affairId") REFERENCES "Affair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
