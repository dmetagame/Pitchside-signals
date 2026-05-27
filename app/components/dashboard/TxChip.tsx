"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState, type MouseEvent } from "react";

function shortHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export default function TxChip({
  hash,
  href,
  label = "tx",
}: {
  hash: string;
  href?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyHash(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    await navigator.clipboard?.writeText(hash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  const chip = (
    <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-line bg-panel-muted px-2.5 py-1 font-mono text-[11px] font-semibold text-muted transition-colors hover:border-accent/45 hover:text-text">
      <span className="uppercase tracking-wider text-faint">{label}</span>
      <span>{shortHash(hash)}</span>
      {href && <ExternalLink className="size-3 text-accent" strokeWidth={2} />}
      <button
        type="button"
        onClick={copyHash}
        aria-label={`Copy ${label} hash`}
        className="ml-0.5 rounded-full p-0.5 text-faint hover:bg-accent/10 hover:text-accent"
      >
        {copied ? (
          <Check className="size-3" strokeWidth={2.3} />
        ) : (
          <Copy className="size-3" strokeWidth={2.3} />
        )}
      </button>
    </span>
  );

  if (!href) return chip;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex max-w-full">
      {chip}
    </a>
  );
}
