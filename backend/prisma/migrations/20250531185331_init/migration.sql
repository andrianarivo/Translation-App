-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);
