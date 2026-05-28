import Image from "next/image";
import defaultPortraitImage from "@/assets/anadi_portrait.png";

export function AuthorBox() {
  return (
    <aside className="mt-12 max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-edge/70">
          <Image src={defaultPortraitImage} alt="Anadi Mishra portrait" fill sizes="40px" className="object-cover" />
        </span>
        <p className="font-display text-base tracking-[0.02em] text-ink">Anadi Mishra</p>
      </div>
    </aside>
  );
}
