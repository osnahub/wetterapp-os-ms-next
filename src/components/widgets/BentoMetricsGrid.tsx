import React from 'react';
import { CurrentWeather, DailyForecastItem, AirQualityData } from '@/types/weather';
import {
  formatPercent,
  formatPressure,
  formatVisibility,
  formatTemperature,
  formatWindDirectionCompass,
  formatNumber,
} from '@/lib/weather/formatters';
import { POLLUTANT_NAMES } from '@/lib/weather/constants';
import { SunArcCard } from './SunArcCard';

interface BentoMetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  timezone: string;
  airQuality?: AirQualityData | null;
}

function getUvDetails(uv: number | null): { label: string; advice: string } {
  if (uv == null) return { label: 'Keine Daten', advice: 'Keine Messdaten verfügbar.' };
  if (uv < 3) {
    return { label: 'Niedrig', advice: 'Kein besonderer Schutz erforderlich.' };
  }
  if (uv < 6) {
    return { label: 'Mittel', advice: 'Mittags Schatten suchen, Sonnenschutz nutzen.' };
  }
  if (uv < 8) {
    return { label: 'Hoch', advice: 'Bis 16:00 Uhr Sonnenschutz verwenden.' };
  }
  if (uv < 11) {
    return { label: 'Sehr hoch', advice: 'Aufenthalt im Freien zur Mittagszeit meiden!' };
  }
  return { label: 'Extrem', advice: 'Schutzmaßnahmen dringend einhalten!' };
}

