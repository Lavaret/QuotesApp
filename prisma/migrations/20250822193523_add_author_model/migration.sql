/*
  Migration to add Author model and convert existing author strings to Author references
*/

-- CreateTable: Create the Author table first
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- Migrate existing author data: Insert unique authors from Post table
INSERT INTO "Author" ("name")
SELECT DISTINCT "author" FROM "Post" WHERE "author" IS NOT NULL;

-- Add authorId column as nullable first
ALTER TABLE "Post" ADD COLUMN "authorId" INTEGER;

-- Update authorId for existing posts
UPDATE "Post" SET "authorId" = "Author"."id"
FROM "Author"
WHERE "Post"."author" = "Author"."name";

-- Make authorId required after data migration
ALTER TABLE "Post" ALTER COLUMN "authorId" SET NOT NULL;

-- Drop the old author column
ALTER TABLE "Post" DROP COLUMN "author";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
