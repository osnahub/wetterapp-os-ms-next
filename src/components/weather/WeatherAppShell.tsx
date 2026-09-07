'use client';

import React, { useState, useCallback, useTransition } from 'react';
import { WeatherData, WeatherLocation } from '@/types/weather';
import { resolveWeatherScene, resolveDayPhase } from '@/lib/weather/constants';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { BentoDashboard } from '../widgets/BentoDashboard';

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

        <BentoDashboard
          data={data}
          onRefresh={handleRefresh}
          isRefreshing={isPending}
        />
      </main>

      <Footer />
    </div>
  );
}
