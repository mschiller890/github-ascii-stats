export function renderTitleSvg({ text = "// stats" }) {
  const width = 620;
  const height = 50;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap");
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      svg { animation: fadeUp 0.6s ease-out both; }
      .title { font: 700 14px "JetBrains Mono", "Courier New", monospace; fill: #ffffff; }
    </style>
    <text x="20" y="28" class="title">// ${text}</text>
  </svg>`;
}
