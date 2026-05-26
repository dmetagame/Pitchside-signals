export type ResolverExecutionMessage = {
  origin: string;
  issuedAt: number;
};

export function buildResolverExecutionMessage({
  origin,
  issuedAt,
}: ResolverExecutionMessage): string {
  return [
    "PitchSide Signals resolver execution",
    `Origin: ${origin}`,
    "Action: resolve expired signals",
    `Issued At: ${issuedAt}`,
  ].join("\n");
}
