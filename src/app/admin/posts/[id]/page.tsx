import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { requireAdminUser } from "@/lib/admin-auth";
import { getPostById } from "@/lib/work-posts";
import { deletePostAction, setStatusAction, updatePostAction } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = {
  title: "Edit Writing Entry",
  robots: { index: false, follow: false },
};

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPageProps) {
  await requireAdminUser();
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">Edit Writing Entry</h1>
            <p className="mt-2 text-sm text-ink-soft">{post.slug}</p>
          </div>
          <Link href="/admin" className="text-sm text-accent-blue hover:text-ink">
            Back to dashboard
          </Link>
        </div>

        <div className="surface-card rounded-2xl p-5 sm:p-6">
          <PostForm action={updatePostAction.bind(null, post.id)} submitLabel="Save Changes" initial={post} />
          <div className="mt-6 flex flex-wrap gap-3 border-t border-edge/80 pt-5">
            {post.status === "draft" ? (
              <form action={setStatusAction.bind(null, post.id, "published")}>
                <button className="rounded-full bg-accent-gold/85 px-5 py-2.5 text-sm text-canvas hover:bg-accent-gold/95">
                  Publish
                </button>
              </form>
            ) : (
              <form action={setStatusAction.bind(null, post.id, "draft")}>
                <button className="rounded-full border border-edge px-5 py-2.5 text-sm text-ink-soft hover:text-ink">
                  Unpublish
                </button>
              </form>
            )}
            <form action={deletePostAction.bind(null, post.id)}>
              <button className="rounded-full border border-accent-crimson/50 px-5 py-2.5 text-sm text-accent-crimson hover:text-ink">
                Delete
              </button>
            </form>
            <a
              href={`/writing/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-edge px-5 py-2.5 text-sm text-ink-soft hover:text-ink"
            >
              Open Public Page
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
