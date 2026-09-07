import React from 'react';
import { DailyForecastItem } from '@/types/weather';
import { WeatherIcon } from '../weather/WeatherGlyph';
import {
  formatTemperature,
  formatPercent,
  formatWindSpeed,
  formatDay,
  isDateToday,
} from '@/lib/weather/formatters';

interface DailyForecastProps {
  days: DailyForecastItem[];
  timeZone?: string;
}

export function DailyForecast({ days, timeZone = 'Europe/Berlin' }: DailyForecastProps) {
  if (!days || days.length === 0) return null;

  return (
    <section className="card forecast-card" aria-labelledby="daily-title">
      <h2 id="daily-title">10 Tage</h2>
      <ol className="daily-list" aria-label="Tägliche Wettervorhersage">
        {days.map((day) => {
          const isToday = isDateToday(day.date, timeZone);
          const dayStr = formatDay(day.date, timeZone);
          const maxStr = formatTemperature(day.maxCelsius);
          const minStr = formatTemperature(day.minCelsius);
          const precipStr = formatPercent(day.precipitationProbabilityPercent);
          const gustsStr = formatWindSpeed(day.windGustsMaxKmH);

          return (
            <li key={day.date} className={isToday ? 'day is-today' : 'day'}>
              <div className="day-date">
                <time dateTime={day.date}>{dayStr}</time>
                {isToday && <span>Heute</span>}
              </div>

              <div className="day-condition">
                <WeatherIcon glyphKind={day.condition.glyphKind} className="day-icon" />
                <span>{day.condition.label}</span>
              </div>

              <div className="day-temps">
                <strong>{maxStr}</strong>
                <span>{minStr}</span>
              </div>

              <p className="day-meta">
                Niederschlag {precipStr} · Böen {gustsStr}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
