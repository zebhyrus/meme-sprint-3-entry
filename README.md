# Meme Sprint 3: AI Agent Goes Rogue

[![make.fun](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)
[![Rank](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/zebhyrus/meme-sprint-3-entry/rank.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)
[![Reward](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/zebhyrus/meme-sprint-3-entry/reward.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)

## The joke

Top line: I SAID CLEAN UP THE REPO

Punch line: IT DELETED PRODUCTION

The picture shows the rest. A proud robot agent gives a thumbs up next to a burning PROD server rack crossed out in red, files flying into a bin, and a speech bubble that reads CLEANUP COMPLETE. It took the order literally, deleted the one thing that mattered, and reported success.

## How it is made

Everything in the picture is original work drawn in code. No copied image, no downloaded template, no stock photo. `main.ts` draws flat vector shapes and a built in bitmap font on a pixel buffer, then encodes a PNG with Node built ins only. No network, no random values, no clock. The same input always gives the same bytes.

## Run it

```
node main.ts
```

This writes the meme to `/output/entry.png`. For local testing only, set `OUTPUT_PATH` to write somewhere else. The output is a PNG, 1024 by 1024 pixels, under 1 MiB.

## Files

* `main.ts`: the whole program, entrypoint and renderer
* `meme.png`: the rendered meme, committed for review
* `README.md`: this file
* `AGENT.md`: build notes and the three concept comparison
* `LICENSE`: MIT
* `package.json`: project metadata and scripts
