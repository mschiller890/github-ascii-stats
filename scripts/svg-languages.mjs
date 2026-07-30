function topN(entries, n = 5) {
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((s, [, v]) => s + v, 0);
  if (rest > 0) top.push(["other", rest]);
  const total = top.reduce((s, [, v]) => s + v, 0) || 1;
  return top.map(([name, v]) => [name, Math.round((v / total) * 100)]);
}

export function renderLanguagesSvg({ byBytes, byRepos, title = "// languages" }) {
  const width = 620;
  const colW = 286;
  const barX = 78;
  const barLen = 22;
  const barW = barLen * 7;

  const bytesEntries = topN(Object.entries(byBytes));
  const reposEntries = topN(Object.entries(byRepos));
  const maxEntries = Math.max(bytesEntries.length, reposEntries.length);
  const height = 95 + maxEntries * 26 + 24;

  let defs = "";

    function col(title, entries, cx) {
    let rows = "";
    entries.forEach(([name, pct], i) => {
      const y = 40 + i * 26;
      const d = i * 0.08;
      const filled = Math.round(barLen * pct / 100);
      const filledW = filled * 7;
      const cid = `${cx}_${i}`;
      defs += `<clipPath id="${cid}"><rect x="${barX + 6}" y="${y - 9}" width="0" height="14"><animate attributeName="width" from="0" to="${filledW}" dur="0.5s" begin="${d}s" fill="freeze"/></rect></clipPath>`;
      rows += `
      <text x="0" y="${y}" class="nm">${name}</text>
      <text x="${barX}" y="${y}" class="br">[</text>
      <text x="${barX + 6}" y="${y}" class="bg">${'.'.repeat(barLen)}</text>
      <text x="${barX + 6}" y="${y}" class="fg" clip-path="url(#${cid})">${'#'.repeat(filled)}</text>
      <text x="${barX + 6 + barW}" y="${y}" class="br">]</text>
      <text x="${barX + 6 + barW + 8}" y="${y}" class="pct">${pct}%</text>`;
    });
    return `<g transform="translate(${cx}, 0)"><text x="0" y="12" class="ct">## ${title}</text>${rows}</g>`;
  }

  const c1 = col("by bytes", bytesEntries, 0);
  const c2 = col("by repos", reposEntries, colW + 34);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap");
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      svg { animation: fadeUp 0.6s ease-out both; }
      .title { font: 700 14px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; }
      .ct { font: 700 10px "JetBrains Mono", "Courier New", monospace; fill: #555555; }
      .nm { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; }
      .br { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #555555; }
      .bg { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #2a2f28; }
      .fg { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #5cc266; }
      .pct { font: 700 10px "JetBrains Mono", "Courier New", monospace; fill: #444444; }
    </style>
    <text x="20" y="28" class="title">${title}</text>
    <defs>${defs}</defs>
    <g transform="translate(20, 52)">
      ${c1}
      ${c2}
    </g>
  </svg>`;
}
