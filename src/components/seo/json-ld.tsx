import { SITE, SOCIALS } from "@/constants/site";
import { PROJECTS } from "@/constants/projects";
import { VENTURE } from "@/constants/venture";

/**
 * Person + WebSite structured data. Rendered server-side; search engines read
 * it without executing any client JavaScript.
 */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE.url,
        email: `mailto:${SITE.email}`,
        jobTitle: SITE.role,
        description: SITE.description,
        image: `${SITE.url}${SITE.avatar}`,
        telephone: SITE.phoneHref,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: SITE.university,
        },
        worksFor: {
          "@type": "Organization",
          name: VENTURE.name,
          url: VENTURE.orgUrl,
          description: VENTURE.tagline,
        },
        sameAs: SOCIALS.filter((s) => !s.href.startsWith("mailto:")).map((s) => s.href),
        knowsAbout: [
          "Full-Stack Development",
          "Artificial Intelligence",
          "Next.js",
          "TypeScript",
          "Python",
          "FastAPI",
          "NestJS",
          "Spring Boot",
          "Flutter",
          "Computer Vision",
        ],
        address: { "@type": "PostalAddress", addressCountry: SITE.location },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: `${SITE.name} — Portfolio`,
        description: SITE.description,
        inLanguage: "en-GB",
        publisher: { "@id": `${SITE.url}/#person` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE.url}/#projects`,
        name: "Selected work",
        itemListElement: PROJECTS.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: project.title,
            description: project.tagline,
            codeRepository: project.repo,
            programmingLanguage: project.stack,
            author: { "@id": `${SITE.url}/#person` },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Structured data is generated here, not user input — nothing to sanitise.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
