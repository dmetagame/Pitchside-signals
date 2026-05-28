"use client";

import {
  LayoutDashboard,
  Radio,
  Users,
  LineChart,
  Scale,
  Boxes,
  ChevronDown,
  FileCode2,
  ArrowLeftRight,
  ListChecks,
  BarChart3,
  Star,
  Settings,
  HelpCircle,
  Wallet,
  Coins,
  ExternalLink,
  X,
  Gavel,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import PitchSideLogo from "../logo";
import { useDashboard } from "./DashboardProvider";
import { useMobileNav } from "./DashboardLayout";
import SidebarNavItem, { type SidebarNavItemModel } from "./SidebarNavItem";
import { contractsConfigured } from "../../lib/contract";

function buildPrimaryNav(activeSignalCount: number): SidebarNavItemModel[] {
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      label: "Signals",
      icon: Radio,
      href: "/signals",
      badge: activeSignalCount > 0 ? activeSignalCount : undefined,
    },
    { label: "Agents", icon: Users, href: "/agents" },
    { label: "Markets", icon: LineChart, href: "/markets" },
    { label: "Settlement", icon: Scale, href: "/settlement" },
  ];
}

const onchainNav: SidebarNavItemModel[] = [
  { label: "Contracts", icon: FileCode2, href: "/onchain/contracts" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/onchain/transactions" },
  { label: "Auto-resolver", icon: Gavel, href: "/resolver" },
  { label: "Resolver log", icon: ListChecks, href: "/onchain/resolver-log" },
];

const secondaryNav: SidebarNavItemModel[] = [
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Followed Agents", icon: Star, href: "/followed-agents" },
];

const footerNav: SidebarNavItemModel[] = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Help", icon: HelpCircle, href: "/help" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function shortAddr(addr?: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function NavSection({
  items,
  pathname,
}: {
  items: SidebarNavItemModel[];
  pathname: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <SidebarNavItem key={item.label} item={item} active={isActive(pathname, item.href)} />
      ))}
    </div>
  );
}

function SectionDivider() {
  return <div aria-hidden className="my-1 h-px bg-line-soft" />;
}

export default function Sidebar() {
  const pathname = usePathname() ?? "/";
  const [onchainOpen, setOnchainOpen] = useState(true);
  const { open: mobileOpen, setOpen: setMobileOpen } = useMobileNav();
  const {
    signals,
    walletAddress,
    walletBalanceUsdc,
    walletOnXLayer,
    busy,
    connectWallet,
    claimDemoUsdc,
  } = useDashboard();

  const activeSignalCount = signals.filter((s) => s.status === "active").length;
  const primaryNav = buildPrimaryNav(activeSignalCount);
  const connected = Boolean(walletAddress);

  return (
    <>
      {mobileOpen && (
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}
      <aside
        className={[
          "z-40 flex w-72 shrink-0 flex-col gap-5 border-r border-line bg-panel/90 px-4 py-6 backdrop-blur",
          "fixed inset-y-0 left-0 transition-transform duration-200 ease-out md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:flex md:w-64 lg:w-72",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 px-2">
          <PitchSideLogo size={22} className="text-accent drop-shadow-[0_0_8px_rgba(34,226,4,0.55)]" />
          <span className="flex-1 truncate text-[20px] font-bold tracking-tight text-text">
            pitchside
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-panel-muted hover:text-text md:hidden"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <NavSection items={primaryNav} pathname={pathname} />

          <SectionDivider />

          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setOnchainOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint hover:text-muted"
            >
              <Boxes className="size-3.5" strokeWidth={2} />
              <span className="flex-1 text-left">Onchain</span>
              <ChevronDown
                className={`size-3.5 transition-transform ${onchainOpen ? "" : "-rotate-90"}`}
                strokeWidth={2}
              />
            </button>
            {onchainOpen && <NavSection items={onchainNav} pathname={pathname} />}
          </div>

          <SectionDivider />

          <NavSection items={secondaryNav} pathname={pathname} />
        </nav>

        <div className="flex flex-col gap-3">
          <SectionDivider />
          <NavSection items={footerNav} pathname={pathname} />

          <div className="rounded-2xl border border-line-strong bg-panel-muted p-4">
            {connected ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-[11px] font-semibold text-accent-foreground">
                    {walletAddress!.slice(2, 4).toUpperCase()}
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="font-mono text-xs text-text">
                      {shortAddr(walletAddress)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-faint">
                      Wallet
                    </span>
                  </div>
                  <Coins className="size-4 text-accent" strokeWidth={1.75} />
                </div>
                <div
                  className={[
                    "mb-3 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    walletOnXLayer
                      ? "border-accent/40 bg-accent/5 text-accent"
                      : "border-danger/40 bg-danger-soft text-danger",
                  ].join(" ")}
                >
                  <span
                    className={`size-1.5 rounded-full ${walletOnXLayer ? "bg-accent" : "bg-danger"}`}
                  />
                  {walletOnXLayer ? "X Layer" : "Wrong network"}
                </div>
                <p className="text-[11px] leading-relaxed text-muted">
                  {walletBalanceUsdc !== undefined
                    ? `Balance ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(walletBalanceUsdc)} · claim demo stake credits for judge walkthroughs.`
                    : "Claim demo stake credits after funding X Layer OKB for gas."}
                </p>
                <button
                  type="button"
                  onClick={claimDemoUsdc}
                  disabled={busy.claim}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/70 bg-accent/5 px-3 py-2 text-xs font-semibold text-accent shadow-[0_0_18px_rgba(34,226,4,0.22)] hover:bg-accent/10 disabled:opacity-60"
                >
                  {busy.claim ? "Claiming..." : contractsConfigured ? "Claim PSC" : "Open bridge"}
                  <ExternalLink className="size-3" strokeWidth={2} />
                </button>
              </>
            ) : (
              <>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Wallet className="size-5" strokeWidth={1.75} />
                </div>
                <div className="text-sm font-semibold text-text">Connect wallet</div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  Stake X Cup calls and earn forecast reputation on X Layer.
                </p>
                <button
                  type="button"
                  onClick={connectWallet}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-[0_0_18px_rgba(34,226,4,0.35)] hover:bg-accent-strong"
                >
                  Connect
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
