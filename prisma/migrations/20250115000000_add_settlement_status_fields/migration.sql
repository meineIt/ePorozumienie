-- AlterTable
ALTER TABLE "Affair" ADD COLUMN "settlementProposalStatus" TEXT;
ALTER TABLE "Affair" ADD COLUMN "settlementAcceptedBy" TEXT;
ALTER TABLE "Affair" ADD COLUMN "settlementModificationRequests" TEXT;

-- AlterTable
ALTER TABLE "AffairParticipant" ADD COLUMN "settlementAcceptedAt" DATETIME;
ALTER TABLE "AffairParticipant" ADD COLUMN "settlementModificationRequestedAt" DATETIME;
