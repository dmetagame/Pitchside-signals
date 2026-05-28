import type { Address, Hex } from "viem";

export const xLayerExplorerBaseUrl =
  process.env.NEXT_PUBLIC_XLAYER_EXPLORER ??
  "https://www.okx.com/web3/explorer/xlayer";

export function xLayerTxUrl(hash: Hex): string {
  return `${xLayerExplorerBaseUrl}/tx/${hash}`;
}

export function xLayerAddressUrl(address: Address): string {
  return `${xLayerExplorerBaseUrl}/address/${address}`;
}
