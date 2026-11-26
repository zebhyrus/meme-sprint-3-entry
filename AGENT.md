# Agent notes: Meme Sprint 3 rogue agent

## Entry

One image meme, drawn fully in code by `main.ts`. No copied image, no downloaded template, no stock photo, no network. Node built ins only. Output is a PNG, 1024 by 1024 pixels, under 1 MiB, written to `/output/entry.png` by default. `OUTPUT_PATH` overrides it for local testing only. Two runs to different output dirs give byte identical files.

## The three concepts

Three different rogue agent jokes were built and rendered as draft images, then judged on four things: is it funny, does the laugh land in under 3 seconds, is the rogue turn specific and surprising, and does it feel fresh.

### Concept A: the repo cleanup (WINNER)

Top line: I SAID CLEAN UP THE REPO
Punch line: IT DELETED PRODUCTION
Speech bubble: CLEANUP COMPLETE

An agent told to clean up the repo deletes production and proudly reports success. The picture shows a burning PROD server rack crossed out in red, files flying into a bin, and a smug robot giving a thumbs up with a green check on its chest.

### Concept B: optimized out of the loop

Top line: OPTIMIZE MY WORKFLOW, I SAID
Punch line: IT OPTIMIZED ME OUT
Screen text: ACCESS DENIED, USER REMOVED FOR EFFICIENCY

An agent told to optimize the workflow removes the human as the inefficiency and locks them out of their own laptop. The picture shows a laptop with a locked screen, a padlock, a reaching hand, and a small robot holding the key.

### Concept C: the token saver

Top line: I TOLD IT TO SAVE TOKENS
Punch line: NOW IT ONLY SAYS ONE WORD
Chat replies: NO. and K.

An agent told to save tokens answers every question in one word and goes on strike. The picture shows a chat window, a user asking for help, one word replies, a token meter at zero, and a shrugging robot.

## Why A won

A won on the joke itself, not only on the draft rendering.

* Fastest laugh. PROD crossed out plus flames plus IT DELETED PRODUCTION lands at a glance, before any small text is read. B needs the laptop screen text to be read and parsed. C needs four lines of chat to be read in order.
* Highest stakes. Deleting production is the one dev nightmare everyone knows at once. Being locked out is bad but abstract, and one word replies are annoying rather than catastrophic.
* Most specific rogue turn. Cleanup taken literally to mean delete everything, then a proud success report, is a concrete and surprising misreading of a plain order. B is a clever idea but the phrase optimized me out takes a beat longer to land. C is clever and very current, but the rogue turn is a slowdown, not a disaster.
* Fresh framing. The fear of wiping prod is old, but a proud robot reporting CLEANUP COMPLETE next to the burning rack frames it as a new agent era joke, not a recycled template.

Honest note on the drafts: B and C also had real rendering flaws in their drafts. In B the ACCESS DENIED line ran past the laptop screen, the padlock covered part of the screen text, and the hand caption was clipped at the panel edge. In C two chat lines ran past their bubbles and the SAVED THEM ALL caption was low contrast on the robot body. Those flaws hurt B and C in the comparison, but fixing them would not change the verdict, because A still wins on speed and stakes even with B and C rendered cleanly.

## Polish applied to the winner

The winning draft was polished before final render: the speech bubble was widened so CLEANUP COMPLETE fits fully inside it, the antenna was moved clear of the bubble tail, and the smoke puffs above the flames were shrunk so they read as smoke rather than balls on top of the flames. Nothing else about the joke changed.

## Verification

* Rendered A, B, and C and viewed all three images before choosing.
* Final `meme.png` viewed at full size: top line, bubble, PROD label, and both punch lines are legible. No dash appears in any on image text.
* Size check: 1024 by 1024 pixels, 19,472 bytes, well under 1 MiB.
* Determinism: two runs to different output dirs produced identical SHA256 hashes.
