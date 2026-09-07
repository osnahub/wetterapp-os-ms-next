import React from 'react';
import { DwdWarning } from '@/types/weather';
import { formatDateTime } from '@/lib/weather/formatters';

interface WeatherWarningsCardProps {
  warnings: DwdWarning[];
  timeZone?: string;
}

export function WeatherWarningsCard({ warnings, timeZone = 'Europe/Berlin' }: WeatherWarningsCardProps) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <section className="card warning-card" aria-labelledby="warnings-title">
      <h2 id="warnings-title">Amtliche Wetterwarnungen</h2>
      <div>
        {warnings.map((w) => {
          const severityClass = `warning-${w.severity}`;
          const startStr = formatDateTime(w.start, timeZone);
          const endStr = formatDateTime(w.end, timeZone);

          return (
            <div key={w.id || `${w.event}-${w.start}`} className={`warning-item ${severityClass}`}>
              <h3 className="warning-title">{w.headline || w.event}</h3>
              <p className="warning-meta">
                Gültig von {startStr} bis {endStr}
              </p>
              {w.description && (
                <details>
                  <summary>Details & Handlungsempfehlungen</summary>
                  <p>{w.description}</p>
                  {w.instruction && <p><strong>Hinweis:</strong> {w.instruction}</p>}
                </details>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
