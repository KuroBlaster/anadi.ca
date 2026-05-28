export type NavItem = {
  href: string;
  label: string;
};

export type SiteConfig = {
  siteUrl: string;
  brandName: string;
  fullName: string;
  legacyName?: string;
  position: string;
  location?: string;
  entityEmail: string;
  educationInstitution: string;
  educationField: string;
  businessIdentity: string;
  relatedVentures: string[];
  technicalSkills: string[];
  creativeIdentity: string;
  artistAlias: string;
  signalStatement: string;
  intro: string;
  manifesto: string;
  contactEmail: string;
  instagramHandle?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  crunchbaseUrl?: string;
  theOrgUrl?: string;
  youtubeUrl?: string;
  githubUrl?: string;
  travelCompanyName?: string;
  travelCompanyUrl?: string;
  soundcloudProfileUrl?: string;
  soundcloudTracks?: {
    title: string;
    url: string;
    embedUrl: string;
    imageUrl?: string;
    imageAlt?: string;
    youtubeUrl?: string;
  }[];
  themeMode?: "charcoal";
  motionMode?: "pulse-drift";
  navigation: NavItem[];
};

export type WorkCategory = "Writing" | "Music" | "Systems" | "Projects";

export type WorkItem = {
  id: string;
  title: string;
  category: WorkCategory;
  description: string;
  tag: string;
  link?: string;
  ctaLabel?: string;
  featured?: boolean;
  isCursed?: boolean;
};

export type FieldNote = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  imageAlt?: string;
  tags: string[];
  readTime: string;
  archetype?: string;
  isCursed?: boolean;
};

export type WorkPostStatus = "draft" | "published";
export type WorkPostDateSource = "publishedAt" | "createdAt" | "updatedAt";

export type WorkPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  imageAlt?: string;
  youtubeUrl?: string;
  contentMarkdown: string;
  contentHtml: string;
  tags: string[];
  readTime: string;
  archetype?: string;
  isHomepageFeatured: boolean;
  isSelectedWorkFeatured: boolean;
  isCursed: boolean;
  status: WorkPostStatus;
  displayDateSource: WorkPostDateSource;
  displayDate: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type MusicEntryStatus = "draft" | "published";

export type MusicEntryRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  soundcloudUrl: string;
  soundcloudEmbedUrl: string;
  youtubeUrl?: string;
  lyricsMarkdown: string;
  lyricsHtml: string;
  analysisMarkdown: string;
  analysisHtml: string;
  relatedNotes: string[];
  isCursed: boolean;
  status: MusicEntryStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
