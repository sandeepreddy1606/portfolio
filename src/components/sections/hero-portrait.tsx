import Image from "next/image";
import { SITE } from "@/constants/site";

/**
 * The portrait as a signal lamp: a cut-out of Sandeep, traced with a white
 * line, standing in front of a lamp disc. The shoulders sit inside the disc;
 * the head breaks out above its brass rim.
 *
 * Asset: public/portrait-cutout.png — derived from public/profile.png with an
 * OpenCV GrabCut matte (seeded by hand around the head and shoulders), then a
 * 6px white outline dilated from that matte. No generated imagery.
 *
 * Geometry (fractions of the square box): disc diameter 0.8, centred at
 * (0.5, 0.6). The lower layer is clipped to the disc so it hides the original
 * photo's circular crop; the upper layer shows only the top 44% of the box,
 * where the matte leaves just the head, so the head reads in front of the rim.
 */
const CUTOUT = "/portrait-cutout.png";

export function HeroPortrait() {
  return (
    <figure className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[23rem] lg:max-w-none">
      {/* Lamp disc: brass rim, dark housing, a warm lamp glow from below. */}
      <div
        aria-hidden
        className="border-brass absolute top-[20%] left-[10%] aspect-square w-[80%] rounded-full border-[5px] bg-[#1a2420] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 95%, rgb(244 183 49 / 0.35), transparent 58%)",
        }}
      />

      {/* Amber ring that draws itself once: the signal clearing. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute top-[17%] left-[7%] w-[86%] -rotate-90 overflow-visible"
      >
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--color-lamp-amber)"
          strokeWidth="0.9"
          strokeLinecap="round"
          pathLength={1}
          className="portrait-ring"
        />
      </svg>

      {/* Layer 1: the whole figure, clipped to the disc. */}
      <div
        className="portrait-rise absolute inset-0"
        style={{ clipPath: "circle(38.6% at 50% 60%)" }}
      >
        <Image
          src={CUTOUT}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 23rem, 26rem"
          className="object-contain"
        />
      </div>

      {/* Layer 2: the head, free of the disc, in front of the rim. */}
      <div className="portrait-rise absolute inset-0" style={{ clipPath: "inset(0 0 56% 0)" }}>
        <Image
          src={CUTOUT}
          alt={`Portrait of ${SITE.name}`}
          fill
          priority
          sizes="(max-width: 1024px) 23rem, 26rem"
          className="object-contain"
        />
      </div>
    </figure>
  );
}
