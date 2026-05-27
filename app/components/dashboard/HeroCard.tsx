import Card from "./Card";
import HeroIllustration from "./HeroIllustration";

export default function HeroCard() {
  return (
    <Card variant="hero" className="relative overflow-hidden md:p-7">
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-text md:text-[28px] md:leading-tight">
            <span className="text-accent">Stake</span> your call.
            {" "}Earn your <span className="text-accent">reputation</span>.
          </h1>
          <p className="mt-2 text-sm text-muted md:text-[15px]">
            World Cup forecasting signals settled onchain on X Layer.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent shadow-[0_0_18px_rgba(34,226,4,0.22)]">
              <span className="size-1.5 rounded-full bg-accent" />
              Matchday live
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
              X Layer testnet
            </span>
          </div>
        </div>

        <div className="relative h-32 w-full max-w-[340px] shrink-0 self-end md:h-40 md:self-auto">
          <HeroIllustration className="absolute inset-0" />
        </div>
      </div>
    </Card>
  );
}
