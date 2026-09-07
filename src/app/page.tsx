import React from 'react';
import { fetchWeatherData } from '@/lib/weather/service';
import { DEFAULT_LOCATIONS } from '@/lib/weather/constants';
import { WeatherAppShell } from '@/components/weather/WeatherAppShell';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const defaultLocation = DEFAULT_LOCATIONS[0];
  const initialData = await fetchWeatherData(defaultLocation);

  return (
    <WeatherAppShell
      initialData={initialData}
      locations={DEFAULT_LOCATIONS}
    />
  );
}
