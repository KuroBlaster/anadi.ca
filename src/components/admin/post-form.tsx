"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { WorkPostRecord } from "@/types/content";

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initial?: WorkPostRecord | null;
};

export function PostForm({ action, submitLabel, initial }: PostFormProps) {
  const [markdown, setMarkdown] = useState<string>(
    initial?.contentMarkdown ??
      `## New entry\n\nStart drafting your piece here.\n\n- Insight\n- Pattern\n- Direction`,
  );

  const tagsValue = initial?.tags?.join(", ") ?? "";
  const displayDateSourceValue = initial?.displayDateSource ?? "publishedAt";

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Title</span>
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
          Excerpt (optional)
        </span>
        <textarea
          name="excerpt"
          rows={3}
          defaultValue={initial?.excerpt ?? ""}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          placeholder="Leave blank to auto-generate from content."
        />
      </label>

      <ImageUploadField
        altName="imageAlt"
        altPlaceholder="Describe the image for screen readers and search engines"
        initialAlt={initial?.imageAlt ?? ""}
        initialUrl={initial?.imageUrl ?? ""}
        label={initial?.title ?? "Work entry image"}
      />

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

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Tags (comma separated)
          </span>
          <input
            name="tags"
            defaultValue={tagsValue}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="travel, rhythm, systems"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Read Time (optional)
          </span>
          <input
            name="readTime"
            defaultValue={initial?.readTime ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="auto"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Archetype (optional)
          </span>
          <input
            name="archetype"
            defaultValue={initial?.archetype ?? ""}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          />
        </label>
      </div>

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
            Mark this entry as darker or more intense. It will show a warning gate before readers can open it.
          </span>
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Public Date Shown
        </span>
        <select
          name="displayDateSource"
          defaultValue={displayDateSourceValue}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent-blue"
        >
          <option value="publishedAt">Published date</option>
          <option value="createdAt">Created date</option>
          <option value="updatedAt">Updated date</option>
        </select>
        <span className="mt-2 block text-xs leading-6 text-ink-soft">
          Choose which backend timestamp the public blog pages should show.
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-edge/80 px-4 py-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="isHomepageFeatured"
          defaultChecked={initial?.isHomepageFeatured ?? false}
          className="mt-1 h-4 w-4 rounded border-edge bg-canvas text-accent-gold focus:ring-accent-blue"
        />
        <span>
          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Homepage Feature
          </span>
          <span className="mt-1 block text-sm leading-6 text-ink-soft">
            Show this published entry in the homepage writing grid.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-edge/80 px-4 py-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="isSelectedWorkFeatured"
          defaultChecked={initial?.isSelectedWorkFeatured ?? false}
          className="mt-1 h-4 w-4 rounded border-edge bg-canvas text-accent-gold focus:ring-accent-blue"
        />
        <span>
          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Creative Systems Feature
          </span>
          <span className="mt-1 block text-sm leading-6 text-ink-soft">
            Show this published entry in the Creative Systems page.
          </span>
        </span>
      </label>

      <div data-color-mode="dark">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Content (Rich Markdown Editor)
        </span>
        <MDEditor
          value={markdown}
          onChange={(value: string | undefined) => setMarkdown(value ?? "")}
          preview="edit"
          height={420}
        />
      </div>
      <input type="hidden" name="contentMarkdown" value={markdown} />

      <button
        type="submit"
        className="inline-flex rounded-full bg-accent-gold/85 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-canvas transition-all hover:-translate-y-0.5 hover:bg-accent-gold/95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitLabel}
      </button>
    </form>
  );
}
