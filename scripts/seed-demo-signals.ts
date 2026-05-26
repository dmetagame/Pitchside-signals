import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  parseAbi,
  parseUnits,
  stringToHex,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { xLayerChain } from "../app/lib/contract";

const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex | undefined;
const signalBond = (
  process.env.PITCHSIDE_SIGNALS_ADDRESS ??
  process.env.SIGNALBOND_ADDRESS ??
  process.env.NEXT_PUBLIC_PITCHSIDE_SIGNALS_ADDRESS ??
  process.env.NEXT_PUBLIC_SIGNALBOND_ADDRESS
) as Address | undefined;
const stakeToken = process.env.STAKE_TOKEN_ADDRESS as Address | undefined;

if (!privateKey || !signalBond || !stakeToken) {
  throw new Error("Set DEPLOYER_PRIVATE_KEY, PITCHSIDE_SIGNALS_ADDRESS, and STAKE_TOKEN_ADDRESS.");
}

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  chain: xLayerChain,
  transport: http(),
});
const walletClient = createWalletClient({
  account,
  chain: xLayerChain,
  transport: http(),
});

const erc20Abi = parseAbi([
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
]);

const signalBondAbi = parseAbi([
  "function createSignal(bytes32 agentId,string market,uint8 direction,uint16 confidenceBps,uint256 stakeAmount,uint64 expiresAt,uint256 entryPriceE8,uint256 targetPriceE8,bytes32 sourceDataHash,bytes32 explanationHash) returns (uint256)",
  "function nextSignalId() view returns (uint256)",
]);

const now = Math.floor(Date.now() / 1000);
const scenarios = [
  {
    agentId: "pitch-oracle",
    market: "Brazil wins simulated opener",
    direction: 2,
    confidenceBps: 6200,
    stakeUsdc: "2",
    entryPrice: 0.58,
    targetPrice: 0.71,
    expiresInSeconds: 3 * 60 * 60,
    thesis: "Brazil projects better late-game control and squad depth than the crowd price implies.",
  },
  {
    agentId: "crowd-xi",
    market: "Japan tops Group F",
    direction: 2,
    confidenceBps: 5900,
    stakeUsdc: "2",
    entryPrice: 0.31,
    targetPrice: 0.46,
    expiresInSeconds: 2 * 60 * 60,
    thesis: "Fan flow and transition metrics are moving faster than public odds.",
  },
  {
    agentId: "bracket-quant",
    market: "Argentina reaches semi-final",
    direction: 2,
    confidenceBps: 6400,
    stakeUsdc: "2",
    entryPrice: 0.44,
    targetPrice: 0.58,
    expiresInSeconds: 90 * 60,
    thesis: "The bracket simulator gives Argentina a cleaner route than the market line implies.",
  },
] as const;

const totalStake = scenarios.reduce(
  (sum, scenario) => sum + parseUnits(scenario.stakeUsdc, 6),
  0n,
);

const balance = await publicClient.readContract({
  address: stakeToken,
  abi: erc20Abi,
  functionName: "balanceOf",
  args: [account.address],
});
if (balance < totalStake) {
  throw new Error(`Insufficient stake-token balance to seed ${scenarios.length} signals.`);
}

const allowance = await publicClient.readContract({
  address: stakeToken,
  abi: erc20Abi,
  functionName: "allowance",
  args: [account.address, signalBond],
});
if (allowance < totalStake) {
  const approveHash = await walletClient.writeContract({
    address: stakeToken,
    abi: erc20Abi,
    functionName: "approve",
    args: [signalBond, totalStake],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });
  if (receipt.status === "reverted") {
    throw new Error("Stake-token approval reverted.");
  }
}

const txs: Hex[] = [];
for (const [index, scenario] of scenarios.entries()) {
  const sourcePayload = JSON.stringify({
    seed: "pitchside-demo-seed-v1",
    index,
    ...scenario,
  });
  const hash = await walletClient.writeContract({
    address: signalBond,
    abi: signalBondAbi,
    functionName: "createSignal",
    args: [
      agentHash(scenario.agentId),
      scenario.market,
      scenario.direction,
      scenario.confidenceBps,
      parseUnits(scenario.stakeUsdc, 6),
      BigInt(now + scenario.expiresInSeconds),
      priceToUnits(scenario.entryPrice),
      priceToUnits(scenario.targetPrice),
      keccak256(stringToHex(sourcePayload)),
      keccak256(stringToHex(scenario.thesis)),
    ],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status === "reverted") {
    throw new Error(`Seed signal ${index + 1} reverted.`);
  }
  txs.push(hash);
}

const nextSignalId = await publicClient.readContract({
  address: signalBond,
  abi: signalBondAbi,
  functionName: "nextSignalId",
});

console.log(
  JSON.stringify(
    {
      pitchSideSignals: signalBond,
      seeded: txs.length,
      nextSignalId: nextSignalId.toString(),
      txs,
    },
    null,
    2,
  ),
);

function agentHash(agentId: string): Hex {
  return keccak256(stringToHex(agentId));
}

function priceToUnits(value: number): bigint {
  return parseUnits(value.toFixed(8), 8);
}
