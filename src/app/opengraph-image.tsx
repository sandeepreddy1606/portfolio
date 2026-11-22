import { SITE } from "@/constants/site";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogCard({
    kicker: `${SITE.name} — ${SITE.role}`,
    title: SITE.pitch,
    subtitle: SITE.description,
  });
}
