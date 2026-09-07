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
    <nav className="segmented-location-nav" aria-label="Standortauswahl">
      <div className="segmented-location-control" role="group" aria-label="Ort auswählen">
        {locations.map((loc) => {
          const isActive = loc.id === activeLocation.id;
          const fullLabel = [loc.name, loc.admin1].filter(Boolean).join(', ');
          const ariaLabel = `${fullLabel}${isActive ? ', aktuell ausgewählt' : ', als aktiven Standort auswählen'}`;

          return (
            <button
              key={loc.id}
              className={`segmented-location-btn ${isActive ? 'is-active' : ''}`}
              type="button"
              aria-pressed={isActive}
              aria-label={ariaLabel}
              onClick={() => onSelect(loc)}
            >
              {isActive && (
                <span className="segmented-active-dot" aria-hidden="true" />
              )}
              <span className="segmented-label">{loc.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
