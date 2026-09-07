import React from 'react';
import { DailyForecastItem } from '@/types/weather';
import { WeatherIcon } from '../weather/WeatherGlyph';
import { formatTemperature } from '@/lib/weather/formatters';

interface TemperatureTrendChartProps {
  daily: DailyForecastItem[];
  timeZone?: string;
}

function getDayLabel(dateStr: string, index: number, timeZone = 'Europe/Berlin'): string {
  if (index === 0) return 'Heute';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('de-DE', { weekday: 'short', timeZone }).format(d);
  } catch {
    return `Tag ${index + 1}`;
  }
}

function generateBezierPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.45;
    const cpy1 = prev.y;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.45;
    const cpy2 = curr.y;
    path += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return path;
}

export function TemperatureTrendChart({
  daily,
  timeZone = 'Europe/Berlin',
}: TemperatureTrendChartProps) {
  // Take up to 7 days
  const days = daily.slice(0, 7);

  if (days.length === 0) {
    return null;
  }

  // Calculate global min and max for chart and range bars
  const allMax = days.map((d) => d.maxCelsius ?? 20);
  const allMin = days.map((d) => d.minCelsius ?? 10);
  const globalMin = Math.min(...allMin);
  const globalMax = Math.max(...allMax);
  const globalRange = Math.max(1, globalMax - globalMin);

  // Chart coordinates
  const svgWidth = 480;
  const svgHeight = 150;
  const paddingX = 32;
  const chartTop = 24;
  const chartHeight = 85;
  const stepX = days.length > 1 ? (svgWidth - paddingX * 2) / (days.length - 1) : 0;

  // Temperature to Y-coord
  const tempToY = (temp: number) => {
    // Add 2 deg margin top and bottom so lines don't clip
    const paddedMin = globalMin - 2;
    const paddedMax = globalMax + 3;
    const range = paddedMax - paddedMin;
    const pct = (temp - paddedMin) / range;
    return chartTop + (1 - pct) * chartHeight;
  };

  const maxPoints = days.map((d, i) => ({
    x: paddingX + i * stepX,
    y: tempToY(d.maxCelsius ?? 20),
    temp: d.maxCelsius,
    label: getDayLabel(d.date, i, timeZone),
  }));

  const minPoints = days.map((d, i) => ({
    x: paddingX + i * stepX,
    y: tempToY(d.minCelsius ?? 10),
    temp: d.minCelsius,
  }));

  const maxLinePath = generateBezierPath(maxPoints);
  const minLinePath = generateBezierPath(minPoints);

  // Area under curve
  const firstX = maxPoints[0].x;
  const lastX = maxPoints[maxPoints.length - 1].x;
  const baselineY = chartTop + chartHeight + 10;
  const maxAreaPath = `${maxLinePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
  const minAreaPath = `${minLinePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;

  return (
    <section className="bento-card trend-chart-card">
      <div className="bento-card-header trend-header">
        <span className="bento-title">7-TAGE-TREND</span>
        <div className="chart-legend" aria-hidden="true">
          <span className="legend-item legend-max">
            <span className="legend-dot dot-max" /> Max
          </span>
          <span className="legend-item legend-min">
            <span className="legend-dot dot-min" /> Min
          </span>
        </div>
      </div>

      {/* Responsive SVG Bézier Chart */}
      <div className="trend-svg-container" aria-label="7-Tage-Temperaturverlauf">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="trend-chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fills */}
          <path d={maxAreaPath} fill="url(#maxGradient)" />
          <path d={minAreaPath} fill="url(#minGradient)" />

          {/* Min Curve */}
          <path
            d={minLinePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Max Curve */}
          <path
            d={maxLinePath}
            fill="none"
            stroke="#fb923c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points and Temperature Text Labels */}
          {maxPoints.map((pt, i) => (
            <g key={`max-pt-${i}`}>
              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#fb923c" className="chart-point" />
              <text
                x={pt.x}
                y={pt.y - 8}
                textAnchor="middle"
                className="chart-temp-label max-label"
              >
                {formatTemperature(pt.temp)}
              </text>
              <text
                x={pt.x}
                y={svgHeight - 10}
                textAnchor="middle"
                className="chart-day-axis-label"
              >
                {pt.label}
              </text>
            </g>
          ))}

          {minPoints.map((pt, i) => (
            <g key={`min-pt-${i}`}>
              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#38bdf8" className="chart-point" />
              <text
                x={pt.x}
                y={pt.y + 14}
                textAnchor="middle"
                className="chart-temp-label min-label"
              >
                {formatTemperature(pt.temp)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Daily Forecast List with Temperature Span Bars */}
      <div className="trend-daily-list">
        {days.map((item, index) => {
          const dayName = getDayLabel(item.date, index, timeZone);
          const min = item.minCelsius ?? globalMin;
          const max = item.maxCelsius ?? globalMax;
          const rainProb = item.precipitationProbabilityPercent ?? 0;

          // Bar offset and width percentage
          const leftPercent = Math.max(0, ((min - globalMin) / globalRange) * 100);
          const barWidthPercent = Math.max(8, (((max - min) / globalRange) * 100));

          return (
            <div key={item.date} className="trend-row">
              <span className="trend-row-day">{dayName}</span>

              <div className="trend-row-condition">
                <span className="trend-row-icon">
                  <WeatherIcon glyphKind={item.condition.glyphKind} />
                </span>
                {rainProb > 0 ? (
                  <span className="trend-row-rain">
                    <svg viewBox="0 0 24 24" className="trend-drop-icon" aria-hidden="true">
                      <path
                        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                        fill="currentColor"
                      />
                    </svg>
                    {rainProb}%
                  </span>
                ) : (
                  <span className="trend-row-rain is-dry" />
                )}
              </div>

              <div className="trend-range-bar-cell">
                <span className="trend-val-min">{formatTemperature(item.minCelsius)}</span>
                <div className="trend-bar-track">
                  <div
                    className="trend-bar-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  />
                </div>
                <span className="trend-val-max">{formatTemperature(item.maxCelsius)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
