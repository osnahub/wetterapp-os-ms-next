'use client';

import React from 'react';
import { HourlyForecastItem } from '@/types/weather';
import { WeatherIcon } from '../weather/WeatherGlyph';
import { formatTemperature, formatPercent, formatTime } from '@/lib/weather/formatters';

interface HourlyForecastProps {
  hours: HourlyForecastItem[];
  timeZone?: string;
}

export function HourlyForecast({ hours, timeZone = 'Europe/Berlin' }: HourlyForecastProps) {
  if (!hours || hours.length === 0) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLOListElement>) => {
    const target = e.currentTarget;
    if (e.key === 'ArrowRight') {
      target.scrollLeft += 100;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      target.scrollLeft -= 100;
      e.preventDefault();
    } else if (e.key === 'Home') {
      target.scrollLeft = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      target.scrollLeft = target.scrollWidth;
      e.preventDefault();
    }
  };

  return (
    <section className="card forecast-card hourly-card" aria-labelledby="hourly-title">
      <h2 id="hourly-title">Stündlich</h2>
      <div className="hourly-scroll-hint">
        <ol
          className="hourly"
          tabIndex={0}
          role="region"
          aria-label="Stündliche Wettervorhersage, horizontal scrollbar"
          onKeyDown={handleKeyDown}
        >
          {hours.map((h) => {
            const timeStr = formatTime(h.time, timeZone);
            const tempStr = formatTemperature(h.temperatureCelsius);
            const probStr = formatPercent(h.precipitationProbabilityPercent);

            return (
              <li
                key={h.time}
                className="hour"
                aria-label={`${timeStr}, ${h.condition.label}, ${tempStr}, Niederschlagswahrscheinlichkeit ${probStr}`}
              >
                <time dateTime={h.time}>{timeStr}</time>
                <WeatherIcon glyphKind={h.condition.glyphKind} />
                <strong>{tempStr}</strong>
                <small title={`Niederschlagswahrscheinlichkeit ${probStr}`}>
                  <span>{probStr}</span>
                </small>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
