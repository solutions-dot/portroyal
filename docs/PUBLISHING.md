# Publishing and code

## Where things live

- **Code**: GitHub `solutions-dot/portroyal`. `main` is the released state. Work on a branch, open a PR, and merge when the owner asks.
- **Live Port Royal game**: a claude.ai artifact, slug `2869be7e-61df-45c3-a18e-bd4f53a9798e` (title "Port Royal 1690", private to the owner until they share it).
- **Teacher guide**: a claude.ai doc, id `0b724c26-247a-4a67-9ae3-03b53ba6507d`. It covers the 6 chapters, Henry Morgan facts and classroom questions. Update it when chapters or facts change.

## The website on Vercel

The whole collection (the menu and every game) is one static website, built by `tools/dist.mjs` into `dist/`:

```
dist/index.html               the menu (home page)
dist/menu/index.html          the same menu, so the games' "Main Menu" button (../../../menu/) works everywhere
dist/games/<game>/site/...    each game: index.html, app.js, models/*.js
```

`vercel.json` tells Vercel what to do, so there is nothing to set by hand:
- install: `npm install`; build: `npm run dist`; output folder: `dist`;
- `git.deploymentEnabled.main` stays `true`, so every merge to `main` creates the production deployment;
- `/port-royal` redirects to the game;
- models are cached for a year (`immutable`), which is safe because the game asks for each one as `models/<name>.js?v=<fingerprint>`: a changed model has a new address. `app.js` is always checked for a newer copy, so a new build is picked up at once.

To set it up once:
1. In Vercel, "Add New Project" and import the GitHub repo `solutions-dot/portroyal`.
2. Leave Framework Preset as "Other". Vercel reads the build settings from `vercel.json`.
3. Deploy. Every push to `main` then redeploys the live site, and every PR gets its own preview link.

Check a deploy build on your machine first:

```bash
npm run dist            # builds every game (public, no test code) into dist/
npm run serve:dist      # http://localhost:8766/
```

`dist/` is not committed (it is in `.gitignore`). The build needs Node 20 or newer; Blender and Python are only for making new characters and animations, never for deploying.

### The menu's other pages

- `menu/about.html` is the "About this platform" page for teachers, students and parents. When a game is added or its sources change, update its section there ("The games and their sources", and the real and fictional people).
- The newsletter forms on the menu and About page and the contact form on the menu save to the private PastPort dashboard. The correction email link on the About page still opens the visitor's mail app.

### Search engines

Public builds (`npm run dist`) run `tools/seo.mjs`. From the menu cards it gives each game page a title, a description, a canonical link, Open Graph and Twitter preview tags with the card's picture, schema.org `VideoGame` and breadcrumb data, and a short `<noscript>` text; the menu gets `WebSite`, `Organization` and an `ItemList` of the games; `/menu/` and `/menu/about.html` point to `/` and `/about`. It writes `robots.txt` (keeps `/admin/` and `/api/` out) and `sitemap.xml`. A game folder with no menu card is marked `noindex`. The address comes from `PASTPORT_SITE_URL` (set it to the custom domain, for example `https://pastport.example`), else Vercel's production domain. To show up on Google: add the domain in Google Search Console, verify it (DNS record, or set `GOOGLE_SITE_VERIFICATION` to the code from the HTML tag method and redeploy), then submit `/sitemap.xml`.

### PastPort dashboard

The hosted site serves the dashboard at `/admin/`. It has playtest reports, game availability and profile settings, newsletter sign-ups, and contact messages. The newsletter list, full contact messages, and deduplicated contact email addresses each have a CSV export. Sign-ups are collected for later sending. PastPort does not send newsletters or contact notifications by email.

Set up production on Vercel before sharing the public game link:

