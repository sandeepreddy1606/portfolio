"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE, SOCIALS } from "@/constants/site";
import { contactSchema, type ContactSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { EASE, fadeUp, slideInLeft, stagger, viewportOnce } from "@/lib/motion";
import { useCopy } from "@/hooks/use-copy";

export function Contact() {
  const [sent, setSent] = React.useState(false);
  const { copied, copy } = useCopy();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: ContactSchema) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error("Message not sent", {
          description: payload.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setSent(true);
      reset();
      toast.success("Message sent", { description: "I'll get back to you shortly." });
      setTimeout(() => setSent(false), 6000);
    } catch {
      toast.error("Network error", {
        description: `Could not reach the server. Email me directly at ${SITE.email}.`,
      });
    }
  };

  return (
    <Section id="contact">
      <div className="container-page">
        <SectionHeading
          title="Let's build something worth shipping."
          description="Open to full-time roles and freelance work. Tell me what you're building and I'll reply with something more useful than a thank-you note."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-8">
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-5"
          >
            <motion.div variants={slideInLeft}>
              <SpotlightCard className="p-6 sm:p-7">
                {/* Availability as a signal: green means the line is open. */}
                <p className="flex items-center gap-3 text-sm font-semibold">
                  <span
                    className="border-ink bg-surface-2 flex flex-col gap-0.5 rounded-[4px] border px-1 py-1"
                    aria-hidden
                  >
                    <span className="bg-lamp-red/15 size-2 rounded-full" />
                    <span className="bg-lamp-green size-2 rounded-full shadow-[0_0_8px_2px_rgb(76_194_122/0.5)]" />
                  </span>
                  {SITE.availability}
                </p>

                <p className="text-ink-muted mt-5 text-sm leading-relaxed">
                  The fastest route is the form — it lands in my inbox directly. If you would rather
                  not fill one in, the address below works just as well.
                </p>

                <button
                  type="button"
                  onClick={() => copy(SITE.email)}
                  className="border-line bg-surface-2/50 hover:border-accent/50 group mt-6 flex w-full items-center gap-3 rounded-md border px-4 py-3.5 text-left transition-colors duration-300"
                  aria-label={`Copy email address ${SITE.email}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-subtle block text-sm font-semibold">Email</span>
                    <span className="block truncate font-mono text-sm">{SITE.email}</span>
                  </span>
                  {copied ? (
                    <Check className="text-verify size-4 shrink-0" />
                  ) : (
                    <Copy className="text-ink-subtle group-hover:text-ink size-4 shrink-0 transition-colors" />
                  )}
                </button>

                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="border-line bg-surface-2/50 hover:border-accent/50 group mt-3 flex w-full items-center gap-3 rounded-md border px-4 py-3.5 transition-colors duration-300"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-subtle block text-sm font-semibold">Phone</span>
                    <span className="block truncate font-mono text-sm">{SITE.phone}</span>
                  </span>
                  <Phone className="text-ink-subtle group-hover:text-ink size-4 shrink-0 transition-colors" />
                </a>

                <div className="text-ink-muted mt-4 flex items-center gap-2.5 text-sm">
                  <MapPin className="text-accent size-4 shrink-0" />
                  {SITE.location} · {SITE.timezone}
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div variants={slideInLeft}>
              <SpotlightCard glow={false} className="p-6">
                <h3 className="text-ink-subtle font-sans text-sm font-semibold tracking-normal">
                  Elsewhere
                </h3>
                <ul className="mt-4 flex flex-col gap-1">
                  {SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:bg-surface-2 -mx-3 flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
                      >
                        <social.icon className="text-ink-muted size-4" />
                        <span className="text-sm">{social.label}</span>
                        <span className="text-ink-subtle ml-auto truncate font-mono text-xs">
                          {social.handle}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <SpotlightCard className="enamel relative p-6 sm:p-8">
              <h3 className="mb-6 text-3xl font-extrabold uppercase">Send a message</h3>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" error={errors.name?.message}>
                    <input
                      {...register("name")}
                      type="text"
                      autoComplete="name"
                      placeholder="Ada Lovelace"
                      aria-invalid={Boolean(errors.name)}
                      className={inputClass(Boolean(errors.name))}
                    />
                  </Field>

                  <Field label="Email" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="ada@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={inputClass(Boolean(errors.email))}
                    />
                  </Field>
                </div>

                <Field label="Subject" error={errors.subject?.message}>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="Frontend role at…"
                    aria-invalid={Boolean(errors.subject)}
                    className={inputClass(Boolean(errors.subject))}
                  />
                </Field>

                <Field label="Message" error={errors.message?.message}>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="What are you building, and where do I fit in?"
                    aria-invalid={Boolean(errors.message)}
                    className={cn(inputClass(Boolean(errors.message)), "h-auto resize-y py-3")}
                  />
                </Field>

                {/* Honeypot — hidden from users, irresistible to bots. */}
                <input
                  {...register("website")}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
                />

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send /> Send message
                      </>
                    )}
                  </Button>

                  <AnimatePresence>
                    {sent && (
                      <motion.p
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="text-verify flex items-center gap-2 text-sm"
                      >
                        <Check className="size-4" /> Sent — thank you.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "border-line bg-surface-2/40 placeholder:text-ink-subtle h-12 w-full rounded-xl border px-4 text-sm backdrop-blur-sm transition-colors duration-300 outline-none",
    invalid ? "border-red-500/60 focus:border-red-500" : "focus:border-accent/60",
  );

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-ink-subtle text-sm font-semibold">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="text-xs text-red-500"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
