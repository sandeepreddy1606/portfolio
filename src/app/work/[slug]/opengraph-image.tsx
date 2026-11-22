import { CASE_STUDIES, getCaseStudy } from "@/constants/case-studies";
import { SITE } from "@/constants/site";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return ogCard({
    kicker: `Case study — ${SITE.shortName}`,
    title: study?.title ?? SITE.name,
    subtitle: study?.thesis ?? SITE.tagline,
    flow: study?.flow,
  });
}
