import { Bar } from "recharts";

type GlowBarProps = {
  glowFilterId: string;
  [key: string]: any;
};

/**
 * Recharts <Bar> wrapper that applies an SVG filter for the soft mint
 * halo. Typed loosely because Recharts pass-through SVG attribute types
 * conflict with its class-component ref typing.
 */
export default function GlowBar({ glowFilterId, ...props }: GlowBarProps) {
  return (
    <Bar
      isAnimationActive={false}
      {...(props as any)}
      filter={`url(#${glowFilterId})`}
    />
  );
}
