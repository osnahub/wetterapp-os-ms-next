'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { BentoHeroCard } from './BentoHeroCard';
import { BentoMetricsGrid } from './BentoMetricsGrid';
import { TemperatureTrendChart } from './TemperatureTrendChart';
import { ActivitySuitabilityCard } from './ActivitySuitabilityCard';
import { getActivityRecommendations } from '@/lib/weather/activities';
import { WeatherWarningsCard } from '../warnings/WeatherWarningsCard';
import { AirQualityCard } from '../weather/AirQualityCard';

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
  const rainProb = data.daily[0]?.precipitationProbabilityPercent ?? 0;
  const recommendations = getActivityRecommendations(data.current, data.location, rainProb);

  return (
    <div className="bento-dashboard-layout">
      {data.warnings && data.warnings.length > 0 && (
        <div className="bento-warnings-wrapper">
          <WeatherWarningsCard warnings={data.warnings} />
        </div>
      )}

      {/* Top Hero Section */}
      <BentoHeroCard
        current={data.current}
        location={data.location}
        fetchedAt={data.fetchedAt}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Bento Grid: 2 Columns on Desktop */}
      <div className="bento-columns-grid">
        {/* Left Column: Telemetry & Activities */}
        <div className="bento-left-column">
          <BentoMetricsGrid
            current={data.current}
            todayDaily={data.daily[0]}
            timezone={data.location.timezone}
          />
          <ActivitySuitabilityCard
            recommendations={recommendations}
            locationName={data.location.name}
          />
        </div>

        {/* Right Column: 7-Day Trend Chart & Daily Range Rows */}
        <div className="bento-right-column">
          <TemperatureTrendChart
            daily={data.daily}
            timeZone={data.location.timezone}
          />
          {data.airQuality && (
            <AirQualityCard data={data.airQuality} />
          )}
        </div>
      </div>
    </div>
  );
}

