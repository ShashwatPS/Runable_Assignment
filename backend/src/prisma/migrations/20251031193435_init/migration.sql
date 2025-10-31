-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('TEXT', 'HEADING', 'IMAGE', 'CODE', 'TABLE', 'WEBPAGE_EMBED');

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "BlockType" NOT NULL,
    "textBlockId" TEXT,
    "headingBlockId" TEXT,
    "imageBlockId" TEXT,
    "codeBlockId" TEXT,
    "tableBlockId" TEXT,
    "webpageEmbedId" TEXT,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextBlock" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "TextBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadingBlock" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "HeadingBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageBlock" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "ImageBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeBlock" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT,

    CONSTRAINT "CodeBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableBlock" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "TableBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebpageEmbed" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "WebpageEmbed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_textBlockId_fkey" FOREIGN KEY ("textBlockId") REFERENCES "TextBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_headingBlockId_fkey" FOREIGN KEY ("headingBlockId") REFERENCES "HeadingBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_imageBlockId_fkey" FOREIGN KEY ("imageBlockId") REFERENCES "ImageBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_codeBlockId_fkey" FOREIGN KEY ("codeBlockId") REFERENCES "CodeBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_tableBlockId_fkey" FOREIGN KEY ("tableBlockId") REFERENCES "TableBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_webpageEmbedId_fkey" FOREIGN KEY ("webpageEmbedId") REFERENCES "WebpageEmbed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
