"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createMusicEntry, deleteMusicEntry, setMusicEntryStatus, updateMusicEntry } from "@/lib/music-entries";
import {
  createPost,
  deletePost,
  normalizeWorkPostDateSource,
  setStatus,
  updatePost,
} from "@/lib/work-posts";
import { requireAdminUser } from "@/lib/admin-auth";

function parseTags(raw: string) {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getUploadedImageFile(formData: FormData) {
  const file = formData.get("imageFile");

  if (
    file &&
    typeof file === "object" &&
    typeof (file as File).arrayBuffer === "function" &&
    typeof (file as File).size === "number" &&
    (file as File).size > 0
  ) {
    return file as File;
  }

  return null;
}

function parsePostForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    imageFile: getUploadedImageFile(formData),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
    contentMarkdown: String(formData.get("contentMarkdown") ?? ""),
    tags: parseTags(String(formData.get("tags") ?? "")),
    readTime: String(formData.get("readTime") ?? ""),
    archetype: String(formData.get("archetype") ?? ""),
    isHomepageFeatured: formData.get("isHomepageFeatured") === "on",
    isSelectedWorkFeatured: formData.get("isSelectedWorkFeatured") === "on",
    isCursed: formData.get("isCursed") === "on",
    status: (String(formData.get("status") ?? "draft") as "draft" | "published") ?? "draft",
    displayDateSource: normalizeWorkPostDateSource(String(formData.get("displayDateSource") ?? "publishedAt")),
  };
}

function parseRelatedNotes(raw: string) {
  return raw
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);
}

function parseMusicEntryForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    imageFile: getUploadedImageFile(formData),
    soundcloudUrl: String(formData.get("soundcloudUrl") ?? ""),
    soundcloudEmbedUrl: String(formData.get("soundcloudEmbedUrl") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
    lyricsMarkdown: String(formData.get("lyricsMarkdown") ?? ""),
    analysisMarkdown: String(formData.get("analysisMarkdown") ?? ""),
    relatedNotes: parseRelatedNotes(String(formData.get("relatedNotes") ?? "")),
    isCursed: formData.get("isCursed") === "on",
    status: (String(formData.get("status") ?? "draft") as "draft" | "published") ?? "draft",
  };
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/anadi-mishra");
  revalidatePath("/about");
  revalidatePath("/writing");
  revalidatePath("/creative-systems");
  revalidatePath("/music");
}

export async function createPostAction(formData: FormData) {
  await requireAdminUser();
  const input = parsePostForm(formData);
  const post = await createPost(input);
  revalidateAll();
  redirect(`/admin/posts/${post.id}`);
}

export async function updatePostAction(postId: string, formData: FormData) {
  await requireAdminUser();
  const input = parsePostForm(formData);
  const post = await updatePost(postId, input);
  revalidateAll();
  revalidatePath(`/writing/${post.slug}`);
  revalidatePath("/creative-systems");
  redirect(`/admin/posts/${post.id}`);
}

export async function setStatusAction(postId: string, status: "draft" | "published") {
  await requireAdminUser();
  const post = await setStatus(postId, status);
  revalidateAll();
  revalidatePath(`/writing/${post.slug}`);
  revalidatePath("/creative-systems");
}

export async function deletePostAction(postId: string) {
  await requireAdminUser();
  await deletePost(postId);
  revalidateAll();
  redirect("/admin");
}

export async function createMusicEntryAction(formData: FormData) {
  await requireAdminUser();
  const input = parseMusicEntryForm(formData);
  const entry = await createMusicEntry(input);
  revalidateAll();
  redirect(`/admin/music/${entry.id}`);
}

export async function updateMusicEntryAction(entryId: string, formData: FormData) {
  await requireAdminUser();
  const input = parseMusicEntryForm(formData);
  const entry = await updateMusicEntry(entryId, input);
  revalidateAll();
  redirect(`/admin/music/${entry.id}`);
}

export async function setMusicEntryStatusAction(entryId: string, status: "draft" | "published") {
  await requireAdminUser();
  await setMusicEntryStatus(entryId, status);
  revalidateAll();
}

export async function deleteMusicEntryAction(entryId: string) {
  await requireAdminUser();
  await deleteMusicEntry(entryId);
  revalidateAll();
  redirect("/admin");
}
