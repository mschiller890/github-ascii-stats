import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { USERNAME, fetchContributionCalendar, fetchOwnedRepos, fetchRepoLanguages } from "./github.mjs";
import { computeStreaks } from "./streak.mjs";
import { renderCalendarSvg } from "./svg-calendar.mjs";
import { renderStreakSvg } from "./svg-streak.mjs";
import { renderLanguagesSvg } from "./svg-languages.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "docs");

async function buildLanguageStats(login) {
  const repos = await fetchOwnedRepos(login);

  const byBytes = {};
  const byRepos = {};

  // Rate-limit friendly: sequential with small concurrency window.
  const CONCURRENCY = 5;
  for (let i = 0; i < repos.length; i += CONCURRENCY) {
    const batch = repos.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((r) => fetchRepoLanguages(login, r.name).catch(() => ({})))
    );
    batch.forEach((repo, idx) => {
      const langs = results[idx];
      for (const [lang, bytes] of Object.entries(langs)) {
        byBytes[lang] = (byBytes[lang] || 0) + bytes;
      }
      if (repo.language) {
        byRepos[repo.language] = (byRepos[repo.language] || 0) + 1;
      }
    });
  }

  return { byBytes, byRepos };
}

async function main() {
  console.log(`Generating stats for ${USERNAME}...`);
  await mkdir(OUT_DIR, { recursive: true });

  const calendar = await fetchContributionCalendar(USERNAME);
  const stats = computeStreaks(calendar);
  const { byBytes, byRepos } = await buildLanguageStats(USERNAME);

  const calendarSvg = renderCalendarSvg({ calendar, stats });
  const streakSvg = renderStreakSvg({ stats });
  const languagesSvg = renderLanguagesSvg({ byBytes, byRepos });

  await writeFile(path.join(OUT_DIR, "contribution-ascii.svg"), calendarSvg, "utf8");
  await writeFile(path.join(OUT_DIR, "streak.svg"), streakSvg, "utf8");
  await writeFile(path.join(OUT_DIR, "languages.svg"), languagesSvg, "utf8");

  console.log("Done. Wrote docs/contribution-ascii.svg, docs/streak.svg, docs/languages.svg");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
