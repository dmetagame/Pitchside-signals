import { Line } from "recharts";

type GlowLineProps = {
  glowFilterId: string;
  [key: string]: any;
};

/**
 * Recharts <Line> wrapper that applies an SVG filter for the soft mint
 * halo. Typed loosely because Recharts pass-through SVG attribute types
 * conflict with its class-component ref typing — there's no clean
 * intersection that the compiler accepts.
 */
export default function GlowLine({ glowFilterId, ...props }: GlowLineProps) {
  return (
    <Line
      type="monotone"
      dot={false}
      activeDot={{ r: 4, strokeWidth: 2, fill: "var(--panel-bg)" }}
      isAnimationActive={false}
      {...(props as any)}
      filter={`url(#${glowFilterId})`}
    />
  );
}
