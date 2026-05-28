import Link from "next/link";
import { EntryImage } from "@/components/content/entry-image";
import { FieldNote } from "@/types/content";

type NoteCardProps = {
  note: FieldNote;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="surface-card overflow-hidden rounded-2xl border border-edge/80 transition-all duration-300 hover:border-accent-crimson/60">
      <div className={note.imageUrl ? "grid gap-0 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]" : ""}>
        {note.imageUrl ? (
          <EntryImage
            imageUrl={note.imageUrl}
            alt={note.imageAlt ?? `${note.title} cover image`}
            aspectClassName="aspect-[4/3]"
            className="rounded-none border-0"
            sizes="(min-width: 768px) 260px, 100vw"
          />
        ) : null}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-accent-gold">
              {new Date(note.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-soft">{note.readTime}</span>
            {note.isCursed ? (
              <span className="rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                Cursed Series
              </span>
            ) : null}
            {note.archetype ? (
              <span className="rounded-full border border-edge px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-soft">
                {note.archetype}
              </span>
            ) : null}
          </div>

          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent-gold">Article</p>
          <h3 className="mt-3 font-display text-2xl tracking-[0.01em] text-ink sm:text-[2rem]">{note.title}</h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">{note.excerpt}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-edge px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent-gold"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/writing/${note.slug}`}
            className="mt-6 inline-flex text-sm uppercase tracking-[0.18em] text-accent-blue transition-colors hover:text-ink"
          >
            Read entry
          </Link>
        </div>
      </div>
    </article>
  );
}
