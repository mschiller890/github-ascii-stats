function topN(entries, n = 5) {
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((s, [, v]) => s + v, 0);
  if (rest > 0) top.push(["other", rest]);
  const total = top.reduce((s, [, v]) => s + v, 0) || 1;
  return top.map(([name, v]) => [name, Math.round((v / total) * 100)]);
}

function column(title, entries, x, width) {
  let rows = "";
  entries.forEach(([name, pct], i) => {
    const y = 40 + i * 26;
    const barW = Math.max(2, (pct / 100) * (width - 90));
    rows += `
      <text x="0" y="${y}" class="lang">${name}</text>
      <rect x="90" y="${y - 11}" width="${width - 90}" height="10" class="track"/>
      <rect x="90" y="${y - 11}" width="${barW}" height="10" class="bar"/>
      <text x="${width + 6}" y="${y}" class="pct">${pct}%</text>
    `;
  });
  return `<g transform="translate(${x}, 0)">
    <text x="0" y="10" class="colTitle">${title}</text>
    ${rows}
  </g>`;
}

export function renderLanguagesSvg({ byBytes, byRepos }) {
  const width = 560;
  const colWidth = 230;

  const bytesEntries = topN(Object.entries(byBytes));
  const reposEntries = topN(Object.entries(byRepos));
  const maxEntries = Math.max(bytesEntries.length, reposEntries.length);
  const height = 95 + maxEntries * 26 + 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      .title { font: 700 14px "Courier New", monospace; fill: #ffffff; letter-spacing: 1px; }
      .colTitle { font: 700 11px "Courier New", monospace; fill: #aaaaaa; letter-spacing: 1px; }
      .lang { font: 600 12px "Courier New", monospace; fill: #ffffff; }
      .pct { font: 700 12px "Courier New", monospace; fill: #888888; }
      .track { fill: #333333; }
      .bar { fill: #5cc266; }
    </style>
    <text x="20" y="28" class="title">// LANGUAGES</text>
    <g transform="translate(20, 55)">
      ${column("BY BYTES", bytesEntries, 0, colWidth)}
      ${column("BY REPOS", reposEntries, colWidth + 40, colWidth)}
    </g>
  </svg>`;
}
