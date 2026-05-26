import { readFileSync } from "node:fs";
import { createPublicClient, createWalletClient, http, parseAbi, type Address, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { xLayerChain } from "../app/lib/contract";

const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex | undefined;
const stakeToken = process.env.STAKE_TOKEN_ADDRESS as Address | undefined;

if (!privateKey) {
  throw new Error("Set DEPLOYER_PRIVATE_KEY to deploy PitchSide Signals on X Layer.");
}

if (!stakeToken) {
  throw new Error("Set STAKE_TOKEN_ADDRESS to the X Layer test token used for signal staking.");
}

const account = privateKeyToAccount(privateKey);
const resolver = (process.env.RESOLVER_ADDRESS ?? account.address) as Address;

const publicClient = createPublicClient({
  chain: xLayerChain,
  transport: http(),
});
const walletClient = createWalletClient({
  account,
  chain: xLayerChain,
  transport: http(),
});

const signalBondAbi = parseAbi(["constructor(address stakeToken_, address resolver_)"]);
const signalBondBytecode = readBytecode(
  "build/contracts/contracts_PitchSideSignals_sol_PitchSideSignals.bin",
);

console.log(`Deploying from ${account.address} on ${xLayerChain.name} (${xLayerChain.id})`);
console.log(`  stakeToken = ${stakeToken}`);
console.log(`  resolver   = ${resolver}`);

const signalBondHash = await walletClient.deployContract({
  abi: signalBondAbi,
  bytecode: signalBondBytecode,
  args: [stakeToken, resolver],
});
console.log(`PitchSideSignals tx: ${signalBondHash}`);
const signalBondReceipt = await publicClient.waitForTransactionReceipt({ hash: signalBondHash });
const signalBond = signalBondReceipt.contractAddress;
if (!signalBond) {
  throw new Error("PitchSideSignals deployment did not return a contract address.");
}

console.log(
  JSON.stringify(
    {
      deployer: account.address,
      chainId: xLayerChain.id,
      rpcConfigured: Boolean(process.env.XLAYER_RPC_URL),
      stakeToken,
      resolver,
      signalBond,
      vercelEnv: {
        NEXT_PUBLIC_STAKE_TOKEN_ADDRESS: stakeToken,
        NEXT_PUBLIC_PITCHSIDE_SIGNALS_ADDRESS: signalBond,
        NEXT_PUBLIC_XLAYER_CHAIN_ID: String(xLayerChain.id),
      },
    },
    null,
    2,
  ),
);

function readBytecode(path: string): Hex {
  return `0x${readFileSync(path, "utf8").trim()}`;
}
