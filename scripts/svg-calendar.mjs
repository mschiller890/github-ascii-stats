const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const SYMBOLS = ["  ", "::", "++", "##", "@@"];
const COLORS = ["#1c1f1a", "#2f5d3a", "#3f8a4d", "#5cc266", "#8dfb8f"];

function levelFor(count, max) {
  if (count === 0) return 0;
  if (max <= 4) return Math.min(count, 4);
  const q = max / 4;
  if (count <= q) return 1;
  if (count <= q * 2) return 2;
  if (count <= q * 3) return 3;
  return 4;
}

export function renderCalendarSvg({ calendar, stats }) {
  const weeks = calendar.weeks;
  const maxCount = Math.max(1, ...weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)));

  const cellH = 20;
  const padLeft = 35;
  const padTop = 64;
  const cellW = Math.min(14, Math.floor((620 - padLeft - 25) / weeks.length));
  const width = 620;
  const height = padTop + 7 * cellH + 60;

  let cells = "";
  let monthLabels = "";
  let lastMonth = -1;

  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays.find((d) => d.contributionCount >= 0);
    if (firstDay) {
      const m = new Date(firstDay.date + "T00:00:00Z").getUTCMonth();
      if (m !== lastMonth) {
        monthLabels += `<text x="${padLeft + wi * cellW}" y="${padTop - 14}" class="month">${MONTHS[m]}</text>`;
        lastMonth = m;
      }
    }
    week.contributionDays.forEach((day) => {
      const lvl = levelFor(day.contributionCount, maxCount);
      const x = padLeft + wi * cellW;
      const y = padTop + day.weekday * cellH;
      const cls = lvl > 0 ? "a" : "";
      cells += `<text x="${x}" y="${y}" class="cell ${cls}" fill="${COLORS[lvl]}">${SYMBOLS[lvl]}</text>`;
    });
  });

  const dayLabels = `
    <text x="0" y="${padTop + 1 * cellH}" class="daylabel">mon</text>
    <text x="0" y="${padTop + 3 * cellH}" class="daylabel">wed</text>
    <text x="0" y="${padTop + 5 * cellH}" class="daylabel">fri</text>
  `;

  const caption = `${stats.totalActiveDays} of ${stats.totalDays} days had a contribution`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap");
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      svg { animation: fadeUp 0.6s ease-out both; }
      .title { font: 700 14px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; letter-spacing: 1px; }
      .cursor { animation: blink 1.2s steps(1) infinite; }
      .month { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #888888; text-transform: uppercase; }
      .daylabel { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #888888; text-transform: uppercase; }
      .cell { font: 700 13px "JetBrains Mono", "Courier New", monospace; }
      .a { animation: pulse 2s ease-in-out infinite; }
      .caption { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #aaaaaa; }
    </style>
    <text x="20" y="26" class="title">// THE YEAR<tspan class="cursor"> |</tspan></text>
    ${monthLabels}
    ${dayLabels}
    ${cells}
    <text x="20" y="${height - 20}" class="caption">${caption}</text>
  </svg>`;
}
