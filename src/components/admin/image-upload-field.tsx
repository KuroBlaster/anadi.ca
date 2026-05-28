"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { EntryImage } from "@/components/content/entry-image";

type ImageUploadFieldProps = {
  altName: string;
  altPlaceholder: string;
  initialAlt?: string;
  initialUrl?: string;
  label: string;
};

export function ImageUploadField({
  altName,
  altPlaceholder,
  initialAlt = "",
  initialUrl = "",
  label,
}: ImageUploadFieldProps) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const previewAlt = initialAlt.trim() || label;

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFileName(file.name);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Image URL (optional)
          </span>
          <input
            type="text"
            name="imageUrl"
            defaultValue={initialUrl}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="https://example.com/cover.jpg or /uploads/writing/..."
            inputMode="url"
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Upload image file (optional)
          </span>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm text-ink outline-none file:mr-4 file:rounded-full file:border-0 file:bg-accent-gold/85 file:px-4 file:py-2 file:font-mono file:text-[0.68rem] file:uppercase file:tracking-[0.18em] file:text-canvas hover:file:bg-accent-gold/95"
          />
          <p className="mt-2 text-xs leading-5 text-ink-soft">
            The selected file will be saved by the backend when you submit the form. If both are used, the uploaded file wins. Local /uploads/... paths are accepted.
          </p>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Image alt text (optional)
        </span>
        <input
          type="text"
          name={altName}
          defaultValue={initialAlt}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          placeholder={altPlaceholder}
        />
      </label>

      {selectedFileName ? (
        <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
          Selected file: {selectedFileName}
        </p>
      ) : null}
      {localPreviewUrl ? (
        <div className="max-w-xl space-y-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Selected file preview
          </p>
          <EntryImage imageUrl={localPreviewUrl} alt={previewAlt} fit="contain" />
        </div>
      ) : null}
      {initialUrl && !localPreviewUrl ? (
        <div className="max-w-xl space-y-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
            Current image preview
          </p>
          <EntryImage imageUrl={initialUrl} alt={previewAlt} fit="contain" />
        </div>
      ) : null}
    </div>
  );
}
