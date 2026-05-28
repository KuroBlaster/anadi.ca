import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { requireAdminUser } from "@/lib/admin-auth";
import { getMusicEntryById } from "@/lib/music-entries";
import {
  deleteMusicEntryAction,
  setMusicEntryStatusAction,
  updateMusicEntryAction,
} from "@/app/admin/actions";
import { MusicEntryForm } from "@/components/admin/music-entry-form";

export const metadata: Metadata = {
  title: "Edit Music Entry",
  robots: { index: false, follow: false },
};

type EditMusicPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMusicEntryPage({ params }: EditMusicPageProps) {
  await requireAdminUser();
  const { id } = await params;
  const entry = await getMusicEntryById(id);

  if (!entry) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">Edit Music Entry</h1>
            <p className="mt-2 text-sm text-ink-soft">{entry.slug}</p>
          </div>
          <Link href="/admin" className="text-sm text-accent-blue hover:text-ink">
            Back to dashboard
          </Link>
        </div>

        <div className="surface-card rounded-2xl p-5 sm:p-6">
          <MusicEntryForm action={updateMusicEntryAction.bind(null, entry.id)} submitLabel="Save Changes" initial={entry} />
          <div className="mt-6 flex flex-wrap gap-3 border-t border-edge/80 pt-5">
            {entry.status === "draft" ? (
              <form action={setMusicEntryStatusAction.bind(null, entry.id, "published")}>
                <button className="rounded-full bg-accent-gold/85 px-5 py-2.5 text-sm text-canvas hover:bg-accent-gold/95">
                  Publish
                </button>
              </form>
            ) : (
              <form action={setMusicEntryStatusAction.bind(null, entry.id, "draft")}>
                <button className="rounded-full border border-edge px-5 py-2.5 text-sm text-ink-soft hover:text-ink">
                  Unpublish
                </button>
              </form>
            )}
            <form action={deleteMusicEntryAction.bind(null, entry.id)}>
              <button className="rounded-full border border-accent-crimson/50 px-5 py-2.5 text-sm text-accent-crimson hover:text-ink">
                Delete
              </button>
            </form>
            <a
              href="/music"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-edge px-5 py-2.5 text-sm text-ink-soft hover:text-ink"
            >
              Open Music Page
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
