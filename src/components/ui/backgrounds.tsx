"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-media-query";

/** Full-bleed noise overlay. Pure CSS — no image request. */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[var(--noise-opacity)] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/** Three slow-drifting colour fields. Sits behind everything, never interactive. */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="animate-aurora absolute -top-1/3 left-[-10%] size-[70vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--glow-a), transparent 65%)" }}
      />
      <div
        className="animate-aurora absolute top-[10%] right-[-15%] size-[60vw] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--glow-b), transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="animate-aurora absolute bottom-[-25%] left-[25%] size-[55vw] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, var(--glow-c), transparent 65%)",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}

/** Grid with a radial mask so the lines dissolve toward the edges. */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("grid-bg pointer-events-none absolute inset-0", className)}
      style={{
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 100%)",
      }}
    />
  );
}

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

/**
 * Lightweight canvas particle field with cursor repulsion.
 *
 * Canvas rather than WebGL: this is a decorative layer, and a 2D context costs
 * a fraction of the bundle and battery that a Three.js scene would. Pauses when
 * scrolled out of view and skips entirely under reduced-motion.
 */
export function ParticleField({ className, count = 46 }: { className?: string; count?: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.6,
          a: Math.random() * 0.35 + 0.12,
        });
      }
    };

    const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Gentle repulsion so the field reacts to the cursor without chasing it.
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 14400 && distSq > 0.01) {
          const force = (1 - distSq / 14400) * 0.4;
          const dist = Math.sqrt(distSq);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = ink ? `color-mix(in oklch, ${ink} ${p.a * 100}%, transparent)` : "#8884";
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    seed();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      seed();
    });
    resizeObserver.observe(canvas);

    // Stop burning frames once the hero scrolls away.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [count, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
