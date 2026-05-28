import { permanentRedirect } from "next/navigation";

type WorksSlugRedirectProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorksSlugRedirectPage({ params }: WorksSlugRedirectProps) {
  const { slug } = await params;
  permanentRedirect(`/writing/${slug}`);
}
