import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { requireAdminUser } from "@/lib/admin-auth";
import { listAllMusicEntries } from "@/lib/music-entries";
import { listAllPosts } from "@/lib/work-posts";
import { logoutAction } from "@/app/admin/logout/actions";
import { setMusicEntryStatusAction, setStatusAction } from "@/app/admin/actions";
import type { MusicEntryRecord, WorkPostRecord } from "@/types/content";

function formatWorkPostDateSource(source: WorkPostRecord["displayDateSource"]) {
  switch (source) {
    case "createdAt":
      return "Created date";
    case "updatedAt":
      return "Updated date";
    default:
      return "Published date";
  }
}

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: "all" | "draft" | "published" }>;
}) {
  const user = await requireAdminUser();
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const status = params.status ?? "all";
  const [posts, musicEntries] = await Promise.all([listAllPosts(query, status), listAllMusicEntries(query, status)]);

  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">Admin CRM</h1>
            <p className="mt-2 text-sm text-ink-soft">Signed in as {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts/new"
              className="inline-flex rounded-full bg-accent-gold/85 px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-canvas hover:bg-accent-gold/95"
            >
              New Writing Entry
            </Link>
            <Link
              href="/admin/music/new"
              className="inline-flex rounded-full border border-edge px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
            >
              New Music Entry
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex rounded-full border border-edge px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>

        <form className="surface-card grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_auto_auto]">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by title or slug"
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
          />
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-edge bg-canvas px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-blue"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            className="rounded-lg border border-edge px-4 py-2.5 text-sm text-ink-soft hover:text-ink"
          >
            Filter
          </button>
        </form>

        <div className="space-y-3">
          <div>
            <h2 className="font-display text-2xl text-ink">Music Entries</h2>
            <p className="mt-1 text-sm text-ink-soft">Editable songs, embeds, lyrics, song notes, and related references.</p>
          </div>
          <div className="surface-card overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-edge/80">
                <tr className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-soft">
                  <th className="px-4 py-3">Song</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cursed</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {musicEntries.map((entry: MusicEntryRecord) => (
                  <tr key={entry.id} className="border-b border-edge/50 text-sm text-ink-soft">
                    <td className="px-4 py-3 text-ink">{entry.title}</td>
                    <td className="px-4 py-3">{entry.slug}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-edge px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em]">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.isCursed ? (
                        <span className="rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                          Cursed Series
                        </span>
                      ) : (
                        <span className="text-ink-soft/70">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{new Date(entry.updatedAt).toLocaleDateString("en-US")}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/music/${entry.id}`} className="text-accent-blue hover:text-ink">
                          Edit
                        </Link>
                        {entry.status === "draft" ? (
                          <form action={setMusicEntryStatusAction.bind(null, entry.id, "published")}>
                            <button className="text-accent-gold hover:text-ink">Publish</button>
                          </form>
                        ) : (
                          <form action={setMusicEntryStatusAction.bind(null, entry.id, "draft")}>
                            <button className="text-accent-crimson hover:text-ink">Unpublish</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {musicEntries.length === 0 ? (
              <p className="px-4 py-5 text-sm text-ink-soft">No music entries found for this filter.</p>
            ) : null}
          </div>
        </div>

        <div className="surface-card overflow-x-auto rounded-2xl">
          <div className="border-b border-edge/80 px-4 py-3">
            <h2 className="font-display text-2xl text-ink">Writing Entries</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Essays, notes, and field pieces that appear in Writing, the homepage, or Creative Systems.
            </p>
          </div>
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b border-edge/80">
              <tr className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-soft">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Homepage</th>
                <th className="px-4 py-3">Creative</th>
                <th className="px-4 py-3">Cursed</th>
                <th className="px-4 py-3">Public Date</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: WorkPostRecord) => (
                <tr key={post.id} className="border-b border-edge/50 text-sm text-ink-soft">
                  <td className="px-4 py-3 text-ink">{post.title}</td>
                  <td className="px-4 py-3">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-edge px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em]">
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {post.isHomepageFeatured ? (
                      <span className="rounded-full border border-accent-gold/40 bg-accent-gold/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-accent-gold">
                        Featured
                      </span>
                    ) : (
                      <span className="text-ink-soft/70">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.isSelectedWorkFeatured ? (
                      <span className="rounded-full border border-accent-blue/40 bg-accent-blue/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-accent-blue">
                        Curated
                      </span>
                    ) : (
                      <span className="text-ink-soft/70">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.isCursed ? (
                      <span className="rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        Cursed Series
                      </span>
                    ) : (
                      <span className="text-ink-soft/70">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-ink">{new Date(post.displayDate).toLocaleDateString("en-US")}</div>
                      <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-soft/70">
                        {formatWorkPostDateSource(post.displayDateSource)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{new Date(post.updatedAt).toLocaleDateString("en-US")}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/posts/${post.id}`} className="text-accent-blue hover:text-ink">
                        Edit
                      </Link>
                      {post.status === "draft" ? (
                        <form action={setStatusAction.bind(null, post.id, "published")}>
                          <button className="text-accent-gold hover:text-ink">Publish</button>
                        </form>
                      ) : (
                        <form action={setStatusAction.bind(null, post.id, "draft")}>
                          <button className="text-accent-crimson hover:text-ink">Unpublish</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 ? (
            <p className="px-4 py-5 text-sm text-ink-soft">No posts found for this filter.</p>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
