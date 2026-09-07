'use client';

import React from 'react';
import { CurrentWeather, WeatherLocation } from '@/types/weather';
import { WeatherIcon } from '../weather/WeatherGlyph';
import { formatTemperature, formatTime } from '@/lib/weather/formatters';

interface BentoHeroCardProps {
  current: CurrentWeather;
  location: WeatherLocation;
  fetchedAt: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function BentoHeroCard({
  current,
  location,
  fetchedAt,
  onRefresh,
  isRefreshing = false,
}: BentoHeroCardProps) {
  // Format date: "Montag, 7. September"
  const formattedDate = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: location.timezone,
  }).format(new Date(fetchedAt));

  const formattedTime = formatTime(fetchedAt, location.timezone);

  return (
    <div className="bento-hero-wrapper">
      {/* Top Header Bar */}
      <div className="bento-top-bar">
        <div className="bento-location-meta">
          <div className="bento-pills">
            <span className="bento-pill-local">LOKAL</span>
            <span className="bento-pill-offline">
              <span className="bento-pulse-dot" /> Offline verfügbar
            </span>
          </div>
          <h1 className="bento-location-name">{location.name}</h1>
          <p className="bento-time-subtitle">
            {formattedDate} • Stand: {formattedTime} Uhr
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            className="bento-refresh-button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={isRefreshing ? 'Wetterdaten werden aktualisiert' : 'Wetterdaten aktualisieren'}
          >
            <svg
              className={isRefreshing ? 'bento-refresh-icon is-spinning' : 'bento-refresh-icon'}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M17.7 6.3A7.8 7.8 0 0 0 4.5 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 5v5h5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.3 17.7A7.8 7.8 0 0 0 19.5 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 19v-5h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Radiant Gradient Card */}
      <div className="bento-hero-card">
        <div className="bento-hero-main">
          <div className="bento-hero-icon-box">
            <WeatherIcon glyphKind={current.condition.glyphKind} />
          </div>

          <div className="bento-hero-temp-block">
            <span className="bento-hero-temp">
              {formatTemperature(current.temperatureCelsius)}
            </span>
            <span className="bento-hero-condition">{current.condition.label}</span>
          </div>
        </div>

        <div className="bento-hero-footer">
          <div>
            <span className="bento-hero-sublabel">GEFÜHLT WIE</span>
            <strong className="bento-hero-subval">
              {formatTemperature(current.apparentTemperatureCelsius)}C
            </strong>
          </div>
          <div>
            <span className="bento-hero-sublabel">MAX / MIN (HEUTE)</span>
            <strong className="bento-hero-subval">
              {formatTemperature(current.highCelsius)} / {formatTemperature(current.lowCelsius)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
