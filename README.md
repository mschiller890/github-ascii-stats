# github-ascii-stats

Three ASCII-styled SVG "endpoints" for your GitHub contribution history,
served for free as static files on GitHub Pages:

- `docs/contribution-ascii.svg` — the year as a block-character heatmap
- `docs/streak.svg` — current streak + longest streak
- `docs/languages.svg` — top languages by bytes and by repo count

## Why this shape

GitHub Pages only serves static files — it can't run a script per request.
So instead of a live "endpoint", a GitHub Action runs on a schedule, calls
the GitHub API, regenerates the three SVGs, and commits them into `docs/`.
Pages then serves those files, and they update every few hours. This is the
same pattern used by most GitHub stats/streak card generators.

## Setup

1. **Create a repo** and push this project to it (branch `main`).

2. **Create a token** the Action can use to read your contribution data.
   The default `GITHUB_TOKEN` doesn't have the `read:user` scope needed for
   the `contributionsCollection` GraphQL query, so create a classic
   Personal Access Token:
   - GitHub → Settings → Developer settings → Personal access tokens →
     Tokens (classic) → Generate new token
   - Scope: `read:user` (that's all you need)
   - Copy the token

3. **Add it as a repo secret**:
   - Repo → Settings → Secrets and variables → Actions → New repository secret
   - Name: `GH_STATS_TOKEN`
   - Value: the token from step 2

4. **Enable GitHub Pages**:
   - Repo → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`, folder: `/docs`
   - Save

5. **Run it once manually** so `docs/` has files before Pages' first build:
   - Repo → Actions → "Update GitHub Stats" → Run workflow
   - Or generate locally: `GITHUB_TOKEN=xxx GH_USERNAME=you node scripts/index.mjs`
     and commit the resulting `docs/*.svg` files.

Pages will then serve them at:

```
https://<your-username>.github.io/<repo-name>/contribution-ascii.svg
https://<your-username>.github.io/<repo-name>/streak.svg
https://<your-username>.github.io/<repo-name>/languages.svg
```

Embed anywhere that renders images, e.g. your profile README:

```md
![contributions](https://<your-username>.github.io/<repo-name>/contribution-ascii.svg)
![streak](https://<your-username>.github.io/<repo-name>/streak.svg)
![languages](https://<your-username>.github.io/<repo-name>/languages.svg)
```

## Customizing

- **Density symbols / colors**: edit `SYMBOLS` and `COLORS` in
  `scripts/svg-calendar.mjs`.
- **Refresh frequency**: edit the `cron` schedule in
  `.github/workflows/update-stats.yml`.
- **Which repos count toward languages**: `buildLanguageStats` in
  `scripts/index.mjs` currently uses all non-fork repos owned by the user;
  filter further there if you want to exclude specific repositories.
- **Card size/fonts**: each `scripts/svg-*.mjs` file is a small, self
  contained SVG template — tweak freely.

## Local development

```bash
npm install   # no dependencies to install, just sets things up
GITHUB_TOKEN=ghp_xxx GH_USERNAME=yourname node scripts/index.mjs
open docs/contribution-ascii.svg
```
