CREATE TABLE "MusicEntry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "soundcloudUrl" TEXT NOT NULL,
    "soundcloudEmbedUrl" TEXT NOT NULL,
    "lyricsMarkdown" TEXT NOT NULL,
    "lyricsHtml" TEXT NOT NULL,
    "analysisMarkdown" TEXT NOT NULL,
    "analysisHtml" TEXT NOT NULL,
    "relatedNotes" TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MusicEntry_slug_key" ON "MusicEntry"("slug");
