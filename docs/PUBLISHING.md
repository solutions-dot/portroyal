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

`dist/` is not committed (it is in `.gitignore`). The build needs only Node 18 or newer; Blender and Python are only for making new characters and animations, never for deploying.

### The menu's other pages

- `menu/about.html` is the "About this platform" page for teachers, students and parents. When a game is added or its sources change, update its section there ("The games and their sources", and the real and fictional people).
- `menu/site.js` holds two switches, both empty until the owner chooses them. `SUBSCRIBE_URL` is where the "Get updates" form sends the email (any service that accepts a plain form post: Buttondown, Mailchimp, Formspree, a Google Form; `SUBSCRIBE_FIELD` names its email box). While it is empty the form says sign-ups are not open yet and sends nothing. `CONTACT_EMAIL` shows a "tell us about a mistake" line on the About page; while empty the line is hidden.
- The sign-up form is for adults only (a tick box says so), keeps no data on the site, and has a hidden box that catches spam robots.

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
git -c user.name="M Squared" -c user.email="msquared.mail@gmail.com" commit -m "Short summary

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

Eventide is currently an unfinished local prototype. The public distribution deliberately excludes it; build it directly with `node tools/build.mjs eventide --dev` for development. Add it to the released distribution only after its story, title and required checks are complete.

For a testing build that includes Eventide Home, run `npm run dist:testing` and serve `dist-testing/`. It builds all five games with their test parameters and shows the Eventide prototype card in the menu. The ordinary `npm run dist` build still contains the four released games. While serving the repository, open `menu/?testing=1` to show the same testing card.

All four released games offer a **Teacher unlock** toggle in Chapters. The choice stays in that browser. The toggle changes access; selecting a chapter still advances the current story position normally. Eventide is an exploration prototype and does not yet have a chapter sequence.
