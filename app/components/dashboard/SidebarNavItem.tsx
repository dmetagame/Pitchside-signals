import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type SidebarNavItemModel = {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
};

type SidebarNavItemProps = {
  item: SidebarNavItemModel;
  active: boolean;
};

export default function SidebarNavItem({ item, active }: SidebarNavItemProps) {
  const Icon = item.icon;
  const className = [
    "group relative flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition-all",
    active
      ? "border-accent/80 bg-transparent text-accent shadow-[0_0_24px_rgba(34,226,4,0.25)]"
      : "border-transparent text-muted hover:border-line hover:bg-white/[0.025] hover:text-text",
  ].join(" ");

  const inner = (
    <>
      <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={[
            "rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
            active ? "bg-accent/15 text-accent" : "bg-panel-muted text-muted",
          ].join(" ")}
        >
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.href === "#") {
    return (
      <span className={`${className} cursor-not-allowed opacity-60`} aria-disabled>
        {inner}
      </span>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  );
}
