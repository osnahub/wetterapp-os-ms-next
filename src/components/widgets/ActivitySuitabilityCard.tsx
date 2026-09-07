import React from 'react';
import { ActivityRecommendation } from '@/types/weather';

interface ActivitySuitabilityCardProps {
  recommendations: ActivityRecommendation[];
  locationName: string;
}

function ActivityIcon({ type }: { type: ActivityRecommendation['iconType'] }) {
  switch (type) {
    case 'landmark':
      return (
        <svg viewBox="0 0 24 24" className="activity-icon" aria-hidden="true">
          <path
            d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10h20L12 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'zoo':
      return (
        <svg viewBox="0 0 24 24" className="activity-icon" aria-hidden="true">
          <circle cx="12" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="7" cy="8" r="2" fill="currentColor" />
          <circle cx="17" cy="8" r="2" fill="currentColor" />
          <circle cx="10" cy="5" r="1.5" fill="currentColor" />
          <circle cx="14" cy="5" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'lake':
      return (
        <svg viewBox="0 0 24 24" className="activity-icon" aria-hidden="true">
          <path
            d="M2 18c2.5 0 2.5-1.5 5-1.5s2.5 1.5 5 1.5 2.5-1.5 5-1.5 2.5 1.5 5 1.5M2 21c2.5 0 2.5-1.5 5-1.5s2.5 1.5 5 1.5 2.5-1.5 5-1.5 2.5 1.5 5 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M12 4v9M12 5l6 6h-6M8 13l4-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'museum':
      return (
        <svg viewBox="0 0 24 24" className="activity-icon" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
          <path
            d="M21 16l-5-5-8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'umbrella':
      return (
        <svg viewBox="0 0 24 24" className="activity-icon" aria-hidden="true">
          <path
            d="M12 3v13m0 0a3 3 0 0 1-3 3M3 13a9 9 0 0 1 18 0H3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function ActivitySuitabilityCard({
  recommendations,
  locationName,
}: ActivitySuitabilityCardProps) {
  return (
    <section className="bento-card activity-card">
      <div className="bento-card-header">
        <span className="bento-title">LOKALE AKTIVITÄTEN & EMPFEHLUNGEN</span>
        <span className="bento-subtitle-badge">{locationName}</span>
      </div>

      <ul className="activity-list" role="list">
        {recommendations.map((item) => (
          <li key={item.id} className="activity-item">
            <div className="activity-icon-box">
              <ActivityIcon type={item.iconType} />
            </div>

            <div className="activity-info">
              <div className="activity-header-row">
                <span className="activity-title">{item.title}</span>
                <span className={`activity-badge badge-${item.badgeVariant}`}>
                  {item.badgeText}
                </span>
              </div>
              <p className="activity-sub">{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