export function BentoMetricsGrid({
  current,
  todayDaily,
  timezone,
  airQuality,
}: BentoMetricsGridProps) {
  // 1. Niederschlag
  const precipMm = current.precipitationMm ?? 0;
  const rainProb = todayDaily?.precipitationProbabilityPercent ?? 0;
  let precipAdvice = 'In den nächsten Stunden bleibt es voraussichtlich trocken.';
  if (precipMm > 0.5) {
    precipAdvice = 'Aktuell regnerische Bedingungen.';
  } else if (rainProb >= 50) {
    precipAdvice = 'Im weiteren Tagesverlauf sind Regenschauer zu erwarten.';
  } else if (rainProb >= 20) {
    precipAdvice = 'Gelegentliche Schauer nicht ausgeschlossen.';
  }

  // 2. Wind
  const windSpeed = current.windKmH != null ? Math.round(current.windKmH) : null;
  const windGusts = current.windGustsKmH != null ? Math.round(current.windGustsKmH) : windSpeed;
  const windCompass = formatWindDirectionCompass(current.windDirectionDegrees);
  const windDegrees = current.windDirectionDegrees ?? 0;

  // 3. UV-Index
  const uvValue = current.uvIndex != null ? Math.round(current.uvIndex) : null;
  const { label: uvLabel, advice: uvAdvice } = getUvDetails(current.uvIndex);
  const uvProgressPercent = current.uvIndex != null
    ? Math.min(100, Math.max(0, (current.uvIndex / 11) * 100))
    : 0;

  // 4. Luftqualität (AQI)
  const aqiCurrent = airQuality?.current;
  const aqiValue = aqiCurrent?.europeanAqi != null ? Math.round(aqiCurrent.europeanAqi) : null;
  const aqiCategoryLabel = aqiCurrent?.categoryLabel ?? '–';
  const aqiProgressPercent = aqiValue != null
    ? Math.min(100, Math.max(0, (aqiValue / 100) * 100))
    : 0;
  const aqiCategory = aqiCurrent?.category ?? 'good';
  const primaryPollutantName = aqiCurrent?.primaryPollutant
    ? POLLUTANT_NAMES[aqiCurrent.primaryPollutant] ?? aqiCurrent.primaryPollutant
    : null;
  const aqiFootnote = primaryPollutantName
    ? `Hauptschadstoff: ${primaryPollutantName}`
    : 'Geringe Schadstoffbelastung.';

  return (
    <div className="bento-metrics-grid">
      {/* 1. Niederschlag Card */}
      <section className="bento-card">
        <div className="bento-card-header">
          <span className="bento-title">NIEDERSCHLAG</span>
        </div>
        <div className="bento-card-body">
          <div className="bento-metric-large">
            <span className="bento-metric-value">
              {formatNumber(precipMm, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mm
            </span>
            <span className="bento-metric-status">
              Regenrisiko: {rainProb} %
            </span>
          </div>

          <div className="bento-progress-track rain-track" aria-hidden="true">
            <div
              className="bento-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, rainProb))}%` }}
            />
          </div>

          <p className="bento-card-footnote">{precipAdvice}</p>
        </div>
      </section>

      {/* 2. Wind Card */}
      <section className="bento-card wind-card">
        <div className="bento-card-header">
          <span className="bento-title">WIND</span>
        </div>
        <div className="bento-card-body bento-wind-body">
          <div className="bento-wind-info">
            <div className="bento-metric-large">
              <span className="bento-metric-value">
                {windSpeed != null ? `${windSpeed} km/h` : '–'}
              </span>
            </div>
            <p className="bento-wind-sub">
              Böen bis {windGusts != null ? `${windGusts} km/h` : '–'} • {windCompass}
            </p>
          </div>

          <div className="bento-compass-wrapper" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="bento-compass-svg">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.2"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.3"
              />
              {/* Kardinalpunkte */}
              <text x="50" y="15" textAnchor="middle" className="compass-label">N</text>
              <text x="89" y="54" textAnchor="middle" className="compass-label">O</text>
              <text x="50" y="92" textAnchor="middle" className="compass-label">S</text>
              <text x="11" y="54" textAnchor="middle" className="compass-label">W</text>

              {/* Kompassnadel */}
              <g transform={`rotate(${windDegrees} 50 50)`}>
                <polygon
                  points="50,22 55,50 50,45 45,50"
                  fill="#60a5fa"
                />
                <polygon
                  points="50,78 54,50 50,55 46,50"
                  fill="rgba(255,255,255,0.25)"
                />
                <circle cx="50" cy="50" r="3" fill="#ffffff" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 3. UV-Index Card */}
      <section className="bento-card">
        <div className="bento-card-header">
          <span className="bento-title">UV-INDEX</span>
        </div>
        <div className="bento-card-body">
          <div className="bento-metric-large">
            <span className="bento-metric-value">{uvValue ?? '–'}</span>
            <span className="bento-metric-status">{uvLabel}</span>
          </div>

          <div className="bento-progress-track uv-track" aria-hidden="true">
            <div
              className="bento-progress-pin"
              style={{ left: `${uvProgressPercent}%` }}
            />
          </div>

          <p className="bento-card-footnote">{uvAdvice}</p>
        </div>
      </section>

      {/* 4. Luftqualität (AQI) Card */}
      <section className="bento-card">
        <div className="bento-card-header">
          <span className="bento-title">LUFTQUALITÄT</span>
        </div>
        <div className="bento-card-body">
          <div className="bento-metric-large">
            <span className="bento-metric-value">{aqiValue ?? '–'}</span>
            <span className="bento-metric-status" style={{ color: `var(--aqi-${aqiCategory})` }}>
              {aqiCategoryLabel}
            </span>
          </div>

          <div className="bento-progress-track aqi-track" aria-hidden="true">
            <div
              className="bento-progress-pin"
              style={{ left: `${aqiProgressPercent}%` }}
            />
          </div>

          <p className="bento-card-footnote">{aqiFootnote}</p>
        </div>
      </section>

      {/* 5. Sun Arc Card */}
      <SunArcCard
        sunrise={current.sunrise ?? todayDaily?.sunrise ?? null}
        sunset={current.sunset ?? todayDaily?.sunset ?? null}
        currentTime={current.time}
        timeZone={timezone}
      />

      {/* 6. Atmosphäre Card */}
      <section className="bento-card atmosphere-card">
        <div className="bento-card-header">
          <span className="bento-title">ATMOSPHÄRE</span>
        </div>
        <div className="bento-card-body">
          <div className="atmosphere-grid">
            <div className="atmosphere-item">
              <span className="atmosphere-label">Feuchtigkeit</span>
              <strong className="atmosphere-value">
                {formatPercent(current.humidityPercent)}
              </strong>
            </div>
            <div className="atmosphere-item">
              <span className="atmosphere-label">Luftdruck</span>
              <strong className="atmosphere-value">
                {formatPressure(current.pressureHpa)}
              </strong>
            </div>
            <div className="atmosphere-item">
              <span className="atmosphere-label">Sichtweite</span>
              <strong className="atmosphere-value">
                {formatVisibility(current.visibilityMeters)}
              </strong>
            </div>
            <div className="atmosphere-item">
              <span className="atmosphere-label">Taupunkt</span>
              <strong className="atmosphere-value">
                {current.dewPointCelsius != null
                  ? `${formatTemperature(current.dewPointCelsius)}C`
                  : '–'}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
