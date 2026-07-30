const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export const USERNAME = process.env.GH_USERNAME || process.env.GITHUB_REPOSITORY_OWNER;

if (!GITHUB_TOKEN) {
  console.error("Missing GITHUB_TOKEN env var. Set a repo secret (PAT with read:user scope) and pass it in.");
  process.exit(1);
}
if (!USERNAME) {
  console.error("Missing GH_USERNAME env var.");
  process.exit(1);
}

async function gql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function rest(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

/** Full-year contribution calendar (weeks -> days, with counts). */
export async function fetchContributionCalendar(login) {
  const to = new Date();
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - 364);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                weekday
                contributionCount
              }
            }
          }
        }
      }
    }`;

  const data = await gql(query, {
    login,
    from: from.toISOString(),
    to: to.toISOString(),
  });
  return data.user.contributionsCollection.contributionCalendar;
}

/** All non-fork, owned repos for a user. */
export async function fetchOwnedRepos(login) {
  let page = 1;
  const all = [];
  while (true) {
    const repos = await rest(`/users/${login}/repos?per_page=100&page=${page}&type=owner`);
    if (!repos.length) break;
    all.push(...repos.filter((r) => !r.fork));
    if (repos.length < 100) break;
    page++;
  }
  return all;
}

/** Byte count per language for a single repo. */
export async function fetchRepoLanguages(login, repoName) {
  return rest(`/repos/${login}/${repoName}/languages`);
}
