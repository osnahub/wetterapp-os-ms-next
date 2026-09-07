import {
  WeatherLocation,
  WeatherData,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  AirQualityData,
  AirQualityItem,
  DwdWarning,
} from '@/types/weather';
import {
  resolveWeatherCondition,
  resolveAqiCategory,
  AQI_LABELS,
  DEFAULT_LOCATIONS,
} from './constants';

function num(val: unknown): number | null {
  return typeof val === 'number' && Number.isFinite(val) ? val : null;
}

// Find index of current hour in hourly forecast array
function findCurrentHourIndex(times: string[], targetTime?: string): number {
  if (!times?.length) return 0;
  if (!targetTime) {
    const now = Date.now();
    const idx = times.findIndex((t) => new Date(t).getTime() >= now);
    return idx >= 0 ? idx : 0;
  }
  const idx = times.indexOf(targetTime);
  if (idx >= 0) return idx;
  const targetTs = new Date(targetTime).getTime();
  if (Number.isFinite(targetTs)) {
    const found = times.findIndex((t) => new Date(t).getTime() >= targetTs);
    if (found >= 0) return found;
  }
  return 0;
}

// Find index of current day in daily forecast array
function findCurrentDayIndex(dates: string[], targetTime?: string): number {
  if (!dates?.length) return 0;
  const targetDate = (targetTime ?? new Date().toISOString()).slice(0, 10);
  const idx = dates.indexOf(targetDate);
  return idx >= 0 ? idx : 0;
}

