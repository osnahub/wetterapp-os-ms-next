'use client';

import React from 'react';
import { WeatherLocation } from '@/types/weather';

interface LocationSwitcherProps {
  locations: WeatherLocation[];
  activeLocation: WeatherLocation;
  onSelect: (location: WeatherLocation) => void;
}

export function LocationSwitcher({
  locations,
  activeLocation,
  onSelect,
}: LocationSwitcherProps) {
  return (
    <div className="quick-location-card">
      <div className="quick-location-list" role="group" aria-label="Ort auswählen">
        {locations.map((loc) => {
          const isActive = loc.id === activeLocation.id;
          const fullLabel = [loc.name, loc.admin1].filter(Boolean).join(', ');
          const ariaLabel = `${fullLabel}${isActive ? ', aktuell aktiv' : ', als aktiven Ort auswählen'}`;

          return (
            <button
              key={loc.id}
              className="quick-location-chip"
              type="button"
              aria-pressed={isActive}
              aria-label={ariaLabel}
              onClick={() => onSelect(loc)}
            >
              {isActive && (
                <span className="quick-location-check" aria-hidden="true">
                  ✓
                </span>
              )}
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
