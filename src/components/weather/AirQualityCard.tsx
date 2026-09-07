import React from 'react';
import { AirQualityData } from '@/types/weather';
import { POLLUTANT_NAMES } from '@/lib/weather/constants';
import { formatNumber } from '@/lib/weather/formatters';

interface AirQualityCardProps {
  data?: AirQualityData | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AirQualityCard({ data, isLoading = false, error = null }: AirQualityCardProps) {
  if (isLoading && !data) {
    return (
      <section className="card air-quality-card" aria-busy="true">
        <h2>Luftqualität</h2>
        <p className="air-quality-empty">Luftqualitätsdaten werden geladen …</p>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="card air-quality-card">
        <h2>Luftqualität</h2>
        <p className="air-quality-empty">{error}</p>
      </section>
    );
  }

  if (!data?.current) {
    return (
      <section className="card air-quality-card">
        <h2>Luftqualität</h2>
        <p className="air-quality-empty">Luftqualitätsdaten sind derzeit nicht verfügbar.</p>
      </section>
    );
  }

  const current = data.current;
  const aqiClass = `aqi-${current.category}`;
  const primaryName = current.primaryPollutant
    ? POLLUTANT_NAMES[current.primaryPollutant] ?? current.primaryPollutant
    : null;

  return (
    <section className={`card air-quality-card ${aqiClass}`}>
      <h2>Luftqualität</h2>
      <p
        className="air-quality-main"
        aria-label={`Europäischer Luftqualitätsindex ${formatNumber(current.europeanAqi)}, Kategorie ${current.categoryLabel}.`}
      >
        <span>{current.categoryLabel}</span>
      </p>

      {primaryName && (
        <p className="air-quality-primary">
          Hauptschadstoff: {primaryName}
        </p>
      )}

      <p className="air-quality-trend">
        Europäischer Luftqualitätsindex (AQI): {formatNumber(current.europeanAqi)}
      </p>
    </section>
  );
}
