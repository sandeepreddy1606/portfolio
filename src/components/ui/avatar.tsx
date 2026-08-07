"use client";

import * as React from "react";
import Image from "next/image";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

/**
 * Portrait with a designed fallback.
 *
 * `public/profile.jpg` is not committed — LinkedIn blocks automated reads and
 * both the GitHub and LeetCode avatars are default placeholders. Until the real
 * photo is dropped in, this renders a deliberate monogram rather than a broken
 * image or a generic identicon. Adding the file needs no code change.
 */
export function ProfileImage({
  className,
  sizes,
  priority,
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "from-accent/25 via-iris/15 relative grid size-full place-items-center bg-gradient-to-br to-transparent",
          className,
        )}
      >
        <span
          aria-hidden
          className="dot-bg absolute inset-0 opacity-60"
          style={{
            maskImage: "radial-gradient(circle at 50% 50%, #000 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 20%, transparent 70%)",
          }}
        />
        <span className="relative flex flex-col items-center gap-2">
          <span className="font-display from-ink to-ink-subtle bg-gradient-to-br bg-clip-text text-6xl font-bold tracking-tighter text-transparent sm:text-7xl">
            {SITE.initials}
          </span>
          <span className="text-ink-subtle font-mono text-[10px] tracking-[0.22em] uppercase">
            {SITE.role}
          </span>
        </span>
      </div>
    );
  }

  return (
    <Image
      src={SITE.avatar}
      alt={`${SITE.name} — portrait`}
      fill
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
