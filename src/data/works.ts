import { WorkItem } from "@/types/content";

export const works: WorkItem[] = [
  {
    id: "w1",
    title: "The Grammar of Clarity",
    category: "Writing",
    description:
      "A longform essay about turning dense thought into language people can actually use in real decisions.",
    tag: "Essay",
    link: "/writing/the-mask-of-clarity",
    ctaLabel: "Read essay",
    featured: true,
  },
  {
    id: "w2",
    title: "Nocturne For Moving Cities",
    category: "Music",
    description:
      "A nocturnal ambient piece built from field recordings, modular textures, and restrained piano motifs.",
    tag: "Single",
    link: "https://soundcloud.com/anadi-mishra-855998503/the-velvet-swarm",
    ctaLabel: "Hear track",
    featured: true,
  },
  {
    id: "w3",
    title: "Translation Engine v0",
    category: "Systems",
    description:
      "A practical workflow for turning raw ideas into briefs, structures, and next actions across creative projects.",
    tag: "Framework",
    link: "/writing/listening-as-architecture",
    ctaLabel: "View framework",
    featured: true,
  },
  {
    id: "w4",
    title: "Atlas of Play",
    category: "Projects",
    description:
      "A growing library of workshop prompts and game-like structures used in collaboration and story development.",
    tag: "Live Project",
    link: "/writing/myth-in-product-language",
    ctaLabel: "Open project",
  },
  {
    id: "w5",
    title: "Rituals of Iteration",
    category: "Writing",
    description:
      "A set of notes on revision rhythm, creative stamina, and how to keep momentum across long cycles of work.",
    tag: "Longform",
    link: "/writing/tempo-before-scale",
    ctaLabel: "Read notes",
  },
  {
    id: "w6",
    title: "Pulse Architect (Live Sketch)",
    category: "Music",
    description:
      "A live sketch exploring how tempo and silence can shape emotional arc without over-arrangement.",
    tag: "Live Set",
    link: "https://soundcloud.com/anadi-mishra-855998503/walk-walk-walk-walk",
    ctaLabel: "Hear track",
  },
  {
    id: "w7",
    title: "Studio Operating System",
    category: "Systems",
    description:
      "A weekly system for capture, synthesis, publishing, and review across writing, music, and research.",
    tag: "Operating Model",
    link: "/writing/listening-as-architecture",
    ctaLabel: "View framework",
  },
  {
    id: "w8",
    title: "Mythic Interface Studies",
    category: "Projects",
    description:
      "Concept studies that pair archetypal story logic with modern interaction design and product behavior.",
    tag: "Design Research",
    link: "/writing/myth-in-product-language",
    ctaLabel: "Open project",
  },
];

export const workCategories = ["Writing", "Music", "Systems", "Projects"] as const;
