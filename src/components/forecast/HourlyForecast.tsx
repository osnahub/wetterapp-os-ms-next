'use client';

import React, { useRef } from 'react';
import { HourlyForecastItem } from '@/types/weather';
import { WeatherIcon } from '../weather/WeatherGlyph';
import { formatTemperature, formatPercent, formatTime } from '@/lib/weather/formatters';

interface HourlyForecastProps {
  hours: HourlyForecastItem[];
  timeZone?: string;
}

export function HourlyForecast({ hours, timeZone = 'Europe/Berlin' }: HourlyForecastProps) {
  const listRef = useRef<HTMLOListElement>(null);

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

  const handleWheel = (e: React.WheelEvent<HTMLOListElement>) => {
    // Enable horizontal scroll via mouse wheel
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  const scrollByAmount = (amount: number) => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="card forecast-card hourly-card" aria-labelledby="hourly-title">
      <div className="hourly-header-row">
        <h2 id="hourly-title">Stündlich</h2>
        <div className="hourly-nav-controls" aria-hidden="true">
          <button
            type="button"
            className="hourly-nav-btn"
            onClick={() => scrollByAmount(-220)}
            tabIndex={-1}
            aria-label="Nach links scrollen"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="hourly-nav-btn"
            onClick={() => scrollByAmount(220)}
            tabIndex={-1}
            aria-label="Nach rechts scrollen"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="hourly-scroll-hint">
        <ol
          ref={listRef}
          className="hourly"
          tabIndex={0}
          role="region"
          aria-label="Stündliche Wettervorhersage, horizontal scrollbar"
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
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
