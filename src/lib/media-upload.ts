import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const IMAGE_EXTENSION_BY_MIME = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

export async function saveUploadedImageFile(file: File, folder: string) {
  if (!file || typeof file !== "object" || typeof (file as File).arrayBuffer !== "function") {
    throw new Error("Image file is required.");
  }

  if ((file as File).size <= 0) {
    return null;
  }

  if ((file as File).size > MAX_IMAGE_BYTES) {
    throw new Error("Image file must be 8MB or smaller.");
  }

  const mimeType = ((file as File).type ?? "").toLowerCase();
  const extension = IMAGE_EXTENSION_BY_MIME.get(mimeType);

  if (!extension) {
    throw new Error("Image file must be a JPEG, PNG, WebP, GIF, or AVIF image.");
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  try {
    const bytes = Buffer.from(await (file as File).arrayBuffer());
    await writeFile(filePath, bytes);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : null;
    if (code === "EACCES" || code === "EPERM") {
      throw new Error("Upload failed because the server cannot write to public/uploads. Fix the Linux file permissions for the app user.");
    }
    throw error;
  }

  return `/uploads/${folder}/${fileName}`;
}
