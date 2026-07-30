const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function computeStreaks(calendar) {
  const days = calendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Longest streak anywhere in range
  let longest = 0, longestStart = null, longestEnd = null;
  let run = 0, runStart = null;
  for (const day of days) {
    if (day.contributionCount > 0) {
      if (run === 0) runStart = day.date;
      run++;
      if (run > longest) {
        longest = run;
        longestStart = runStart;
        longestEnd = day.date;
      }
    } else {
      run = 0;
    }
  }

  // Current streak: walk backward from the most recent day.
  // Today is allowed to have 0 contributions without breaking the streak
  // (the day isn't "over" yet), everything before that must be unbroken.
  let current = 0, currentStart = null, currentEnd = null;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    const isMostRecentDay = i === days.length - 1;
    if (day.contributionCount > 0) {
      current++;
      if (!currentEnd) currentEnd = day.date;
      currentStart = day.date;
    } else if (isMostRecentDay) {
      continue;
    } else {
      break;
    }
  }

  const totalActiveDays = days.filter((d) => d.contributionCount > 0).length;

  return {
    totalDays: days.length,
    totalActiveDays,
    totalContributions: calendar.totalContributions,
    current: { length: current, start: currentStart, end: currentEnd },
    longest: { length: longest, start: longestStart, end: longestEnd },
  };
}
