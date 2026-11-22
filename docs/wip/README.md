# Unfinished work, saved as patches (22 November 2026)

The owner paused these three jobs at 80% usage. Each helper was stopped part way. Its edits are kept here as a patch, and the game itself is back at its last passing state (every audit 0), so nothing broken is published.

| Patch | What it was doing | State when stopped |
|---|---|---|
| `hutchinson-unfinished-20261122.patch` | Spanish Town turned to match Long's 1774 plate (King's House on the west side), steeper wooded cockpit hills | plays to the end; audit failed: castle 9, road 4 |
| `rose-hall-unfinished-20261122.patch` | Rosa Palmer's monument modelled on its photographs, the archives date, "G.H. Attendant", timing | plays to the end; audit failed: archive 1 |
| `shark-papers-unfinished-20261122.patch` | the 1970 source tried again, real stone paving on the quay, timing | plays to the end; audits 0 |

The content lint also listed 3 new journal facts without a source across these patches.

To carry on with one: `git apply docs/wip/<game>-unfinished-20261122.patch`, then fix what `?test=audit` and `node tools/lint_content.mjs --ci` report, run the checks in `docs/TESTING.md`, and delete the patch once it is in.
