/*
  Warnings:

  - You are about to drop the column `content` on the `translations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "translations" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255),
    "translation_id" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationFile" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "TranslationFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_translation_id_fkey" FOREIGN KEY ("translation_id") REFERENCES "translations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
