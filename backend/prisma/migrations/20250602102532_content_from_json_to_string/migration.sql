-- AlterTable
ALTER TABLE "translation_files" ADD COLUMN     "parsed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "content" SET DATA TYPE TEXT;
