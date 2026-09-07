export interface WeatherLocation {
  id: string;
  externalId: string;
  name: string;
  admin1: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  timezone: string;
  postcodes?: string[];
  dwdStationIds?: string[];
  source: 'manual' | 'search';
}

export type WeatherGlyphKind =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm'
  | 'unknown';

export type WeatherSceneKind =
  | 'neutral'
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'storm';

export type DayPhase = 'day' | 'night';

export interface WeatherCondition {
  code: number;
  label: string;
  icon: string;
  glyphKind: WeatherGlyphKind;
}

export interface CurrentWeather {
  time: string;
  temperatureCelsius: number | null;
  apparentTemperatureCelsius: number | null;
  condition: WeatherCondition;
  isDay: boolean | null;
  highCelsius: number | null;
  lowCelsius: number | null;
  apparentHighCelsius: number | null;
  apparentLowCelsius: number | null;
  windKmH: number | null;
  windDirectionDegrees: number | null;
  windGustsKmH: number | null;
  humidityPercent: number | null;
  pressureHpa: number | null;
  surfacePressureHpa: number | null;
  pressureMeanSeaLevelHpa: number | null;
  uvIndex: number | null;
  cloudCoverPercent: number | null;
  visibilityMeters: number | null;
  precipitationMm: number | null;
  rainMm: number | null;
  showersMm: number | null;
  snowfallCm: number | null;
  sunrise: string | null;
  sunset: string | null;
  daylightDurationSeconds: number | null;
  dewPointCelsius: number | null;
}

export interface HourlyForecastItem {
  time: string;
  temperatureCelsius: number | null;
  apparentTemperatureCelsius: number | null;
  precipitationProbabilityPercent: number | null;
  precipitationMm: number | null;
  rainMm: number | null;
  showersMm: number | null;
  snowfallCm: number | null;
  condition: WeatherCondition;
  pressureHpa: number | null;
  cloudCoverPercent: number | null;
  visibilityMeters: number | null;
  uvIndex: number | null;
  windKmH: number | null;
  windDirectionDegrees: number | null;
  windGustsKmH: number | null;
}

export interface DailyForecastItem {
  date: string;
  condition: WeatherCondition;
  maxCelsius: number | null;
  minCelsius: number | null;
  apparentMaxCelsius: number | null;
  apparentMinCelsius: number | null;
  sunrise: string | null;
  sunset: string | null;
  daylightDurationSeconds: number | null;
  sunshineDurationSeconds: number | null;
  uvIndexMax: number | null;
  precipitationProbabilityPercent: number | null;
  precipitationSumMm: number | null;
  rainSumMm: number | null;
  showersSumMm: number | null;
  snowfallSumCm: number | null;
  windSpeedMaxKmH: number | null;
  windGustsMaxKmH: number | null;
}

export type AirQualityCategory =
  | 'good'
  | 'fair'
  | 'moderate'
  | 'poor'
  | 'very-poor'
  | 'extremely-poor'
  | 'unknown';

export interface AirQualityItem {
  time: string;
  europeanAqi: number | null;
  category: AirQualityCategory;
  categoryLabel: string;
  pm25: number | null;
  pm10: number | null;
  nitrogenDioxide: number | null;
  ozone: number | null;
  sulphurDioxide: number | null;
  primaryPollutant?: string;
}

export interface AirQualityData {
  current: AirQualityItem;
  hourly: AirQualityItem[];
  fetchedAt: string;
}

export type WarningSeverity = 'minor' | 'moderate' | 'severe' | 'extreme';

export interface DwdWarning {
  id: string;
  headline: string;
  description: string;
  instruction?: string;
  severity: WarningSeverity;
  event: string;
  start: string;
  end: string;
  level: number;
  type?: string;
  regions?: string[];
}

export interface WeatherData {
  location: WeatherLocation;
  source: string;
  fetchedAt: string;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  warnings: DwdWarning[];
}

export type ActivityBadgeVariant = 'excellent' | 'good' | 'moderate' | 'poor' | 'none';

export interface ActivityRecommendation {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: ActivityBadgeVariant;
  iconType: 'landmark' | 'zoo' | 'lake' | 'museum' | 'umbrella';
}
