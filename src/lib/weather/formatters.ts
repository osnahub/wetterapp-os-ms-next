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
  const index = ((Math.round(degrees / 45) % COMPASS_POINTS.length) + COMPASS_POINTS.length) % COMPASS_POINTS.length;
  return COMPASS_POINTS[index];
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
    const date = new Date(Date.UTC(y, m, d, 12, 0, 0));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTime(time: string | null | undefined, timeZone = 'Europe/Berlin'): string {
  if (!time) return '–';
  // If local ISO timestamp from Open-Meteo without timezone offset (wall-clock time):
  const timeMatch = /T(\d{2}):(\d{2})/.exec(time);
  if (timeMatch && !time.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(time)) {
    return `${timeMatch[1]}:${timeMatch[2]}`;
  }

  const d = parseDateInput(time);
  if (!d) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(d);
}

export function formatDay(dateStr: string | null | undefined, timeZone = 'Europe/Berlin'): string {
  if (!dateStr) return '–';
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (ymd) {
    // Use UTC noon to be immune to DST shifts across all standard world timezones
    const d = new Date(Date.UTC(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]), 12, 0, 0));
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    }).format(d);
  }

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
  if (!isoStr) return '–';
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(isoStr);
  if (match && !isoStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(isoStr)) {
    // Construct UTC Date at exact wall clock time to format identically on any server
    const d = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5])));
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(d);
  }

  const d = parseDateInput(isoStr);
  if (!d) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(d);
}

export function isDateToday(dateStr: string, timeZone = 'Europe/Berlin'): boolean {
  if (!dateStr) return false;
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!ymd) return false;
  const targetDate = `${ymd[1]}-${ymd[2]}-${ymd[3]}`;

  const now = new Date();
  const todayDate = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  return targetDate === todayDate;
}
