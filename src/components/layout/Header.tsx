'use client';

import React from 'react';
import Image from 'next/image';
import { WeatherLocation } from '@/types/weather';
import { LocationSwitcher } from './LocationSwitcher';

interface HeaderProps {
  locations: WeatherLocation[];
  activeLocation: WeatherLocation;
  onSelectLocation: (location: WeatherLocation) => void;
  viewMode?: 'classic' | 'bento';
  onToggleViewMode?: (mode: 'classic' | 'bento') => void;
}

export function Header({
  locations,
  activeLocation,
  onSelectLocation,
  viewMode = 'bento',
  onToggleViewMode,
}: HeaderProps) {
  return (
    <header className="site-header" role="banner">
      <div className="app simple-header">
        <h1 className="app-title" id="app-title">
          <Image
            className="app-mark"
            src="/app-icon-64x64.png"
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
          />
          <span>WetterApp</span>
        </h1>

        <div className="header-controls">
          {onToggleViewMode && (
            <div className="view-mode-toggle" role="group" aria-label="Ansicht wählen">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'classic' ? 'is-active' : ''}`}
                onClick={() => onToggleViewMode('classic')}
                aria-pressed={viewMode === 'classic'}
              >
                Klassisch
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'bento' ? 'is-active' : ''}`}
                onClick={() => onToggleViewMode('bento')}
                aria-pressed={viewMode === 'bento'}
              >
                Bento Modern
              </button>
            </div>
          )}

          <LocationSwitcher
            locations={locations}
            activeLocation={activeLocation}
            onSelect={onSelectLocation}
          />
        </div>
      </div>
    </header>
  );
}

