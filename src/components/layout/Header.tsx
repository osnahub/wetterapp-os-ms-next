'use client';

import React from 'react';
import Image from 'next/image';
import { WeatherLocation } from '@/types/weather';
import { LocationSwitcher } from './LocationSwitcher';

interface HeaderProps {
  locations: WeatherLocation[];
  activeLocation: WeatherLocation;
  onSelectLocation: (location: WeatherLocation) => void;
}

export function Header({
  locations,
  activeLocation,
  onSelectLocation,
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

