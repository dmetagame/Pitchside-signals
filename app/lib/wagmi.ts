import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { xLayerChain } from "./contract";

export const signalBondWagmiConfig = createConfig({
  chains: [xLayerChain],
  connectors: [injected()],
  transports: {
    [xLayerChain.id]: http(xLayerChain.rpcUrls.default.http[0]),
  },
});
