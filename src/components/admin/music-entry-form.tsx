"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { MusicEntryRecord } from "@/types/content";

type MusicEntryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initial?: MusicEntryRecord | null;
};

export function MusicEntryForm({ action, submitLabel, initial }: MusicEntryFormProps) {
  const [lyricsMarkdown, setLyricsMarkdown] = useState<string>(
    initial?.lyricsMarkdown ?? "## Lyrics\n\nAdd the lyrics here.",
  );
  const [analysisMarkdown, setAnalysisMarkdown] = useState<string>(
    initial?.analysisMarkdown ?? "## What this song is doing\n\nExplain the motion, pressure, or pattern this song is working through.",
  );

  const relatedNotesValue = initial?.relatedNotes?.join(", ") ?? "";

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Song Title</span>
          <input
            required
            name="title"
            defaultValue={initial?.title ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Slug (optional)
          </span>
          <input
            name="slug"
            defaultValue={initial?.slug ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="auto-generated-from-title"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Description
        </span>
        <textarea
          required
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          placeholder="A short paragraph that explains the song."
        />
      </label>

      <ImageUploadField
        altName="imageAlt"
        altPlaceholder="Describe the image for screen readers and search engines"
        initialAlt={initial?.imageAlt ?? ""}
        initialUrl={initial?.imageUrl ?? ""}
        label={initial?.title ?? "Music entry image"}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            SoundCloud Track URL
          </span>
          <input
            required
            type="url"
            name="soundcloudUrl"
            defaultValue={initial?.soundcloudUrl ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="https://soundcloud.com/..."
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Embed URL (optional)
          </span>
          <input
            type="url"
            name="soundcloudEmbedUrl"
            defaultValue={initial?.soundcloudEmbedUrl ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="Auto-generated from track URL if left blank"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            YouTube URL (optional)
          </span>
          <input
            type="url"
            name="youtubeUrl"
            defaultValue={initial?.youtubeUrl ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="https://youtube.com/watch?v=..."
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Related Notes (comma separated)
        </span>
        <input
          name="relatedNotes"
          defaultValue={relatedNotesValue}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          placeholder="Mud Groove Drumming, Kinetic, Fire Brain"
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Status</span>
        <select
          name="status"
          defaultValue={initial?.status ?? "draft"}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent-blue"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-edge/80 px-4 py-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="isCursed"
          defaultChecked={initial?.isCursed ?? false}
          className="mt-1 h-4 w-4 rounded border-edge bg-canvas text-accent-crimson focus:ring-accent-blue"
        />
        <span>
          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Cursed Series
          </span>
          <span className="mt-1 block text-sm leading-6 text-ink-soft">
            Mark this track as darker or more intense. It will require a content warning click-through.
          </span>
        </span>
      </label>

      <div data-color-mode="dark">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Lyrics (Rich Markdown Editor)
        </span>
        <MDEditor
          value={lyricsMarkdown}
          onChange={(value: string | undefined) => setLyricsMarkdown(value ?? "")}
          preview="edit"
          height={280}
        />
      </div>
      <input type="hidden" name="lyricsMarkdown" value={lyricsMarkdown} />

      <div data-color-mode="dark">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          What This Song Is Doing (Rich Markdown Editor)
        </span>
        <MDEditor
          value={analysisMarkdown}
          onChange={(value: string | undefined) => setAnalysisMarkdown(value ?? "")}
          preview="edit"
          height={280}
        />
      </div>
      <input type="hidden" name="analysisMarkdown" value={analysisMarkdown} />

      <button
        type="submit"
        className="inline-flex rounded-full bg-accent-gold/85 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-canvas transition-all hover:-translate-y-0.5 hover:bg-accent-gold/95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitLabel}
      </button>
    </form>
  );
}
