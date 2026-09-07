'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { BentoHeroCard } from './BentoHeroCard';
import { BentoMetricsGrid } from './BentoMetricsGrid';
import { TemperatureTrendChart } from './TemperatureTrendChart';
import { ActivitySuitabilityCard } from './ActivitySuitabilityCard';
import { getActivityRecommendations } from '@/lib/weather/activities';
import { HourlyForecast } from '../forecast/HourlyForecast';
import { WeatherWarningsCard } from '../warnings/WeatherWarningsCard';

interface BentoDashboardProps {
  data: WeatherData;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function BentoDashboard({
  data,
  onRefresh,
  isRefreshing,
}: BentoDashboardProps) {
  const todayDaily = data.daily[0];
  const rainProb = todayDaily?.precipitationProbabilityPercent ?? 0;
  const recommendations = getActivityRecommendations(data.current, data.location, rainProb);

  return (
    <div className="bento-dashboard-layout">
      {/* 0. Amtliche Unwetterwarnungen (falls vorhanden) */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="bento-warnings-wrapper">
          <WeatherWarningsCard warnings={data.warnings} />
        </div>
      )}

      {/* 1. Bento Hero Card mit Wetter-Storytelling */}
      <BentoHeroCard
        current={data.current}
        location={data.location}
        fetchedAt={data.fetchedAt}
        todayDaily={todayDaily}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Stündliche 48h-Vorhersage */}
      <div className="bento-hourly-section">
        <HourlyForecast
          hours={data.hourly}
          timeZone={data.location.timezone}
        />
      </div>

      {/* 3. Responsive Bento Columns Grid */}
      <div className="bento-columns-grid">
        {/* 7-Tage-Temperaturtrend (Auf Mobile direkt nach Stündlich, auf Desktop links oben) */}
        <div className="bento-grid-item bento-trend-item">
          <TemperatureTrendChart
            daily={data.daily}
            timeZone={data.location.timezone}
          />
        </div>

        {/* 6-Kachel Telemetrie-Raster inkl. Luftqualität (Auf Mobile unter Trend, auf Desktop rechts) */}
        <div className="bento-grid-item bento-metrics-item">
          <BentoMetricsGrid
            current={data.current}
            todayDaily={todayDaily}
            timezone={data.location.timezone}
            airQuality={data.airQuality}
          />
        </div>

        {/* Lokale Aktivitäten & Empfehlungen OS/MS (Auf Mobile unten, auf Desktop links unter Trend) */}
        <div className="bento-grid-item bento-activities-item">
          <ActivitySuitabilityCard
            recommendations={recommendations}
            locationName={data.location.name}
          />
        </div>
      </div>
    </div>
  );
}
