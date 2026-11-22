import Image from "next/image";
import { SITE } from "@/constants/site";

/**
 * The portrait as a signal lamp: a cut-out of Sandeep, traced with a white
 * line, standing in front of a lamp disc. The shoulders sit inside the disc;
 * the head breaks out above its brass rim.
 *
 * Asset: public/portrait-cutout.png (1136px) — public/profile.png upscaled 2x
 * with Real-ESRGAN realesr-general-x4v3 (4x, area-downsampled to 2x, blended
 * 85/15 with bicubic to keep skin texture), cut out with an OpenCV GrabCut
 * matte seeded by hand, graded inside the matte only (skin-anchored white
 * balance, levels, CLAHE on L, midtone lift and soft fill on skin,
 * skin-protected vibrance, clarity and fine sharpening on L), then a 12px
 * white outline dilated from that matte.
 * No generated imagery: every pixel comes from the original photo.
 *
 * Geometry (fractions of the square box): disc diameter 0.8, centred at
 * (0.5, 0.6). The lower layer is clipped to the disc so it hides the original
 * photo's circular crop; the upper layer shows only the top 44% of the box,
 * where the matte leaves just the head, so the head reads in front of the rim.
 * The figure is scaled 1.14 about (50%, 65%) inside both layers, so the head
 * rises further above the rim; the upper clip extends past the box to keep
 * the top of the hair.
 */
const CUTOUT = "/portrait-cutout.png";

export function HeroPortrait() {
  return (
    <figure className="relative mx-auto aspect-square w-full max-w-[21rem] sm:max-w-[25rem] lg:max-w-none">
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
          sizes="(max-width: 1024px) 25rem, 32rem"
          quality={90}
          className="origin-[50%_65%] scale-[1.14] object-contain"
        />
      </div>

      {/* Layer 2: the head, free of the disc, in front of the rim. */}
      <div
        className="portrait-rise absolute inset-0"
        style={{ clipPath: "inset(-12% -12% 56% -12%)" }}
      >
        <Image
          src={CUTOUT}
          alt={`Portrait of ${SITE.name}`}
          fill
          priority
          sizes="(max-width: 1024px) 25rem, 32rem"
          quality={90}
          className="origin-[50%_65%] scale-[1.14] object-contain"
        />
      </div>
    </figure>
  );
}
