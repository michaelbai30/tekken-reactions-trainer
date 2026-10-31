# Tekken Reactions Trainer

A React browser app for practicing reacting to certain important moves on block in Tekken 8 using real match footage.

**Hosted at** https://tekken-reactions-trainer.vercel.app/

## What it trains
Many strong moves in Tekken 8 are slow enough to block on reaction, if you can recognize them. For example, Jin's D2 (Scourge) is a relatively low-risk, high-reward move that requires practice in order to be able to block consistently.
Being able to block such moves on reaction separates high level players from the rest.
The app separates **four** commonly seen moves into its own drill. Each drill plays a short clip of variable timing that ends in either the target move or a decoy. 
The goal is to block the real move before it hits, and hold still for everything else (no press).

Videos are recorded at 60 fps. 
Every press is graded as a block, late, missed, or false alarm. 
Real attacks also show your reaction time in frames. 
Stats and streaks are saved per drill.

| Drill | Input | Type | Startup | Difficulty | Decoys |
| --- | --- | --- | --- | --- | --- |
| Bryan – Snake Edge | df3 | low | i29 | Easy | b1, qcb3, f3, qcb4 |
| Jin – Scourge | d2 | Low | i22 | Medium | Can-Can, ff2, ff3, cd1 |
| Kazuya – Left Splits Kick | ff3 | Mid | i20 | Hard | Hellsweep |
| Feng – Swift Sweep Kick| ss4 | Low | i20 | Extreme | ss1+2, df3, uf4 |

**Controls:** click the video or press Space to start. Block with click, Space, S, or ↓. 
After the result, click or press Space to load the next clip. 
The **?** button explains each drill and plays an example.

## Stack

React · Vite · Vitest · oxlint · GitHub Actions CI. 
Clip timing uses `requestVideoFrameCallback`, and stats are stored in `localStorage`.

## Run locally

```bash
pnpm install
pnpm dev # start the dev server
pnpm test # run tests (optional)
pnpm lint # run linter (optional)
```
