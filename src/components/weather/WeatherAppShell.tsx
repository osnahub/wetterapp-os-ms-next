'use client';

import React, { useState, useCallback, useEffect, useTransition } from 'react';
import { WeatherData, WeatherLocation } from '@/types/weather';
import { resolveWeatherScene, resolveDayPhase } from '@/lib/weather/constants';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { BentoDashboard } from '../widgets/BentoDashboard';

const CACHE_KEY_PREFIX = 'wetterapp_cache_';

function saveToLocalCache(locId: string, data: WeatherData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${CACHE_KEY_PREFIX}${locId}`, JSON.stringify(data));
  } catch {
    // QuotaExceeded or disabled storage
  }
}

function loadFromLocalCache(locId: string): WeatherData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${locId}`);
    if (!raw) return null;
    return JSON.parse(raw) as WeatherData;
  } catch {
    return null;
  }
}

interface WeatherAppShellProps {
  initialData: WeatherData;
  locations: WeatherLocation[];
}

export function WeatherAppShell({ initialData, locations }: WeatherAppShellProps) {
  const [data, setData] = useState<WeatherData>(initialData);
  const [activeLocation, setActiveLocation] = useState<WeatherLocation>(initialData.location);
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ type: 'warning' | 'error'; message: string } | null>(null);

  // Persist initial data snapshot to local cache on mount
  useEffect(() => {
    if (initialData?.location?.id) {
      saveToLocalCache(initialData.location.id, initialData);
    }
  }, [initialData]);

  const fetchForLocation = useCallback(
    async (loc: WeatherLocation) => {
      setNotice(null);
      try {
        const res = await fetch(`/api/weather?id=${encodeURIComponent(loc.id)}`, {
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
          throw new Error(`Fehler beim Aktualisieren der Daten (HTTP ${res.status})`);
        }
        const freshData: WeatherData = await res.json();
        setData(freshData);
        setActiveLocation(loc);
        saveToLocalCache(loc.id, freshData);
      } catch (err: any) {
        // Attempt to load from offline cache
        const cached = loadFromLocalCache(loc.id);
        if (cached) {
          setData(cached);
          setActiveLocation(loc);
          setNotice({
            type: 'warning',
            message: `Offline-Modus aktiv: Zeige lokal zwischengespeicherten Datenstand für ${loc.name}.`,
          });
        } else {
          setNotice({
            type: 'error',
            message: err?.message || 'Wetterdaten konnten nicht aktualisiert werden.',
          });
        }
      }
    },
    []
  );

  const handleSelectLocation = useCallback(
    (loc: WeatherLocation) => {
      // Optimistic cache preview for instant responsiveness
      const cached = loadFromLocalCache(loc.id);
      if (cached) {
        setData(cached);
        setActiveLocation(loc);
      }
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
        {notice && (
          <section className={`notice ${notice.type}`} role="alert">
            <p>{notice.message}</p>
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
