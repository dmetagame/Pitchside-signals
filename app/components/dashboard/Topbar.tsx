"use client";

import { LogOut, Menu, Play, RefreshCw, Search, TimerReset, Wallet } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "./DashboardProvider";
import { useMobileNav } from "./DashboardLayout";
import FootballSpinner from "./FootballSpinner";
import NotificationsDropdown from "./NotificationsDropdown";
import ThemeToggle from "./ThemeToggle";

function shortAddr(addr?: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function Topbar() {
  const {
    walletAddress,
    walletOnXLayer,
    connectWallet,
    disconnectWallet,
    signals,
    syncState,
    busy,
    refreshChainState,
    runAgentCycle,
    runQuickLifecycleDemo,
  } = useDashboard();
  const { setOpen: setMobileNavOpen } = useMobileNav();
  const connected = Boolean(walletAddress);
  const cyclePending = busy.scan || busy.onchain;
  const cycleLabel = busy.scan ? "Scanning" : busy.onchain ? "Publishing" : "Run Forecast";
  const matchdayMarket =
    signals.find((signal) => signal.status === "active")?.market ?? "World Cup board";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-panel/80 px-4 backdrop-blur md:px-6">
      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-panel-muted text-muted md:hidden"
      >
        <Menu className="size-[18px]" strokeWidth={1.75} />
      </button>

      <Link
        href="/signals"
        className="hidden max-w-[220px] items-center gap-2 rounded-full border border-accent/50 bg-accent/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent shadow-[0_0_18px_rgba(34,226,4,0.16)] lg:inline-flex"
      >
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="truncate">Matchday · {matchdayMarket}</span>
      </Link>

      <div className="relative mx-auto flex w-full max-w-xl items-center">
        <Search
          className="pointer-events-none absolute left-3 size-[18px] text-faint"
          strokeWidth={1.75}
        />
        <input
          type="search"
          placeholder="Search signals, agents, markets…"
          className="w-full rounded-xl border border-line bg-panel-muted/70 py-2.5 pl-10 pr-14 text-sm text-text placeholder:text-faint focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
        <kbd className="absolute right-3 hidden items-center gap-1 rounded-md border border-line-soft bg-panel px-1.5 py-0.5 text-[10px] font-medium text-faint sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={refreshChainState}
          disabled={syncState === "syncing"}
          aria-label="Refresh chain state"
          className="hidden size-9 items-center justify-center rounded-lg border border-line bg-panel-muted text-muted hover:border-accent/40 hover:text-text disabled:opacity-50 sm:flex"
        >
          {syncState === "syncing" ? (
            <FootballSpinner className="size-4 text-accent" />
          ) : (
            <RefreshCw className="size-4" strokeWidth={1.75} />
          )}
        </button>
        <button
          type="button"
          onClick={runAgentCycle}
          disabled={cyclePending}
          className="hidden items-center gap-2 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-[0_0_18px_rgba(34,226,4,0.35)] hover:bg-accent-strong disabled:opacity-60 md:inline-flex"
        >
          {cyclePending ? (
            <FootballSpinner className="size-3.5" />
          ) : (
            <Play className="size-3.5" strokeWidth={2} />
          )}
          {cycleLabel}
        </button>
        <button
          type="button"
          onClick={runQuickLifecycleDemo}
          disabled={cyclePending}
          className="hidden items-center gap-2 rounded-full border border-line bg-transparent px-3 py-2 text-xs font-semibold text-muted hover:border-accent/50 hover:text-text disabled:opacity-60 xl:inline-flex"
        >
          <TimerReset className="size-3.5" strokeWidth={2} />
          Quick Demo
        </button>

        <ThemeToggle />

        <NotificationsDropdown />

        {connected ? (
          <div className="flex items-center gap-1">
            <span
              className={[
                "hidden items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold sm:inline-flex",
                walletOnXLayer
                  ? "border-success/40 bg-success-soft text-success"
                  : "border-danger/40 bg-danger-soft text-danger",
              ].join(" ")}
            >
              <span className={`size-1.5 rounded-full ${walletOnXLayer ? "bg-success" : "bg-danger"}`} />
              {walletOnXLayer ? "X Layer" : "Wrong network"}
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-panel py-1.5 pl-1.5 pr-2 text-sm text-text">
              <span className="flex size-6 items-center justify-center rounded-md bg-accent text-[11px] font-semibold text-accent-foreground">
                {walletAddress!.slice(2, 4).toUpperCase()}
              </span>
              <span className="hidden font-mono text-xs sm:inline">{shortAddr(walletAddress)}</span>
              <button
                type="button"
                onClick={disconnectWallet}
                aria-label="Disconnect wallet"
                className="ml-1 rounded p-1 text-faint hover:text-text"
              >
                <LogOut className="size-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={connectWallet}
            className="flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground hover:bg-accent-strong"
          >
            <Wallet className="size-4" strokeWidth={2} />
            <span className="hidden sm:inline">Connect</span>
          </button>
        )}
      </div>
    </header>
  );
}
