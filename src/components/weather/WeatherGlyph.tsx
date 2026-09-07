import React from 'react';
import { WeatherGlyphKind } from '@/types/weather';

interface WeatherGlyphProps {
  kind: WeatherGlyphKind;
}

function SunGlyph({ compact = false }: { compact?: boolean }) {
  return (
    <g className="weather-glyph-sun" transform={compact ? 'translate(-5 -5) scale(.78)' : undefined}>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4" />
    </g>
  );
}

function CloudGlyph({ shifted = false }: { shifted?: boolean }) {
  return (
    <path
      className="weather-glyph-cloud"
      transform={shifted ? 'translate(4 6)' : 'translate(0 3)'}
      d="M12 32h24a7 7 0 0 0 .4-14 12 12 0 0 0-22-2.3A8.2 8.2 0 0 0 12 32Z"
    />
  );
}

export function WeatherGlyph({ kind }: WeatherGlyphProps) {
  switch (kind) {
    case 'clear':
      return <SunGlyph />;
    case 'partly-cloudy':
      return (
        <>
          <SunGlyph compact />
          <CloudGlyph shifted />
        </>
      );
    case 'cloudy':
      return <CloudGlyph />;
    case 'rain':
      return (
        <>
          <CloudGlyph />
          <path className="weather-glyph-rain" d="M17 37l-2 5M26 37l-2 5M35 37l-2 5" />
        </>
      );
    case 'snow':
      return (
        <>
          <CloudGlyph />
          <path className="weather-glyph-snow" d="M17 37v6M14 40h6M29 37v6M26 40h6" />
        </>
      );
    case 'fog':
      return (
        <>
          <CloudGlyph />
          <path className="weather-glyph-fog" d="M8 37h32M12 42h24" />
        </>
      );
    case 'storm':
      return (
        <>
          <CloudGlyph />
          <path className="weather-glyph-storm" d="M25 34l-5 8h5l-2 5 9-10h-6l3-3Z" />
        </>
      );
    default:
      return (
        <>
          <circle className="weather-glyph-unknown" cx="24" cy="24" r="17" />
          <path className="weather-glyph-unknown-mark" d="M19 18a5 5 0 1 1 7 4.6c-2 1-2 2-2 4M24 33h.01" />
        </>
      );
  }
}

export function WeatherIcon({
  glyphKind,
  className = 'weather-icon',
}: {
  glyphKind: WeatherGlyphKind;
  className?: string;
}) {
  return (
    <span className={className} aria-hidden="true">
      <svg className="weather-icon-svg" viewBox="0 0 48 48" focusable="false">
        <WeatherGlyph kind={glyphKind} />
      </svg>
    </span>
  );
}
