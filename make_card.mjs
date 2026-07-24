import fs from "node:fs";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const asciiLines = fs.readFileSync("portrait.txt", "utf8").split("\n");

// ---- profile data ----
const HEADUSER = "raul@devos";
const rows = [
  { t: "head", user: HEADUSER },
  { t: "kv", key: "Subject", val: "Raul Passos Gardini" },
  { t: "kv", key: "Role", val: "Full-Stack Engineer" },
  { t: "kv", key: "Origin", val: "Fortaleza, Ceara" },
  { t: "kv", key: "Education", val: "UNIFOR & Digital College" },
  { t: "kv", key: "ToolChain", val: "VS Code, Visual Studio, Git, Postman" },
  { t: "blank" },
  { t: "kv", key: "Core.Lang", val: "C#, TypeScript, JavaScript, Java" },
  { t: "kv", key: "Core.Frontend", val: "React, TypeScript, HTML5, CSS3" },
  { t: "kv", key: "Core.Backend", val: ".NET, ASP.NET Core, REST APIs" },
  { t: "kv", key: "Core.Database", val: "PostgreSQL, MongoDB, SQL Server" },
  { t: "blank" },
  { t: "section", label: "- Contact" },
  { t: "kv", key: "Grid.Mail", val: "rap.gardini@gmail.com" },
  { t: "kv", key: "Grid.Portfolio", val: "raul-portfolio-seven.vercel.app" },
  { t: "kv", key: "Grid.LinkedIn", val: "raul-gardini-2595712b1" },
  { t: "kv", key: "Grid.Github", val: "RaulGardini" },
];

const DASH = " -————————————————————————————————————————————-—-";
const ALIGN = 30; // value starts at this character column

function keyTspans(key) {
  // split "Core.Lang" -> key . key
  const parts = key.split(".");
  if (parts.length === 2) {
    return `<tspan class="key">${parts[0]}</tspan><tspan class="cc">.</tspan><tspan class="key">${parts[1]}</tspan>`;
  }
  return `<tspan class="key">${key}</tspan>`;
}

function rowInner(r, ty) {
  if (r.t === "head")
    return `<tspan x="520" y="${ty}" class="head">${r.user}</tspan><tspan class="cc">${DASH}</tspan>`;
  if (r.t === "section")
    return `<tspan x="520" y="${ty}" class="accent">${r.label}</tspan><tspan class="cc">${DASH}</tspan>`;
  if (r.t === "blank")
    return `<tspan x="520" y="${ty}" class="cc">. </tspan>`;
  // kv
  const disp = r.key.replace(".", "");
  const dots = Math.max(1, ALIGN - 2 - disp.length - 2);
  return `<tspan x="520" y="${ty}" class="cc">. </tspan>${keyTspans(r.key)}<tspan class="cc">: ${".".repeat(dots)} </tspan><tspan class="value">${esc(r.val)}</tspan>`;
}

function buildInfo() {
  const clips = [];
  const groups = [];
  rows.forEach((r, i) => {
    const ty = 42 + i * 22;
    const clipY = (26 + i * 22).toFixed(2);
    const begin = (0.75 + i * 0.113).toFixed(2);
    clips.push(
      `<clipPath id="lc${i}"><rect x="500" y="${clipY}" width="0" height="24"><animate attributeName="width" from="0" to="690" dur="0.38s" begin="${begin}s" fill="freeze"/></rect></clipPath>`
    );
    groups.push(
      `<g clip-path="url(#lc${i})"><text x="520" y="0" fill="none">${rowInner(r, ty)}</text></g>`
    );
  });
  return { clips: clips.join(""), groups: groups.join("") };
}

function buildAscii() {
  let y = 92;
  const out = asciiLines.map((l) => {
    const t = `<tspan x="100" y="${y.toFixed(2)}" xml:space="preserve">${esc(l)}</tspan>`;
    y += 7.55;
    return t;
  });
  return out.join("\n");
}

