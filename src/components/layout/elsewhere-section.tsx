import Link from "next/link";
import { siteConfig } from "@/data/site";
import { SectionHeading } from "@/components/ui/section-heading";

type ElsewhereSectionProps = {
  titleId: string;
};

type ProfileLink = {
  label: string;
  href: string;
  description: string;
};

const personalProfiles: ProfileLink[] = [
  siteConfig.instagramUrl
    ? {
        label: "Instagram",
        href: siteConfig.instagramUrl,
        description: "personal and creative updates",
      }
    : null,
  siteConfig.soundcloudProfileUrl
    ? {
        label: "SoundCloud",
        href: siteConfig.soundcloudProfileUrl,
        description: "music sketches and tracks",
      }
    : null,
  siteConfig.youtubeUrl
    ? {
        label: "YouTube",
        href: siteConfig.youtubeUrl,
        description: "video and channel updates",
      }
    : null,
].filter(Boolean) as ProfileLink[];

const professionalProfiles: ProfileLink[] = [
  {
    label: "Email",
    href: `mailto:${siteConfig.contactEmail}`,
    description: "direct contact",
  },
  siteConfig.linkedinUrl
    ? {
        label: "LinkedIn",
        href: siteConfig.linkedinUrl,
        description: "professional work",
      }
    : null,
  siteConfig.crunchbaseUrl
    ? {
        label: "Crunchbase",
        href: siteConfig.crunchbaseUrl,
        description: "company profile",
      }
    : null,
  siteConfig.theOrgUrl
    ? {
        label: "TheOrg",
        href: siteConfig.theOrgUrl,
        description: "company chart",
      }
    : null,
  siteConfig.travelCompanyUrl
    ? {
        label: "Globalduniya",
        href: siteConfig.travelCompanyUrl,
        description: "travel work",
      }
    : null,
  siteConfig.githubUrl
    ? {
        label: "GitHub",
        href: siteConfig.githubUrl,
        description: "systems and technical work",
      }
    : null,
].filter(Boolean) as ProfileLink[];

function ProfileGroup({ title, description, profiles }: { title: string; description: string; profiles: ProfileLink[] }) {
  return (
    <section className="rounded-2xl border border-edge/70 bg-canvas/20 p-4 sm:p-5">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent-gold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
      <div className="mt-4 space-y-3">
        {profiles.map((profile) => (
          <Link
            key={profile.label}
            href={profile.href}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-1 rounded-xl border border-edge/70 px-4 py-3 transition-colors hover:border-accent-blue/60 hover:bg-canvas/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <span className="font-display text-lg tracking-[0.02em] text-ink">{profile.label}</span>
            <span className="text-sm leading-6 text-ink-soft">{profile.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ElsewhereSection({ titleId }: ElsewhereSectionProps) {
  return (
    <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8" aria-labelledby={titleId}>
      <SectionHeading
        eyebrow="Elsewhere"
        title="Find me elsewhere"
        titleId={titleId}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ProfileGroup
          title="Personal"
          description="The creative and everyday side of the practice."
          profiles={personalProfiles}
        />
        <ProfileGroup
          title="Professional"
          description="The public work trail, company pages, and technical trace."
          profiles={professionalProfiles}
        />
      </div>
    </section>
  );
}
