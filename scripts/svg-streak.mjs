import { fmtDate } from "./streak.mjs";

export function renderStreakSvg({ stats }) {
  const currentRange = stats.current.length
    ? `${fmtDate(stats.current.start)} - ${fmtDate(stats.current.end)}`
    : "no active streak";
  const longestRange = stats.longest.length
    ? `${fmtDate(stats.longest.start)} - ${fmtDate(stats.longest.end)}`
    : "n/a";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="260" viewBox="0 0 620 260">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap");
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
      @keyframes drawLine { from { stroke-dashoffset: 120; } to { stroke-dashoffset: 0; } }
      svg { animation: fadeUp 0.6s ease-out both; }
      .title { font: 700 14px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; letter-spacing: 1px; }
      .cursor { animation: blink 1.2s steps(1) infinite; }
      .big { font: 800 40px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; animation: popIn 0.5s ease-out 0.3s both; }
      .label { font: 700 11px "JetBrains Mono", "Courier New", monospace; fill: #aaaaaa; text-transform: uppercase; letter-spacing: 1px; }
      .range { font: 600 11px "JetBrains Mono", "Courier New", monospace; fill: #888888; }
      .divider { stroke: #2a2f28; stroke-width: 1; stroke-dasharray: 120; animation: drawLine 0.6s ease-out 0.2s both; }
    </style>
    <text x="26" y="28" class="title">// STREAK<tspan class="cursor"> |</tspan></text>

    <g transform="translate(26, 70)">
      <text x="0" y="0" class="big">${stats.current.length}</text>
      <text x="0" y="20" class="label">current streak</text>
      <text x="0" y="38" class="range">${currentRange}</text>
    </g>

    <line class="divider" x1="310" y1="50" x2="310" y2="240"/>

    <g transform="translate(336, 70)">
      <text x="0" y="0" class="big">${stats.longest.length}</text>
      <text x="0" y="20" class="label">longest streak</text>
      <text x="0" y="38" class="range">${longestRange}</text>
    </g>
  </svg>`;
}
