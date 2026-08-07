"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  Copy,
  FileText,
  Home,
  Laptop,
  Mail,
  Moon,
  PenLine,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { NAV_ITEMS, SITE, SOCIALS } from "@/constants/site";

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CommandPaletteContext = React.createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used inside <CommandPaletteProvider>");
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggle = React.useCallback(() => setOpen((o) => !o), []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = React.useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette />
    </CommandPaletteContext.Provider>
  );
}

function Item({
  icon: Icon,
  label,
  shortcut,
  onSelect,
  external,
}: {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label: string;
  shortcut?: string;
  onSelect: () => void;
  external?: boolean;
}) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="text-ink-muted data-[selected=true]:bg-surface-2 data-[selected=true]:text-ink flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors select-none"
    >
      <Icon className="size-4 opacity-70" />
      <span className="flex-1">{label}</span>
      {external && <ArrowUpRight className="size-3.5 opacity-40" />}
      {shortcut && (
        <kbd className="border-line bg-surface text-ink-subtle rounded border px-1.5 py-0.5 font-mono text-[10px]">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const { setTheme } = useTheme();

  const run = React.useCallback(
    (action: () => void) => {
      setOpen(false);
      // Let the dialog close before navigating so the exit animation is not cut off.
      requestAnimationFrame(action);
    },
    [setOpen],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      // cmdk renders a Radix dialog; these class hooks style its portal parts.
      className="fixed inset-0 z-[90]"
      overlayClassName="fixed inset-0 z-[90] bg-canvas/60 backdrop-blur-sm"
      contentClassName="fixed top-[18%] left-1/2 z-[91] w-[min(92vw,34rem)] -translate-x-1/2"
    >
      <div className="glass border-line-strong overflow-hidden rounded-2xl shadow-[0_32px_90px_-30px_rgba(0,0,0,0.65)]">
        <Command.Input
          placeholder="Jump to a section, open a link, switch theme…"
          className="placeholder:text-ink-subtle border-line w-full border-b bg-transparent px-5 py-4 text-sm outline-none"
        />
        <Command.List className="max-h-[min(24rem,55vh)] scrollbar-none overflow-y-auto p-2">
          <Command.Empty className="text-ink-subtle px-3 py-8 text-center text-sm">
            No results.
          </Command.Empty>

          <Command.Group
            heading="Navigate"
            className="[&_[cmdk-group-heading]]:text-ink-subtle [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:uppercase"
          >
            <Item icon={Home} label="Home" onSelect={() => run(() => router.push("/"))} />
            {NAV_ITEMS.map((item) => (
              <Item
                key={item.href}
                icon={item.href === "/blog" ? PenLine : FileText}
                label={item.label}
                onSelect={() => run(() => router.push(item.href))}
              />
            ))}
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:text-ink-subtle [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:uppercase"
          >
            <Item
              icon={Copy}
              label="Copy email address"
              onSelect={() =>
                run(async () => {
                  await navigator.clipboard.writeText(SITE.email);
                  toast.success("Email copied", { description: SITE.email });
                })
              }
            />
            <Item
              icon={FileText}
              label="Download résumé"
              onSelect={() => run(() => window.open(SITE.resumeUrl, "_blank"))}
              external
            />
            <Item
              icon={Mail}
              label="Send a message"
              onSelect={() => run(() => router.push("/#contact"))}
            />
          </Command.Group>

          <Command.Group
            heading="Links"
            className="[&_[cmdk-group-heading]]:text-ink-subtle [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:uppercase"
          >
            {SOCIALS.map((social) => (
              <Item
                key={social.label}
                icon={social.icon}
                label={social.label}
                external
                onSelect={() => run(() => window.open(social.href, "_blank", "noopener"))}
              />
            ))}
          </Command.Group>

          <Command.Group
            heading="Theme"
            className="[&_[cmdk-group-heading]]:text-ink-subtle [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:uppercase"
          >
            <Item icon={Moon} label="Dark theme" onSelect={() => run(() => setTheme("dark"))} />
            <Item icon={Sun} label="Light theme" onSelect={() => run(() => setTheme("light"))} />
            <Item
              icon={Laptop}
              label="System theme"
              onSelect={() => run(() => setTheme("system"))}
            />
          </Command.Group>
        </Command.List>

        <div className="border-line text-ink-subtle flex items-center justify-between border-t px-4 py-2.5 font-mono text-[10px]">
          <span>↑↓ navigate · ↵ select</span>
          <span>esc to close</span>
        </div>
      </div>
    </Command.Dialog>
  );
}
