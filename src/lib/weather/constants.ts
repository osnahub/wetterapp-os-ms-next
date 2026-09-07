import {
  WeatherLocation,
  WeatherGlyphKind,
  WeatherSceneKind,
  DayPhase,
  WeatherCondition,
  AirQualityCategory,
} from '@/types/weather';

export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  {
    id: 'openmeteo:2856883',
    externalId: 'openmeteo:2856883',
    name: 'Osnabrück',
    admin1: 'Niedersachsen',
    country: 'Deutschland',
    countryCode: 'DE',
    latitude: 52.2799,
    longitude: 8.0472,
    elevationMeters: 63,
    timezone: 'Europe/Berlin',
    dwdStationIds: ['803404000'],
    source: 'manual',
  },
  {
    id: 'openmeteo:2867543',
    externalId: 'openmeteo:2867543',
    name: 'Münster',
    admin1: 'Nordrhein-Westfalen',
    country: 'Deutschland',
    countryCode: 'DE',
    latitude: 51.96236,
    longitude: 7.62571,
    elevationMeters: 60,
    timezone: 'Europe/Berlin',
    postcodes: ['48143'],
    dwdStationIds: ['705515101', '705515102'],
    source: 'manual',
  },
];

export const WMO_TABLE: Record<number, [string, string]> = {
  0: ['Klar', '☀️'],
  1: ['Überwiegend klar', '🌤️'],
  2: ['Teilweise bewölkt', '⛅'],
  3: ['Bewölkt', '☁️'],
  45: ['Nebel', '🌫️'],
  48: ['Reifnebel', '🌫️'],
  51: ['Leichter Niesel', '🌦️'],
  53: ['Niesel', '🌦️'],
  55: ['Starker Niesel', '🌧️'],
  61: ['Leichter Regen', '🌦️'],
  63: ['Regen', '🌧️'],
  65: ['Starker Regen', '🌧️'],
  66: ['Gefrierender Regen', '🌧️'],
  67: ['Starker Eisregen', '🌧️'],
  71: ['Leichter Schnee', '🌨️'],
  73: ['Schnee', '🌨️'],
  75: ['Starker Schnee', '❄️'],
  77: ['Schneekörner', '❄️'],
  80: ['Leichte Schauer', '🌦️'],
  81: ['Schauer', '🌧️'],
  82: ['Starke Schauer', '⛈️'],
  85: ['Schneeschauer', '🌨️'],
  86: ['Starke Schneeschauer', '❄️'],
  95: ['Gewitter', '⛈️'],
  96: ['Gewitter mit Hagel', '⛈️'],
  99: ['Starkes Gewitter', '⛈️'],
};

export function resolveGlyphKind(code: number): WeatherGlyphKind {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'unknown';
}

export function resolveWeatherCondition(code: number): WeatherCondition {
  const info = WMO_TABLE[code] ?? ['Nicht verfügbar', '🌡️'];
  return {
    code,
    label: info[0],
    icon: info[1],
    glyphKind: resolveGlyphKind(code),
  };
}

export function resolveWeatherScene(code?: number | null): WeatherSceneKind {
  if (code === undefined || code === null) return 'neutral';
  if (code === 45 || code === 48) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if (code === 2 || code === 3) return 'cloudy';
  return 'clear';
}

export function resolveDayPhase(isDay?: boolean | null): DayPhase {
  return isDay === false ? 'night' : 'day';
}

export const AQI_LABELS: Record<AirQualityCategory, string> = {
  good: 'Gut',
  fair: 'Befriedigend',
  moderate: 'Mäßig',
  poor: 'Schlecht',
  'very-poor': 'Sehr schlecht',
  'extremely-poor': 'Extrem schlecht',
  unknown: 'Unbekannt',
};

export function resolveAqiCategory(europeanAqi: number | null): AirQualityCategory {
  if (typeof europeanAqi !== 'number' || !Number.isFinite(europeanAqi)) return 'unknown';
  if (europeanAqi <= 20) return 'good';
  if (europeanAqi <= 40) return 'fair';
  if (europeanAqi <= 60) return 'moderate';
  if (europeanAqi <= 80) return 'poor';
  if (europeanAqi <= 100) return 'very-poor';
  return 'extremely-poor';
}

export const POLLUTANT_NAMES: Record<string, string> = {
  pm25: 'Feinstaub PM₂,₅',
  pm10: 'Feinstaub PM₁₀',
  nitrogenDioxide: 'Stickstoffdioxid NO₂',
  ozone: 'Ozon O₃',
  sulphurDioxide: 'Schwefeldioxid SO₂',
};
