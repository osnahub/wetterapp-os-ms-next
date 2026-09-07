import { CurrentWeather, DailyForecastItem } from '@/types/weather';

export function generateWeatherSummary(
  current: CurrentWeather,
  today?: DailyForecastItem
): string {
  const temp = current.temperatureCelsius;
  const max = today?.maxCelsius ?? current.highCelsius;
  const rainProb = today?.precipitationProbabilityPercent ?? 0;
  const precipMm = current.precipitationMm ?? 0;
  const windKmH = current.windKmH ?? 0;
  const windGusts = current.windGustsKmH ?? windKmH;

  const parts: string[] = [];

  // 1. Wetterzustand
  const code = current.condition.code;
  if (code === 0) {
    parts.push('Sonniger und wolkenloser Himmel.');
  } else if (code <= 2) {
    parts.push('Überwiegend heiter mit sonnigen Abschnitten.');
  } else if (code === 3) {
    parts.push('Dichte Bewölkung am Himmel.');
  } else if (code >= 45 && code <= 48) {
    parts.push('Nebel oder Dunst mit eingeschränkter Sicht.');
  } else if (code >= 51 && code <= 67) {
    parts.push('Regnerische Bedingungen mit zeitweiligem Niederschlag.');
  } else if (code >= 71 && code <= 77) {
    parts.push('Schneefall und glatte Straßenverhältnisse.');
  } else if (code >= 80 && code <= 82) {
    parts.push('Wechselhaft mit wiederkehrenden Schauern.');
  } else if (code >= 95) {
    parts.push('Gewittrig mit potentiellem Starkregen.');
  } else {
    parts.push(current.condition.label + '.');
  }

  // 2. Temperaturkontext
  if (max != null) {
    if (max >= 28) {
      parts.push(`Sommerlich warm bei Höchstwerten bis ${Math.round(max)}°.`);
    } else if (max >= 21) {
      parts.push(`Angenehme Temperaturen mit bis zu ${Math.round(max)}°.`);
    } else if (max >= 15) {
      parts.push(`Mäßig warm mit maximal ${Math.round(max)}°.`);
    } else if (max >= 8) {
      parts.push(`Frisch bei maximal ${Math.round(max)}°.`);
    } else {
      parts.push(`Kühl mit Höchstwerten um ${Math.round(max)}°.`);
    }
  }

  // 3. Niederschlag oder Wind
  if (precipMm > 0.5) {
    parts.push('Aktuell Niederschlag – Regenschutz erforderlich.');
  } else if (rainProb >= 60) {
    parts.push(`Erhöhte Schauerneigung von ${rainProb} % im Tagesverlauf.`);
  } else if (windGusts >= 45) {
    parts.push(`Auffrischender Wind mit Böen bis ${Math.round(windGusts)} km/h.`);
  } else if (rainProb < 20 && (temp ?? 20) >= 18) {
    parts.push('Gute Bedingungen für Aktivitäten im Freien.');
  }

  return parts.join(' ');
}
