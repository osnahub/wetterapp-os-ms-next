import React from 'react';
import { CurrentWeather, HourlyForecastItem } from '@/types/weather';
import {
  formatWindSpeed,
  formatWindDirectionWithAngle,
  formatMm,
  formatCm,
  formatPercent,
  formatPressure,
  formatVisibility,
  formatDuration,
  formatTime,
} from '@/lib/weather/formatters';

interface WeatherDetailsGridProps {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  timeZone?: string;
}

interface DetailPairProps {
  label: string;
  value: string;
  wide?: boolean;
}

function DetailPair({ label, value, wide = false }: DetailPairProps) {
  return (
    <div className={wide ? 'detail-item detail-item-wide' : 'detail-item'}>
      <dt>{label}</dt>
      <dd>{value === '–' ? <span aria-label="nicht verfügbar">–</span> : value}</dd>
    </div>
  );
}

export function WeatherDetailsGrid({
  current,
  hourly,
  timeZone = 'Europe/Berlin',
}: WeatherDetailsGridProps) {
  // Calculate max precipitation probability for the next 6 hours
  const next6PrecipProb = (() => {
    const next6 = hourly.slice(0, 6).map((h) => h.precipitationProbabilityPercent);
    const valid = next6.filter((p): p is number => typeof p === 'number' && Number.isFinite(p));
    return valid.length > 0 ? Math.max(...valid) : null;
  })();

  const pressureVal = current.pressureMeanSeaLevelHpa ?? current.pressureHpa;

  return (
    <div className="detail-section-grid" aria-label="Wetterdetails">
      {/* 1. Wind */}
      <section className="card detail-section" aria-labelledby="wind-title">
        <h2 id="wind-title">Wind</h2>
        <p className="section-main-value">{formatWindSpeed(current.windKmH)}</p>
        <dl className="detail-pair-grid">
          <DetailPair label="Böen" value={formatWindSpeed(current.windGustsKmH)} />
          <DetailPair
            label="Richtung"
            value={formatWindDirectionWithAngle(current.windDirectionDegrees)}
          />
        </dl>
      </section>

      {/* 2. Niederschlag */}
      <section className="card detail-section" aria-labelledby="precip-title">
        <h2 id="precip-title">Niederschlag</h2>
        <p className="section-main-value">{formatMm(current.precipitationMm)}</p>
        <dl className="detail-pair-grid">
          <DetailPair label="Regen" value={formatMm(current.rainMm)} />
          <DetailPair label="Schauer" value={formatMm(current.showersMm)} />
          <DetailPair label="Schnee" value={formatCm(current.snowfallCm)} />
          <DetailPair
            label="Nächste 6 Stunden"
            value={formatPercent(next6PrecipProb)}
            wide
          />
        </dl>
      </section>

      {/* 3. Luft & Atmosphäre */}
      <section className="card detail-section" aria-labelledby="air-title">
        <h2 id="air-title">Luft &amp; Atmosphäre</h2>
        <p className="section-main-value">{formatPercent(current.humidityPercent)}</p>
        <dl className="detail-pair-grid">
          <DetailPair label="Luftdruck (NN)" value={formatPressure(pressureVal)} />
          <DetailPair label="Wolken" value={formatPercent(current.cloudCoverPercent)} />
          <DetailPair label="Sicht" value={formatVisibility(current.visibilityMeters)} />
        </dl>
      </section>

      {/* 4. Sonne & Tag */}
      <section className="card detail-section" aria-labelledby="sun-title">
        <h2 id="sun-title">Sonne &amp; Tag</h2>
        <dl className="detail-pair-grid" style={{ paddingTop: 8 }}>
          <DetailPair label="Sonnenaufgang" value={formatTime(current.sunrise, timeZone)} />
          <DetailPair label="Sonnenuntergang" value={formatTime(current.sunset, timeZone)} />
          <DetailPair
            label="Tageslänge"
            value={formatDuration(current.daylightDurationSeconds)}
            wide
          />
        </dl>
      </section>
    </div>
  );
}
