function topN(entries, n = 5) {
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((s, [, v]) => s + v, 0);
  if (rest > 0) top.push(["other", rest]);
  const total = top.reduce((s, [, v]) => s + v, 0) || 1;
  return top.map(([name, v]) => [name, Math.round((v / total) * 100)]);
}

function column(title, entries, x, colW) {
  const nameW = 85;
  const barMaxW = colW - nameW - 52;
  let rows = "";
  entries.forEach(([name, pct], i) => {
    const y = 40 + i * 26;
    const barW = Math.max(2, (pct / 100) * barMaxW);
    const delay = i * 0.08;
    rows += `
      <text x="0" y="${y}" class="lang">${name}</text>
      <rect x="${nameW}" y="${y - 11}" width="${barMaxW}" height="10" class="track"/>
      <rect x="${nameW}" y="${y - 11}" width="0" height="10" class="bar">
        <animate attributeName="width" from="0" to="${barW}" dur="0.6s" begin="${delay}s" fill="freeze"/>
      </rect>
      <text x="${colW - 6}" y="${y}" class="pct" text-anchor="end">${pct}%</text>
    `;
  });
  return `<g transform="translate(${x}, 0)">
    <text x="0" y="10" class="colTitle">// ${title}</text>
    ${rows}
  </g>`;
}

export function renderLanguagesSvg({ byBytes, byRepos }) {
  const width = 620;
  const colW = 270;

  const bytesEntries = topN(Object.entries(byBytes));
  const reposEntries = topN(Object.entries(byRepos));
  const maxEntries = Math.max(bytesEntries.length, reposEntries.length);
  const height = 95 + maxEntries * 26 + 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap");
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      svg { animation: fadeUp 0.6s ease-out both; }
      .title { font: 700 14px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; }
      .cursor { animation: blink 1.2s steps(1) infinite; }
      .colTitle { font: 700 11px "JetBrains Mono", "Courier New", monospace; fill: #555555; }
      .lang { font: 600 12px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; }
      .pct { font: 700 11px "JetBrains Mono", "Courier New", monospace; fill: #444444; }
      .track { fill: #1c1f1a; }
      .bar { fill: #5cc266; }
    </style>
    <text x="20" y="28" class="title">// LANGUAGES<tspan class="cursor"> |</tspan></text>
    <g transform="translate(20, 52)">
      ${column("BY BYTES", bytesEntries, 0, colW)}
      ${column("BY REPOS", reposEntries, colW + 36, colW)}
    </g>
  </svg>`;
}
