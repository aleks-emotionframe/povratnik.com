// Date arithmetic on ISO strings (YYYY-MM-DD). All computation runs on UTC so that
// local time zones and daylight saving never shift a day. ISO strings compare
// lexicographically, so callers use <, <= directly.

export type IsoDate = string;

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(v: unknown): v is IsoDate {
  if (typeof v !== "string" || !ISO.test(v)) return false;
  const ms = Date.parse(`${v}T00:00:00Z`);
  return !Number.isNaN(ms) && toIso(new Date(ms)) === v;
}

function toIso(d: Date): IsoDate {
  return d.toISOString().slice(0, 10);
}

function fromIso(iso: IsoDate): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function addDays(iso: IsoDate, n: number): IsoDate {
  const d = fromIso(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toIso(d);
}

// Same day of month n months later; if that day does not exist, the last day of the
// target month (datenmodell.md 2.3).
export function addMonths(iso: IsoDate, n: number): IsoDate {
  const d = fromIso(iso);
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return toIso(target);
}

// 0 = Sunday ... 6 = Saturday, as in Date.getUTCDay.
export function weekday(iso: IsoDate): number {
  return fromIso(iso).getUTCDay();
}
