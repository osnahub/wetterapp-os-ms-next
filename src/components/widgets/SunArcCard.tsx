import React from 'react';
import { formatTime } from '@/lib/weather/formatters';

interface SunArcCardProps {
  sunrise: string | null;
  sunset: string | null;
  currentTime?: string;
  timeZone?: string;
}

export function SunArcCard({
  sunrise,
  sunset,
  currentTime,
  timeZone = 'Europe/Berlin',
}: SunArcCardProps) {
  // Calculate sun position along arc (0 = sunrise, 1 = sunset)
  let progress = 0.5; // fallback middle

  if (sunrise && sunset) {
    const sunriseTs = new Date(sunrise).getTime();
    const sunsetTs = new Date(sunset).getTime();
    const nowTs = currentTime ? new Date(currentTime).getTime() : Date.now();

    if (nowTs <= sunriseTs) {
      progress = 0;
    } else if (nowTs >= sunsetTs) {
      progress = 1;
    } else {
      progress = (nowTs - sunriseTs) / (sunsetTs - sunriseTs);
    }
  }

  // Semicircle arc: center (75, 55), radius 48.
  // Angle from Math.PI (sunrise/left) to 0 (sunset/right)
  const angle = Math.PI - progress * Math.PI;
  const cx = 75;
  const cy = 55;
  const r = 48;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const sunriseFormatted = formatTime(sunrise, timeZone);
  const sunsetFormatted = formatTime(sunset, timeZone);

  return (
    <section className="bento-card sun-arc-card">
      <div className="bento-card-header">
        <span className="bento-title">SONNENUNTERGANG</span>
      </div>

      <div className="sun-arc-body">
        <div className="sun-arc-info">
          <p className="sun-arc-main-time">{sunsetFormatted} Uhr</p>
          <p className="sun-arc-sub">Sonnenaufgang: {sunriseFormatted} Uhr</p>
        </div>

        <div className="sun-arc-visual" aria-hidden="true">
          <svg viewBox="0 0 150 70" className="sun-arc-svg">
            {/* Base dashed arc */}
            <path
              d="M 27,55 A 48,48 0 0,1 123,55"
              fill="none"
              stroke="#ffd16644"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            {/* Horizon baseline */}
            <line
              x1="18"
              y1="56"
              x2="132"
              y2="56"
              stroke="#ffffff1c"
              strokeWidth="1"
            />
            {/* Sun position marker */}
            <circle cx={sunX} cy={sunY} r="5.5" fill="#ffd166" className="sun-dot" />
            <circle
              cx={sunX}
              cy={sunY}
              r="9"
              fill="none"
              stroke="#ffd16666"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
