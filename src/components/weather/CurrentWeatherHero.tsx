'use client';

import React from 'react';
import { CurrentWeather, WeatherLocation } from '@/types/weather';
import { WeatherIcon } from './WeatherGlyph';
import {
  formatTemperature,
  formatWindSpeed,
  formatPercent,
  formatPressure,
  formatNumber,
  formatTime,
} from '@/lib/weather/formatters';

interface CurrentWeatherHeroProps {
  current: CurrentWeather;
  location: WeatherLocation;
  fetchedAt: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

function RefreshIcon({ spinning = false }: { spinning?: boolean }) {
  return (
    <svg
      className={spinning ? 'refresh-icon is-spinning' : 'refresh-icon'}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
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
  );
}

export function CurrentWeatherHero({
  current,
  location,
  fetchedAt,
  onRefresh,
  isRefreshing = false,
}: CurrentWeatherHeroProps) {
  const pressureVal = current.pressureMeanSeaLevelHpa ?? current.pressureHpa;
  const uvVal =
    current.uvIndex !== null && current.uvIndex !== undefined
      ? formatNumber(current.uvIndex, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
      : '–';

  return (
    <section
      className="hero card current-card"
      aria-labelledby="current-weather-title"
      aria-busy={isRefreshing}
    >
      <div className="current-card-header">
        <h2 id="current-weather-title" aria-label={`Aktuelles Wetter ${location.name}`}>
          <span className="current-weather-kicker">Aktuelles Wetter</span>
          <span className="current-weather-location">{location.name}</span>
        </h2>
        {onRefresh && (
          <button
            className="hero-refresh"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={isRefreshing ? 'Wetterdaten werden aktualisiert' : 'Wetterdaten aktualisieren'}
          >
            <RefreshIcon spinning={isRefreshing} />
          </button>
        )}
      </div>

      <div className="current-summary">
        <div className="condition">
          <WeatherIcon glyphKind={current.condition.glyphKind} />
          <strong>{current.condition.label}</strong>
        </div>
        <p className="hero-temperature">
          {formatTemperature(current.temperatureCelsius)}
        </p>
        <p>
          Gefühlt {formatTemperature(current.apparentTemperatureCelsius)} · H{' '}
          {formatTemperature(current.highCelsius)} / T {formatTemperature(current.lowCelsius)}
        </p>
      </div>

      <dl className="metrics">
        <div>
          <dt>Wind</dt>
          <dd>{formatWindSpeed(current.windKmH)}</dd>
        </div>
        <div>
          <dt>Feuchte</dt>
          <dd>{formatPercent(current.humidityPercent)}</dd>
        </div>
        <div>
          <dt>Luftdruck</dt>
          <dd>{formatPressure(pressureVal)}</dd>
        </div>
        <div>
          <dt>UV</dt>
          <dd>{uvVal}</dd>
        </div>
      </dl>

      <div className="updated" aria-live="polite">
        <p>
          Aktualisiert <time dateTime={fetchedAt}>{formatTime(fetchedAt, location.timezone)}</time> · Daten: Open-Meteo
        </p>
      </div>
    </section>
  );
}
