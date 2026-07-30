import { fmtDate } from "./streak.mjs";

export function renderStreakSvg({ stats }) {
  const width = 480;
  const height = 200;

  const currentRange = stats.current.length
    ? `${fmtDate(stats.current.start)} - ${fmtDate(stats.current.end)}`
    : "no active streak";
  const longestRange = stats.longest.length
    ? `${fmtDate(stats.longest.start)} - ${fmtDate(stats.longest.end)}`
    : "n/a";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      .title { font: 700 14px "Courier New", monospace; fill: #ffffff; letter-spacing: 1px; }
      .big { font: 800 40px "Courier New", monospace; fill: #ffffff; }
      .label { font: 700 11px "Courier New", monospace; fill: #aaaaaa; text-transform: uppercase; letter-spacing: 1px; }
      .range { font: 600 11px "Courier New", monospace; fill: #888888; }
      .divider { stroke: #2a2f28; stroke-width: 1; }
    </style>
    <text x="20" y="28" class="title">// STREAK</text>

    <g transform="translate(20, 70)">
      <text x="0" y="0" class="big">${stats.current.length}</text>
      <text x="0" y="20" class="label">current streak</text>
      <text x="0" y="38" class="range">${currentRange}</text>
    </g>

    <line class="divider" x1="${width / 2}" y1="50" x2="${width / 2}" y2="${height - 20}"/>

    <g transform="translate(${width / 2 + 20}, 70)">
      <text x="0" y="0" class="big">${stats.longest.length}</text>
      <text x="0" y="20" class="label">longest streak</text>
      <text x="0" y="38" class="range">${longestRange}</text>
    </g>
  </svg>`;
}
