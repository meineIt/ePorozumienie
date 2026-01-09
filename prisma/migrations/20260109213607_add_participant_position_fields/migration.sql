-- AlterTable
ALTER TABLE "AffairParticipant" ADD COLUMN "description" TEXT;
ALTER TABLE "AffairParticipant" ADD COLUMN "files" TEXT;

-- Migrate existing data from Affair to AffairParticipant
-- Update existing participants (creators) with data from Affair
UPDATE "AffairParticipant"
SET 
  "description" = (
    SELECT "description" 
    FROM "Affair" 
    WHERE "Affair"."id" = "AffairParticipant"."affairId" 
      AND "Affair"."creatorId" = "AffairParticipant"."userId"
  ),
  "files" = (
    SELECT "files" 
    FROM "Affair" 
    WHERE "Affair"."id" = "AffairParticipant"."affairId" 
      AND "Affair"."creatorId" = "AffairParticipant"."userId"
  )
WHERE EXISTS (
  SELECT 1 
  FROM "Affair" 
  WHERE "Affair"."id" = "AffairParticipant"."affairId" 
    AND "Affair"."creatorId" = "AffairParticipant"."userId"
);

-- Create participant records for affairs that don't have a creator participant yet
INSERT INTO "AffairParticipant" ("id", "userId", "affairId", "status", "description", "files", "createdAt", "updatedAt")
SELECT 
  lower(hex(randomblob(16))) as id,
  "creatorId" as userId,
  "id" as affairId,
  'WAITING' as status,
  "description" as description,
  "files" as files,
  "createdAt" as createdAt,
  "updatedAt" as updatedAt
FROM "Affair"
WHERE NOT EXISTS (
  SELECT 1 
  FROM "AffairParticipant" 
  WHERE "AffairParticipant"."affairId" = "Affair"."id" 
    AND "AffairParticipant"."userId" = "Affair"."creatorId"
);
