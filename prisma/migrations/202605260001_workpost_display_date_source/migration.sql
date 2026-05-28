-- CreateEnum
CREATE TYPE "WorkPostDateSource" AS ENUM ('publishedAt', 'createdAt', 'updatedAt');

-- AlterTable
ALTER TABLE "WorkPost"
ADD COLUMN "displayDateSource" "WorkPostDateSource" NOT NULL DEFAULT 'publishedAt';