function svg(th) {
  const { clips, groups } = buildInfo();
  const ascii = buildAscii();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1180" height="610" viewBox="0 0 1180 610">
<defs>
  <linearGradient id="asciiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${th.ascii1}"><animate attributeName="stop-color" values="${th.asciiAnim1}" dur="9s" repeatCount="indefinite"/></stop>
    <stop offset="100%" stop-color="${th.ascii2}"><animate attributeName="stop-color" values="${th.asciiAnim2}" dur="9s" repeatCount="indefinite"/></stop>
  </linearGradient>
  <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${th.border1}"/>
    <stop offset="50%" stop-color="${th.border2}"/>
    <stop offset="100%" stop-color="${th.border3}"/>
  </linearGradient>
  <radialGradient id="bgGlow" cx="30%" cy="20%" r="80%">
    <stop offset="0%" stop-color="${th.bg1}"/>
    <stop offset="100%" stop-color="${th.bg2}"/>
  </radialGradient>
  <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="${th.scanGrad[0]}" stop-opacity="0"/>
    <stop offset="45%" stop-color="${th.scanGrad[0]}" stop-opacity="0.05"/>
    <stop offset="50%" stop-color="${th.scanGrad[1]}" stop-opacity="0.55"/>
    <stop offset="55%" stop-color="${th.scanGrad[0]}" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="${th.scanGrad[2]}" stop-opacity="0"/>
  </linearGradient>
  <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="1" fill="${th.scanFill}" opacity="0.05"/>
  </pattern>
  <mask id="revealMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1180" height="620">
    <rect x="0" y="0" width="1180" height="0" fill="#fff">
      <animate attributeName="height" from="0" to="560" dur="2.6s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
    </rect>
  </mask>
  ${clips}
  <style>
    .ascii  { font-family: 'Courier New', Consolas, monospace; font-size: 7.4px; fill: url(#asciiGrad); letter-spacing: -0.2px; }
    .key    { font-family: 'Courier New', Consolas, monospace; font-size: 15px; fill: ${th.key}; font-weight: bold; }
    .value  { font-family: 'Courier New', Consolas, monospace; font-size: 15px; fill: ${th.value}; }
    .cc     { font-family: 'Courier New', Consolas, monospace; font-size: 15px; fill: ${th.cc}; }
    .head   { font-family: 'Courier New', Consolas, monospace; font-size: 17px; fill: ${th.head}; font-weight: bold; }
    .accent { font-family: 'Courier New', Consolas, monospace; font-size: 15px; fill: ${th.accent}; font-weight: bold; }
    text, tspan { white-space: pre; }
    .term-label  { font-family: 'Courier New', Consolas, monospace; font-size: 12px; fill: ${th.termLabel}; letter-spacing: 0.5px; }
    .scan-label  { font-family: 'Courier New', Consolas, monospace; font-size: 10px; fill: #F87171; letter-spacing: 1px; }
    .panel-title { font-family: 'Courier New', Consolas, monospace; font-size: 11px; fill: ${th.panelTitle}; letter-spacing: 2px; opacity: 0.7; }
    .cursor-blink { fill: ${th.cursor}; }
  </style>
</defs>

<rect width="1180" height="610" rx="18" fill="url(#bgGlow)"/>
<rect width="1180" height="610" rx="18" fill="url(#scanlines)"/>

<g id="titlebar">
  <rect x="3" y="3" width="1174" height="34" rx="16" fill="${th.titleFill}" fill-opacity="${th.titleOp}"/>
  <circle cx="24" cy="20" r="5" fill="#EF4444"><animate attributeName="opacity" values="1;0.55;1" dur="4s" repeatCount="indefinite"/></circle>
  <circle cx="42" cy="20" r="5" fill="#F59E0B"><animate attributeName="opacity" values="1;0.55;1" dur="4s" begin="0.3s" repeatCount="indefinite"/></circle>
  <circle cx="60" cy="20" r="5" fill="#10B981"><animate attributeName="opacity" values="1;0.55;1" dur="4s" begin="0.6s" repeatCount="indefinite"/></circle>
  <text x="590" y="25" text-anchor="middle" class="term-label">${HEADUSER} ~ % ./profile.sh --live</text>
  <circle cx="1122" cy="20" r="4" fill="#F87171"><animate attributeName="opacity" values="1;0.15;1" dur="1.1s" repeatCount="indefinite"/></circle>
  <text x="1132" y="24" class="scan-label">SCANNING</text>
</g>

<g transform="translate(0,38)">
  <rect x="14" y="26" width="488" height="468" rx="14" fill="${th.panelFill}" fill-opacity="${th.panelFillOp}" stroke="url(#borderGrad)" stroke-width="1" opacity="0.5"/>
  <rect x="508" y="10" width="655" height="500" rx="14" fill="${th.panelFill}" fill-opacity="${th.panelFillOp}" stroke="url(#borderGrad)" stroke-width="1" opacity="0.5"/>
  <text x="30" y="24" class="panel-title">VISUAL.MAP</text>
  <text x="524" y="24" class="panel-title">SYSTEM.INFO</text>

  <g mask="url(#revealMask)">
    <text x="100" y="0" class="ascii">
${ascii}
    </text>
  </g>

  ${groups}

  <rect x="522" y="${42 + rows.length * 22 - 15}" width="9" height="16" class="cursor-blink" opacity="0">
    <animate attributeName="opacity" values="0;0;1;0;1;0;1;0" keyTimes="0;0.01;0.02;0.3;0.5;0.7;0.85;1" dur="1.4s" begin="3.66s" repeatCount="indefinite"/>
  </rect>
</g>

<rect x="0" y="-70" width="1180" height="70" fill="url(#scanGrad)" opacity="0.7" style="mix-blend-mode:screen">
  <animateTransform attributeName="transform" type="translate" from="0 -70" to="0 680" dur="4.2s" repeatCount="indefinite"/>
</rect>

<rect x="3" y="3" width="1174" height="604" rx="16" fill="none" stroke="url(#borderGrad)" stroke-width="2" opacity="0.8">
  <animate attributeName="opacity" values="0.5;0.95;0.5" dur="3.2s" repeatCount="indefinite"/>
</rect>
</svg>
`;
}

const dark = {
  bg1: "#0B1120", bg2: "#050816",
  ascii1: "#22D3EE", ascii2: "#7C3AED",
  asciiAnim1: "#22D3EE;#7C3AED;#38BDF8;#22D3EE", asciiAnim2: "#7C3AED;#38BDF8;#22D3EE;#7C3AED",
  border1: "#7C3AED", border2: "#22D3EE", border3: "#10B981",
  key: "#22D3EE", value: "#E5E7EB", cc: "#475569", head: "#7C3AED", accent: "#10B981",
  panelTitle: "#38BDF8", termLabel: "#64748B", scanFill: "#7DD3FC",
  panelFill: "#0B1120", panelFillOp: "0.35", titleFill: "#0B1120", titleOp: "0.85",
  scanGrad: ["#22D3EE", "#A5F3FC", "#7C3AED"], cursor: "#22D3EE",
};
const light = {
  bg1: "#F8FAFC", bg2: "#E2E8F0",
  ascii1: "#0EA5E9", ascii2: "#7C3AED",
  asciiAnim1: "#0EA5E9;#7C3AED;#38BDF8;#0EA5E9", asciiAnim2: "#7C3AED;#38BDF8;#0EA5E9;#7C3AED",
  border1: "#4F46E5", border2: "#0EA5E9", border3: "#059669",
  key: "#0284C7", value: "#1E293B", cc: "#94A3B8", head: "#7C3AED", accent: "#059669",
  panelTitle: "#0EA5E9", termLabel: "#64748B", scanFill: "#38BDF8",
  panelFill: "#FFFFFF", panelFillOp: "0.45", titleFill: "#FFFFFF", titleOp: "0.85",
  scanGrad: ["#0EA5E9", "#A5F3FC", "#7C3AED"], cursor: "#0EA5E9",
};

fs.writeFileSync("dark.svg", svg(dark), "utf8");
fs.writeFileSync("light.svg", svg(light), "utf8");
console.log("Wrote dark.svg and light.svg");
