// Erzeugt apps/web/src/data/hr-counties.json aus Natural Earth 10m Admin-1 (gemeinfrei,
// https://www.naturalearthdata.com). Aufruf:
//   node scripts/map-croatia.mjs <pfad zu ne_10m_admin_1_states_provinces.geojson>
// Die Geometrie wird auf Kroatien gefiltert, vereinfacht (Douglas-Peucker) und in eine
// flache Projektion mit Breitengradkorrektur gebracht, damit das SVG ohne Kartenserver
// und ohne Fremdverbindung ausgeliefert werden kann (ADR-0005).

import { readFileSync, writeFileSync } from "node:fs";

const [, , input] = process.argv;
if (!input) {
  console.error("usage: node scripts/map-croatia.mjs <ne_10m_admin_1_states_provinces.geojson>");
  process.exit(1);
}

const TOLERANCE = 0.008; // Grad, etwa 700 m: reicht für eine Übersichtskarte
const WIDTH = 1000;

const data = JSON.parse(readFileSync(input, "utf8"));
const features = data.features.filter((f) => f.properties.adm0_a3 === "HRV");

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const sq = tolerance * tolerance;
  const dist2 = (p, a, b) => {
    let [x, y] = a;
    let dx = b[0] - x;
    let dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = b[0];
        y = b[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  };
  const keep = new Array(points.length).fill(false);
  keep[0] = keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let max = 0;
    let index = 0;
    for (let i = first + 1; i < last; i++) {
      const d = dist2(points[i], points[first], points[last]);
      if (d > max) {
        index = i;
        max = d;
      }
    }
    if (max > sq) {
      keep[index] = true;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

// Amtliche Namen je ISO-Code. Natural Earth führt Požeško-slavonska fälschlich als zweites
// HR-12 (Brodsko-posavska); das nördlichere der beiden Features ist HR-11.
const NAMES = {
  "HR-01": "Zagrebačka", "HR-02": "Krapinsko-zagorska", "HR-03": "Sisačko-moslavačka", "HR-04": "Karlovačka",
  "HR-05": "Varaždinska", "HR-06": "Koprivničko-križevačka", "HR-07": "Bjelovarsko-bilogorska", "HR-08": "Primorsko-goranska",
  "HR-09": "Ličko-senjska", "HR-10": "Virovitičko-podravska", "HR-11": "Požeško-slavonska", "HR-12": "Brodsko-posavska",
  "HR-13": "Zadarska", "HR-14": "Osječko-baranjska", "HR-15": "Šibensko-kninska", "HR-16": "Vukovarsko-srijemska",
  "HR-17": "Splitsko-dalmatinska", "HR-18": "Istarska", "HR-19": "Dubrovačko-neretvanska", "HR-20": "Međimurska", "HR-21": "Grad Zagreb",
};
const ringsOf = (f) => (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates).flat();
const centroidLat = (f) => { const pts = ringsOf(f).flat(); return pts.reduce((s, p) => s + p[1], 0) / pts.length; };
const hr12 = features.filter((f) => f.properties.iso_3166_2 === "HR-12").sort((a, b) => centroidLat(b) - centroidLat(a));
if (hr12.length === 2) hr12[0].properties.iso_3166_2 = "HR-11";

const byName = new Map();
for (const f of features) {
  const iso = f.properties.iso_3166_2;
  const key = iso + "|" + (NAMES[iso] ?? f.properties.name);
  const rings = byName.get(key) ?? [];
  for (const ring of ringsOf(f)) rings.push(simplify(ring, TOLERANCE));
  byName.set(key, rings);
}

// Projektion: Längengrad mit cos(mittlere Breite) gestaucht, y nach unten.
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
const lat0 = 44.5;
const k = Math.cos((lat0 * Math.PI) / 180);
const proj = ([lon, lat]) => [lon * k, -lat];
for (const rings of byName.values()) for (const ring of rings) for (const p of ring) {
  const [x, y] = proj(p);
  minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
}
const scale = WIDTH / (maxX - minX);
const height = Math.round((maxY - minY) * scale);
const toSvg = (p) => {
  const [x, y] = proj(p);
  return [((x - minX) * scale).toFixed(1), ((y - minY) * scale).toFixed(1)];
};

const counties = [...byName.entries()].map(([key, rings]) => ({
  iso: key.split("|")[0],
  name: key.split("|")[1],
  path: rings.map((ring) => "M" + ring.map((p) => toSvg(p).join(",")).join("L") + "Z").join(""),
}));

// Damit Orte aus Länge und Breite platziert werden können.
const projection = { lat0, k, minX, minY, scale, width: WIDTH, height };
const out = { source: "Natural Earth 10m Admin-1, public domain", generated: new Date().toISOString().slice(0, 10), projection, counties };
writeFileSync(new URL("../apps/web/src/data/hr-counties.json", import.meta.url), JSON.stringify(out));
console.log(`${counties.length} counties, ${JSON.stringify(out).length} bytes, viewBox 0 0 ${WIDTH} ${height}`);
