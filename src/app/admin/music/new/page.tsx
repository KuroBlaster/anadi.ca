import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { requireAdminUser } from "@/lib/admin-auth";
import { createMusicEntryAction } from "@/app/admin/actions";
import { MusicEntryForm } from "@/components/admin/music-entry-form";

export const metadata: Metadata = {
  title: "New Music Entry",
  robots: { index: false, follow: false },
};

export default async function NewMusicEntryPage() {
  await requireAdminUser();

  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl text-ink">New Music Entry</h1>
          <Link href="/admin" className="text-sm text-accent-blue hover:text-ink">
            Back to dashboard
          </Link>
        </div>

        <div className="surface-card rounded-2xl p-5 sm:p-6">
          <MusicEntryForm action={createMusicEntryAction} submitLabel="Create Song Entry" />
        </div>
      </div>
    </Container>
  );
}
