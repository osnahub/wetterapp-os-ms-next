'use client';

import React, { useState, useCallback, useTransition } from 'react';
import { WeatherData, WeatherLocation } from '@/types/weather';
import { resolveWeatherScene, resolveDayPhase } from '@/lib/weather/constants';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { CurrentWeatherHero } from './CurrentWeatherHero';
import { WeatherWarningsCard } from '../warnings/WeatherWarningsCard';
import { HourlyForecast } from '../forecast/HourlyForecast';
import { DailyForecast } from '../forecast/DailyForecast';
import { WeatherDetailsGrid } from './WeatherDetailsGrid';
import { AirQualityCard } from './AirQualityCard';

interface WeatherAppShellProps {
  initialData: WeatherData;
  locations: WeatherLocation[];
}

export function WeatherAppShell({ initialData, locations }: WeatherAppShellProps) {
  const [data, setData] = useState<WeatherData>(initialData);
  const [activeLocation, setActiveLocation] = useState<WeatherLocation>(initialData.location);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchForLocation = useCallback(
    async (loc: WeatherLocation) => {
      setError(null);
      try {
        const res = await fetch(`/api/weather?id=${encodeURIComponent(loc.id)}`);
        if (!res.ok) {
          throw new Error(`Fehler beim Aktualisieren der Daten (${res.status})`);
        }
        const freshData: WeatherData = await res.json();
        setData(freshData);
      } catch (err: any) {
        setError(err?.message || 'Daten konnten nicht aktualisiert werden');
      }
    },
    []
  );

  const handleSelectLocation = useCallback(
    (loc: WeatherLocation) => {
      setActiveLocation(loc);
      startTransition(() => {
        fetchForLocation(loc);
      });
    },
    [fetchForLocation]
  );

  const handleRefresh = useCallback(() => {
    startTransition(() => {
      fetchForLocation(activeLocation);
    });
  }, [activeLocation, fetchForLocation]);

  const sceneKind = resolveWeatherScene(data?.current?.condition?.code);
  const dayPhase = resolveDayPhase(data?.current?.isDay);

  return (
    <div
      className="page-shell"
      data-weather={sceneKind}
      data-day-phase={dayPhase}
    >
      <Header
        locations={locations}
        activeLocation={activeLocation}
        onSelectLocation={handleSelectLocation}
      />

      <main className="app main-flow" aria-labelledby="app-title">
        {error && (
          <section className="notice error" role="alert">
            <p>{error}</p>
          </section>
        )}

        {/* Current Weather Hero */}
        <CurrentWeatherHero
          current={data.current}
          location={data.location}
          fetchedAt={data.fetchedAt}
          onRefresh={handleRefresh}
          isRefreshing={isPending}
        />

        {/* Warnings Card */}
        {data.warnings && data.warnings.length > 0 && (
          <WeatherWarningsCard
            warnings={data.warnings}
            timeZone={data.location.timezone}
          />
        )}

        {/* Hourly Forecast */}
        <HourlyForecast
          hours={data.hourly}
          timeZone={data.location.timezone}
        />

        {/* Daily Forecast */}
        <DailyForecast
          days={data.daily}
          timeZone={data.location.timezone}
        />

        {/* Weather Details (4 sections) */}
        <WeatherDetailsGrid
          current={data.current}
          hourly={data.hourly}
          timeZone={data.location.timezone}
        />

        {/* Air Quality Card */}
        <AirQualityCard data={data.airQuality} />
      </main>

      <Footer />
    </div>
  );
}
