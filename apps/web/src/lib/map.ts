// Übersichtskarte ohne Fremdserver (ADR-0005): Gespanschaften aus src/data/hr-counties.json
// (Natural Earth, gemeinfrei, erzeugt mit scripts/map-croatia.mjs), Orte aus Länge und
// Breite in denselben Raum projiziert.

import data from "../data/hr-counties.json";

export type County = { iso: string; name: string; path: string };

export const COUNTIES: County[] = data.counties as County[];
export const MAP_WIDTH = data.projection.width as number;
export const MAP_HEIGHT = data.projection.height as number;
export const MAP_SOURCE = data.source as string;

/** Bild-Koordinaten für einen Punkt aus Länge und Breite. */
export function project(lon: number, lat: number): { x: number; y: number } {
  const { k, minX, minY, scale } = data.projection as { k: number; minX: number; minY: number; scale: number };
  return { x: (lon * k - minX) * scale, y: (-lat - minY) * scale };
}

/** Slug einer Gespanschaft für Regionenseiten, aus dem ISO-Code. */
export function countySlug(c: County): string {
  return c.iso.toLowerCase();
}

export function countyByIso(iso: string): County | undefined {
  return COUNTIES.find((c) => c.iso.toLowerCase() === iso.toLowerCase());
}
