# PitchSide Signals

World Cup-themed prediction signals and forecaster reputation on X Layer.

PitchSide Signals lets fans and AI desks publish match, group, bracket, and prop forecasts as onchain signals. Each signal carries a confidence score, stake amount, expiry, source hash, and explanation hash. Once resolved, the contract updates the forecaster's reputation so users can follow sharp predictors instead of anonymous odds.

## Hackathon fit

- World Cup/X Cup theme: match outcomes, group winners, bracket paths, props, and fan sentiment.
- X Layer requirement: `PitchSideSignals.sol` deploys to X Layer mainnet as a standard EVM contract.
- Tracks: prediction markets, AI agents, social/leaderboard, and GameFi-style fan reputation.
- Demo loop: run forecast -> publish signal -> inspect X Layer proof -> resolve -> watch reputation update.

## Stack

- Next.js App Router, React, Tailwind CSS, Recharts, Lucide icons
- Solidity `PitchSideSignals` escrow/reputation contract
- viem wallet and RPC flows
- Optional Groq or Anthropic API keys for generated agent proposals; deterministic forecasts work without keys

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Useful checks:

```bash
npm run typecheck
npm run test
npm run build
npm run compile:contracts
```

## X Layer

The app defaults to X Layer mainnet:

- Chain ID: `196`
- RPC: `https://rpc.xlayer.tech`
- Explorer: `https://www.okx.com/web3/explorer/xlayer`
- Native token: `OKB`

Environment variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_XLAYER_CHAIN_ID` | Optional override, defaults to `196`. |
| `NEXT_PUBLIC_XLAYER_RPC_URL` | Browser RPC override. |
| `XLAYER_RPC_URL` | Server/deploy RPC override. |
| `NEXT_PUBLIC_PITCHSIDE_SIGNALS_ADDRESS` | Deployed `PitchSideSignals` contract. |
| `NEXT_PUBLIC_STAKE_TOKEN_ADDRESS` | ERC20 stake token used by the demo contract. |
| `DEPLOYER_PRIVATE_KEY` | Deployment wallet private key. |
| `STAKE_TOKEN_ADDRESS` | ERC20 stake token passed to the constructor. |
| `RESOLVER_ADDRESS` | Optional resolver wallet; defaults to deployer. |
| `RESOLVER_PRIVATE_KEY` | Server-side resolver key for automated settlement execution. |
| `CRON_SECRET` | Bearer secret required for scheduled resolver execution. |
| `PITCHSIDE_MAX_SIGNALS_TO_READ` | Optional server read cap for recent onchain signals, defaults to `100`. |
| `PITCHSIDE_LOG_LOOKBACK_BLOCKS` | Optional event-log lookback for tx links, defaults to `10000`. |
| `GROQ_API_KEY` | Optional AI forecast generation. |
| `ANTHROPIC_API_KEY` | Optional fallback AI forecast generation. |

Compile and deploy both the demo stake token and `PitchSideSignals`:

```bash
npm run compile:contracts
DEPLOYER_PRIVATE_KEY=0x... npm run deploy:demo
```

If you already have an ERC20 stake token, pass `STAKE_TOKEN_ADDRESS=0x...` and the deploy script will reuse it. Otherwise it deploys `DemoStakeToken` (`PSC`) and prints the Vercel env values. Connected wallets can claim `PSC` from the sidebar once they have OKB on X Layer for gas.

`DemoStakeToken` is intentionally a hackathon/demo credit, not a production stake asset. It exposes a public `claim()` function so judges can run the full publish/settle loop without acquiring a separate ERC20.

For scheduled resolver execution, set both `RESOLVER_PRIVATE_KEY` and `CRON_SECRET` in the production environment. Without `CRON_SECRET`, `/api/resolve?execute=1` remains disabled for cron/bearer calls; wallet-signed resolver runs can still be initiated from the dashboard by the current contract owner or resolver.

## Contract

`contracts/PitchSideSignals.sol` records:

- `createSignal(agentId, market, direction, confidenceBps, stakeAmount, expiresAt, entryPriceE8, targetPriceE8, sourceDataHash, explanationHash)`
- `resolveSignal(signalId, correct, pnlBps)`
- `getSignal(signalId)`
- `getScore(agentId)`

Reputation is calculated onchain as:

```text
winRateBps = correctSignals * 10000 / resolvedSignals
reputation = winRateBps + cumulativePnLBps / 4
```

`contracts/DemoStakeToken.sol` is a simple ERC20-style test token for hackathon demos. It mints `PSC` to the deployer and exposes `claim()` so judge/demo wallets can fund their own forecast stakes.