1. In the project's **Storage** tab, create a dedicated **Private** Blob store and connect it to the project. Set its environment variable prefix to `PASTPORT_`, so the project gets `PASTPORT_BLOB_READ_WRITE_TOKEN`. If Vercel connects it as `BLOB_READ_WRITE_TOKEN`, set `PASTPORT_BLOB_READ_WRITE_TOKEN` to the dedicated store's token in **Settings → Environment Variables**.
2. Set `PASTPORT_ADMIN_PASSWORD` as a sensitive production variable. Use a long, randomly generated ASCII password and keep it in your password manager.
3. Redeploy after changing the variables. Sign in at `/admin/`, send a test contact message, and submit a test newsletter address. Check that both arrive and download their CSVs. Open the ordinary game link, play a minute, return to the menu, and check that the visit appears under Overview and Sessions.
4. Keep preview and development environments separate from the production store if enabling this feature there.

Game controls apply to new page loads, including direct game links. New visitors start in Teens and adults unless the dashboard default is changed to Kids. The Teens and adults profile shows Mature 13+ cards. Visitors still go through the age prompt before opening a mature story unless they previously selected the Teens and adults profile through that prompt. A saved profile choice takes precedence over the default. The host builds the game list from the menu cards.

Play analytics start automatically on the hosted menu and game pages, for every visitor, with no tester links (owner, 26 November 2026: "I want everyone to just play the game"). The menu footer and About footer let a visitor turn analytics off or on for this browser (not the games' opening screens: owner, 27 November 2026; a game honours the choice), and a previous decline is respected. Embedded games do not report visits. `engine/playtest.js` sends one record per page open, at the start, when the goal changes, when the screen turns, when a problem happens, every 30 seconds and when the page closes. A record holds:

- **Who, without a name:** a random tab id (one session) and a random browser id kept in localStorage with its first-seen time and page-open count (players, new and returning). City and country come from Vercel's request headers. No IP address, name, email, birth year, GPS position or story choice is stored.
- **Play:** the game, active seconds (visible play, up to 90 seconds after the last touch or key), the chapter and step, each chapter reached with the active time it took, the last screen and how the page was left.
- **Device:** phone, tablet or desktop; system and version; browser and version; screen and window size; pixel ratio; touch; graphics chip; memory and cores where the browser tells; connection type; language; the site that linked here; orientation at the start and at the end, and how often the screen turned.
- **Speed:** milliseconds until Start can be pressed, average and slowest-10% frame rate while playing, and the longest stall.
- **Problems:** script errors and unhandled rejections with the message and file:line:column, assets that failed to load, lost 3D views, stalls over 4 seconds, and startup or chapter load failures, each with the chapter, step and orientation.

The dashboard at `/admin/` reads one day at a time through `?action=admin&kind=day` (`api/pastport.mjs`). A day that can no longer change (two days after it ends) is saved as one file, `pastport/daily/<day>.json`, so later reports read one file per day. Tabs: **Overview** (players, starts, play time, problem-free sittings and frame rate, each against the period before; players and starts by day; hour of day; top games, countries and devices), **Games** (a sortable table, then for one game how far players get, where they stop, time to each chapter and starts by day), **Players** (new and returning, countries, cities, referrers, languages, games and time per player), **Devices** (type, system, browser, orientation, screen turns, window size, graphics chip, memory, connection, and speed by device), **Crashes and speed** (grouped problems with message, code location, game, chapter, devices, browsers and builds; slow sittings) and **Sessions** (search, then everything one tab did). Filters for period (1, 7, 30 or 90 days), end date, game, device and country apply to every report. Export CSV writes every field of the filtered records. "Playing now" counts tabs heard from in the last two and a half minutes.

The dashboard uses a dedicated store with separate prefixes for visits, daily reports, settings, sign-ups and messages. For a removal request, delete the relevant entry from that private store. Manage newsletter sends and opt-outs in the service you import the CSV into.

## Publishing a game to its artifact

1. Build the public version: `node tools/build.mjs port-royal` (no `--dev`).
2. Copy the files to a folder under your home directory. The artifact tool refuses files under `/tmp`. For example, copy into `~/port-royal-game/` with `app.js`, `index.html` and `models/<changed>.js`.
3. Call the artifact `publish_files` tool:
   - `slug` and `base_version`: get the current version from `get_artifact` or `list_files`;
   - list only the changed files;
   - unlisted files stay as they are.
4. Each model is its own file, `models/<name>.js`. The shared animation library is `models/anims.js`, copied in by the build.

A new game gets its own artifact: create it with `publish_files` without a slug (`index.html` is required), then record the slug here.

## Git

```bash
git checkout -b my-change
git add -A
git -c user.name="Johnathon Kelly" -c user.email="msquared.mail@gmail.com" commit -m "Short summary

What changed and why, in plain words.

<attribution trailer the session provides>"
git push -u origin my-change
gh api repos/solutions-dot/portroyal/pulls -f title="..." -f head=my-change -f base=main -F body=@body.md
```

- An automated reviewer (Codex) reviews new PRs.
  - Verify each finding before acting on it.
  - A real bug gets fixed.
  - A finding marked minor (P2, yellow) is answered on its thread, and the fix goes in the next push.
- Merge with `gh api -X PUT repos/solutions-dot/portroyal/pulls/<n>/merge -f merge_method=merge`, only when the owner asks.

Large binaries in the repo: `shared/anim-sources/*.fbx` (about 38 MB), the source `.glb` files in `games/*/assets/`, and the packed models in `games/*/site/models/`.

The menu lists every game in `games/` whose folder does not start with an underscore: Port Royal, Marcus Garvey, Kendal 1957, The Tube (Bog Walk), Nanny Town, Eventide Home, Hurricane Melissa and Tivoli. The owner put Eventide, Melissa and Tivoli on the menu on 14 November 2026, while they are still being finished (Tivoli's card says "Early version").

For a testing build, run `npm run dist:testing` and serve `dist-testing/`. It builds every game with its test parameters available.

All four released games offer a **Teacher unlock** toggle in Chapters. The choice stays in that browser. The toggle changes access; selecting a chapter still advances the current story position normally. Eventide is an exploration prototype and does not yet have a chapter sequence.

## Caches: a phone must never keep an old build (17 November 2026)

The owner played an old build on a phone after a new one was live. Three things now stop that, all in `tools/dist.mjs` and `vercel.json`, for the menu and every game at once:

1. **A build id.** Each `npm run dist` makes an id (the commit and the time), writes it to `dist/version.json` and into every page as `window.__BUILD`.
2. **The game code is asked for by that id**: `<script src="app.js?v=<id>">`. A new build has a new address, so no cache can hand back an old copy. (Models already work this way.)
3. **The page checks for a newer build** (`engine/freshen.js`, put into each page by the build): when it loads, when you come back to it after 20 seconds away, and when the browser brings it back from its back-and-forward store. If `/version.json` has a different id, the page loads itself again, once for each new build. A game saves your place as you play, so nothing is lost.

`vercel.json` serves `/version.json` with `no-store` and the pages with `max-age=0, must-revalidate`.

To check what is live: `curl https://<site>/version.json` shows the build id; its first ten characters are the commit on `main`.

## Build minutes on Vercel (19 November 2026)

To save build minutes, Vercel builds only what reaches players:
- `vercel.json` `git.deploymentEnabled` turns off builds for work branches (`claude/**`, `review/**`, `fix/**`, `feature/**`). Only `main` builds. Merge a pull request to publish.
- `vercel.json` `ignoreCommand` runs `tools/vercel-ignore.sh`: on `main`, a push that changes nothing the site is built from (only docs, tests, or tools the site does not use) is skipped. When it cannot tell, it builds.
- `installCommand` is `npm ci` (installs exactly the lockfile; Vercel caches the packages between builds).
- In the Vercel dashboard (Settings, Build and Deployment): build machine Elastic or Standard (not Enhanced or Turbo, which bill more), On-Demand Concurrent Builds set to "Run up to one build per branch" (a burst of pushes builds only the latest), and keep "Use existing Build Cache" ticked when redeploying.
- A whole build takes about 10 seconds on a computer (`npm run dist`); most of a Vercel build's time is the clone, the install and the upload.
