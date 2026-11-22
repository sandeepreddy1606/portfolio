"use client";

import { Check, Copy } from "lucide-react";
import { SITE } from "@/constants/site";
import { useCopy } from "@/hooks/use-copy";

export function CopyEmail() {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(SITE.email)}
      className="text-ink-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
      aria-label={copied ? "Email address copied" : `Copy email address ${SITE.email}`}
    >
      {copied ? <Check className="text-verify size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : SITE.email}
    </button>
  );
}
