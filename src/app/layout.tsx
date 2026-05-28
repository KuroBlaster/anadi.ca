import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";
import defaultPortraitImage from "@/assets/anadi_portrait.png";
import { siteConfig } from "@/data/site";
import { AmbientPulseLayer } from "@/components/ui/groove-motion";
import { absoluteUrl, createPersonSchema, createWebsiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: "Anadi Mishra",
  icons: {
    icon: [
      { url: "/icon", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon",
    apple: "/apple-icon",
  },
  title: `${siteConfig.fullName} | Official Website`,
  description: `${siteConfig.fullName} is a Vancouver-based systems builder, writer, developer, and creative practitioner connected to ${siteConfig.travelCompanyName}.`,
  keywords: [
    siteConfig.fullName,
    siteConfig.brandName,
    siteConfig.legacyName ?? "",
    "Anadi Mishra",
    siteConfig.artistAlias,
    "Zhango Mishra",
    "Vancouver, British Columbia, Canada",
    "British Columbia Institute of Technology",
    "BCIT",
    "Predictive Analytics",
    "PHP",
    "Laravel",
    "JavaScript",
    "HTML/CSS",
    "web systems development",
    "digital systems architecture",
    "digital marketing",
    "creative systems",
    "writer",
    "musician",
    "developer",
    "systems builder",
    "co-owner",
    "founder",
    "Globalduniya Canada",
    "Travel Whisky",
    "portfolio",
    "writing",
  ],
  authors: [{ name: siteConfig.fullName, url: absoluteUrl("/anadi-mishra") }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  openGraph: {
    title: `${siteConfig.fullName} | Official Website`,
    description:
      `Songs, essays, systems, and travel-focused work by Anadi Mishra, a Vancouver-based systems builder, writer, developer, and founder of ${siteConfig.travelCompanyName}.`,
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: absoluteUrl(defaultPortraitImage.src),
        width: 1200,
        height: 630,
        alt: `${siteConfig.fullName} official website`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} | Official Website`,
    description:
      `Songs, essays, systems, and travel-focused work by Anadi Mishra, a Vancouver-based systems builder, writer, developer, and founder of ${siteConfig.travelCompanyName}.`,
    images: [absoluteUrl(defaultPortraitImage.src)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = createWebsiteSchema();
  const personStructuredData = createPersonSchema({
    sameAs: [
      siteConfig.linkedinUrl,
      siteConfig.crunchbaseUrl,
      siteConfig.theOrgUrl,
      siteConfig.githubUrl,
      siteConfig.soundcloudProfileUrl,
      siteConfig.youtubeUrl,
      siteConfig.instagramUrl,
      siteConfig.travelCompanyUrl,
    ],
    jobTitle: siteConfig.position,
    alternateName: siteConfig.artistAlias,
    email: siteConfig.entityEmail,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.educationInstitution,
      alternateName: "BCIT",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vancouver",
      addressRegion: "British Columbia",
      addressCountry: "Canada",
    },
    knowsAbout: [
      ...siteConfig.technicalSkills,
      siteConfig.educationField,
      siteConfig.businessIdentity,
      ...siteConfig.relatedVentures,
    ],
    image: absoluteUrl(defaultPortraitImage.src),
  });

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full bg-canvas text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <AmbientPulseLayer />
        <div className="relative z-10 flex min-h-full flex-col">
          <SiteHeader navigation={siteConfig.navigation} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
