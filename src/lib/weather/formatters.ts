const NBSP = '\u00A0';

function isFiniteNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

export function formatNumber(val: number | null | undefined, options?: Intl.NumberFormatOptions): string {
  if (!isFiniteNumber(val)) return '–';
  return new Intl.NumberFormat('de-DE', options).format(val);
}

export function formatTemperature(celsius: number | null | undefined): string {
  if (!isFiniteNumber(celsius)) return '–';
  return `${Math.round(celsius)}°`;
}

export function formatWindSpeed(kmh: number | null | undefined): string {
  if (!isFiniteNumber(kmh)) return '–';
  return `${Math.round(kmh)}${NBSP}km/h`;
}

export function formatPercent(pct: number | null | undefined): string {
  if (!isFiniteNumber(pct)) return '–';
  return `${Math.round(pct)}${NBSP}%`;
}

export function formatPressure(hpa: number | null | undefined): string {
  if (!isFiniteNumber(hpa)) return '–';
  return `${Math.round(hpa)}${NBSP}hPa`;
}

export function formatMm(mm: number | null | undefined): string {
  if (!isFiniteNumber(mm)) return '–';
  return `${formatNumber(mm, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${NBSP}mm`;
}

export function formatCm(cm: number | null | undefined): string {
  if (!isFiniteNumber(cm)) return '–';
  return `${formatNumber(cm, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${NBSP}cm`;
}

export function formatVisibility(meters: number | null | undefined): string {
  if (!isFiniteNumber(meters)) return '–';
  if (meters >= 1000) {
    return `${formatNumber(meters / 1000, { maximumFractionDigits: 1 })}${NBSP}km`;
  }
  return `${Math.round(meters)}${NBSP}m`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!isFiniteNumber(seconds)) return '–';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  return `${hours}${NBSP}h ${minutes}${NBSP}min`;
}

const COMPASS_POINTS = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];

export function formatWindDirectionCompass(degrees: number | null | undefined): string {
  if (!isFiniteNumber(degrees)) return '–';
  return COMPASS_POINTS[Math.round(degrees / 45) % COMPASS_POINTS.length];
}

export function formatWindDirectionWithAngle(degrees: number | null | undefined): string {
  if (!isFiniteNumber(degrees)) return '–';
  const compass = formatWindDirectionCompass(degrees);
  return `${compass} ${Math.round(degrees)}°`;
}

function parseDateInput(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;

  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (ymd) {
    const y = Number(ymd[1]);
    const m = Number(ymd[2]) - 1;
    const d = Number(ymd[3]);
    const date = new Date(y, m, d);
    return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d ? date : null;
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTime(time: string | null | undefined, timeZone = 'Europe/Berlin'): string {
  const d = parseDateInput(time);
  if (!d) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(d);
}

export function formatDay(dateStr: string | null | undefined, timeZone = 'Europe/Berlin'): string {
  const d = parseDateInput(dateStr);
  if (!d) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone,
  }).format(d);
}

export function formatDateTime(isoStr: string | null | undefined, timeZone = 'Europe/Berlin'): string {
  const d = parseDateInput(isoStr);
  if (!d) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(d);
}

export function isDateToday(dateStr: string, timeZone = 'Europe/Berlin'): boolean {
  const target = parseDateInput(dateStr);
  if (!target) return false;
  const now = new Date();
  const format = (d: Date) =>
    new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone,
    }).format(d);
  return format(target) === format(now);
}