export async function fetchWeatherData(location: WeatherLocation): Promise<WeatherData> {
  const weatherParams = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: location.timezone || 'auto',
    forecast_days: '10',
    timeformat: 'iso8601',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'dew_point_2m',
      'precipitation_probability',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'visibility',
      'uv_index',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'sunshine_duration',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
    ].join(','),
  });

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`;

  const aqiParams = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: location.timezone || 'auto',
    domains: 'auto',
    forecast_hours: '24',
    current: [
      'european_aqi',
      'pm2_5',
      'pm10',
      'nitrogen_dioxide',
      'ozone',
      'sulphur_dioxide',
      'european_aqi_pm2_5',
      'european_aqi_pm10',
      'european_aqi_nitrogen_dioxide',
      'european_aqi_ozone',
      'european_aqi_sulphur_dioxide',
    ].join(','),
    hourly: [
      'european_aqi',
      'pm2_5',
      'pm10',
      'nitrogen_dioxide',
      'ozone',
      'sulphur_dioxide',
    ].join(','),
  });

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${aqiParams.toString()}`;

  // Fetch weather and air quality concurrently with caching
  const [weatherRes, aqiRes, warnings] = await Promise.all([
    fetch(weatherUrl, { next: { revalidate: 300 } }),
    fetch(aqiUrl, { next: { revalidate: 600 } }).catch(() => null),
    fetchDwdWarnings(location),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Wetterdaten konnten nicht geladen werden (HTTP ${weatherRes.status})`);
  }

  const weatherJson = await weatherRes.json();
  const aqiJson = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

  return normalizeWeatherData(location, weatherJson, aqiJson, warnings);
}

function normalizeWeatherData(
  location: WeatherLocation,
  raw: any,
  aqiRaw: any,
  warnings: DwdWarning[]
): WeatherData {
  const current = raw.current ?? {};
  const hourly = raw.hourly ?? {};
  const daily = raw.daily ?? {};

  const currentTime = current.time ?? hourly.time?.[0] ?? daily.time?.[0] ?? new Date().toISOString();
  const hourIdx = findCurrentHourIndex(hourly.time, currentTime);
  const dayIdx = findCurrentDayIndex(daily.time, currentTime);

  const currentWeather: CurrentWeather = {
    time: currentTime,
    temperatureCelsius: num(current.temperature_2m),
    apparentTemperatureCelsius: num(current.apparent_temperature),
    condition: resolveWeatherCondition(current.weather_code ?? 0),
    isDay: typeof current.is_day === 'number' ? current.is_day === 1 : null,
    highCelsius: num(daily.temperature_2m_max?.[dayIdx]),
    lowCelsius: num(daily.temperature_2m_min?.[dayIdx]),
    apparentHighCelsius: num(daily.apparent_temperature_max?.[dayIdx]),
    apparentLowCelsius: num(daily.apparent_temperature_min?.[dayIdx]),
    windKmH: num(current.wind_speed_10m),
    windDirectionDegrees: num(current.wind_direction_10m),
    windGustsKmH: num(current.wind_gusts_10m),
    humidityPercent: num(current.relative_humidity_2m),
    pressureHpa: num(current.pressure_msl) ?? num(hourly.pressure_msl?.[hourIdx]) ?? num(current.surface_pressure),
    surfacePressureHpa: num(current.surface_pressure),
    pressureMeanSeaLevelHpa: num(current.pressure_msl),
    uvIndex: num(hourly.uv_index?.[hourIdx]),
    cloudCoverPercent: num(current.cloud_cover),
    visibilityMeters: num(hourly.visibility?.[hourIdx]),
    precipitationMm: num(current.precipitation),
    rainMm: num(current.rain),
    showersMm: num(current.showers),
    snowfallCm: num(current.snowfall),
    sunrise: daily.sunrise?.[dayIdx] ?? null,
    sunset: daily.sunset?.[dayIdx] ?? null,
    daylightDurationSeconds: num(daily.daylight_duration?.[dayIdx]),
    dewPointCelsius: num(hourly.dew_point_2m?.[hourIdx]),
  };

  // Next 48 hours forecast
  const hourlyItems: HourlyForecastItem[] = [];
  const times: string[] = hourly.time ?? [];
  const startIdx = findCurrentHourIndex(times);
  const sliceCount = Math.min(48, times.length - startIdx);

  for (let i = 0; i < sliceCount; i++) {
    const idx = startIdx + i;
    hourlyItems.push({
      time: times[idx],
      temperatureCelsius: num(hourly.temperature_2m?.[idx]),
      apparentTemperatureCelsius: num(hourly.apparent_temperature?.[idx]),
      precipitationProbabilityPercent: num(hourly.precipitation_probability?.[idx]),
      precipitationMm: num(hourly.precipitation?.[idx]),
      rainMm: num(hourly.rain?.[idx]),
      showersMm: num(hourly.showers?.[idx]),
      snowfallCm: num(hourly.snowfall?.[idx]),
      condition: resolveWeatherCondition(hourly.weather_code?.[idx] ?? 0),
      pressureHpa: num(hourly.pressure_msl?.[idx]),
      cloudCoverPercent: num(hourly.cloud_cover?.[idx]),
      visibilityMeters: num(hourly.visibility?.[idx]),
      uvIndex: num(hourly.uv_index?.[idx]),
      windKmH: num(hourly.wind_speed_10m?.[idx]),
      windDirectionDegrees: num(hourly.wind_direction_10m?.[idx]),
      windGustsKmH: num(hourly.wind_gusts_10m?.[idx]),
    });
  }

  // 10 days forecast
  const dailyItems: DailyForecastItem[] = [];
  const dayDates: string[] = daily.time ?? [];
  for (let i = 0; i < dayDates.length; i++) {
    dailyItems.push({
      date: dayDates[i],
      condition: resolveWeatherCondition(daily.weather_code?.[i] ?? 0),
      maxCelsius: num(daily.temperature_2m_max?.[i]),
      minCelsius: num(daily.temperature_2m_min?.[i]),
      apparentMaxCelsius: num(daily.apparent_temperature_max?.[i]),
      apparentMinCelsius: num(daily.apparent_temperature_min?.[i]),
      sunrise: daily.sunrise?.[i] ?? null,
      sunset: daily.sunset?.[i] ?? null,
      daylightDurationSeconds: num(daily.daylight_duration?.[i]),
      sunshineDurationSeconds: num(daily.sunshine_duration?.[i]),
      uvIndexMax: num(daily.uv_index_max?.[i]),
      precipitationProbabilityPercent: num(daily.precipitation_probability_max?.[i]),
      precipitationSumMm: num(daily.precipitation_sum?.[i]),
      rainSumMm: num(daily.rain_sum?.[i]),
      showersSumMm: num(daily.showers_sum?.[i]),
      snowfallSumCm: num(daily.snowfall_sum?.[i]),
      windSpeedMaxKmH: num(daily.wind_speed_10m_max?.[i]),
      windGustsMaxKmH: num(daily.wind_gusts_10m_max?.[i]),
    });
  }

  // Normalize Air Quality
  let airQuality: AirQualityData | undefined;
  if (aqiRaw?.current) {
    const aqiCurrent = aqiRaw.current;
    const aqiVal = num(aqiCurrent.european_aqi);
    const cat = resolveAqiCategory(aqiVal);

    // Determine primary pollutant based on individual sub-indices
    const subIndices: Record<string, number | null> = {
      pm25: num(aqiCurrent.european_aqi_pm2_5),
      pm10: num(aqiCurrent.european_aqi_pm10),
      nitrogenDioxide: num(aqiCurrent.european_aqi_nitrogen_dioxide),
      ozone: num(aqiCurrent.european_aqi_ozone),
      sulphurDioxide: num(aqiCurrent.european_aqi_sulphur_dioxide),
    };

    let maxSub = -1;
    let primaryKey: string | undefined;
    for (const [k, v] of Object.entries(subIndices)) {
      if (v !== null && v > maxSub) {
        maxSub = v;
        primaryKey = k;
      }
    }

    const currentAqiItem: AirQualityItem = {
      time: aqiCurrent.time ?? currentTime,
      europeanAqi: aqiVal,
      category: cat,
      categoryLabel: AQI_LABELS[cat],
      pm25: num(aqiCurrent.pm2_5),
      pm10: num(aqiCurrent.pm10),
      nitrogenDioxide: num(aqiCurrent.nitrogen_dioxide),
      ozone: num(aqiCurrent.ozone),
      sulphurDioxide: num(aqiCurrent.sulphur_dioxide),
      primaryPollutant: primaryKey,
    };

    const hourlyAqiItems: AirQualityItem[] = [];
    const aqiHourly = aqiRaw.hourly ?? {};
    const aqiTimes: string[] = aqiHourly.time ?? [];
    for (let i = 0; i < aqiTimes.length; i++) {
      const hAqi = num(aqiHourly.european_aqi?.[i]);
      const hCat = resolveAqiCategory(hAqi);
      hourlyAqiItems.push({
        time: aqiTimes[i],
        europeanAqi: hAqi,
        category: hCat,
        categoryLabel: AQI_LABELS[hCat],
        pm25: num(aqiHourly.pm2_5?.[i]),
        pm10: num(aqiHourly.pm10?.[i]),
        nitrogenDioxide: num(aqiHourly.nitrogen_dioxide?.[i]),
        ozone: num(aqiHourly.ozone?.[i]),
        sulphurDioxide: num(aqiHourly.sulphur_dioxide?.[i]),
      });
    }

    airQuality = {
      current: currentAqiItem,
      hourly: hourlyAqiItems,
      fetchedAt: new Date().toISOString(),
    };
  }

  return {
    location: {
      ...location,
      elevationMeters: num(raw.elevation) ?? location.elevationMeters,
    },
    source: 'open-meteo',
    fetchedAt: new Date().toISOString(),
    current: currentWeather,
    hourly: hourlyItems,
    daily: dailyItems,
    airQuality,
    warnings,
  };
}

export async function fetchDwdWarnings(location: WeatherLocation): Promise<DwdWarning[]> {
  try {
    // Attempt to load official DWD warnings from dwd-warnings.json endpoint or DWD open data
    const res = await fetch('https://wetter.kloentrup.de/dwd-warnings.json', {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data || data.provider !== 'dwd' || !Array.isArray(data.warnings)) {
      return [];
    }

    const stationIds = location.dwdStationIds ?? [];
    if (!stationIds.length) return [];

    // Filter warnings that match this location's station or regions
    const now = Date.now();
    return data.warnings.filter((w: any) => {
      const expires = w.expires ? new Date(w.expires).getTime() : Infinity;
      if (expires <= now) return false;
      if (!w.regions || !Array.isArray(w.regions)) return true;
      return w.regions.some((r: string) => stationIds.includes(r));
    });
  } catch {
    return [];
  }
}

export function getLocationById(id: string): WeatherLocation {
  if (!id) return DEFAULT_LOCATIONS[0];
  const query = id.toLowerCase().trim();
  return (
    DEFAULT_LOCATIONS.find((l) => {
      const name = l.name.toLowerCase();
      return (
        l.id.toLowerCase() === query ||
        l.externalId?.toLowerCase() === query ||
        name === query ||
        (query === 'muenster' && name.includes('münster')) ||
        (query === 'münster' && name.includes('münster')) ||
        (query === 'osnabrueck' && name.includes('osnabrück')) ||
        (query === 'osnabrück' && name.includes('osnabrück'))
      );
    }) ?? DEFAULT_LOCATIONS[0]
  );
}
