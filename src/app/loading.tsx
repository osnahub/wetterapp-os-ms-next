import React from 'react';

export default function Loading() {
  return (
    <div className="page-shell">
      <main className="app main-flow" aria-label="Wetterdaten werden geladen">
        <div className="app-skeleton" aria-busy="true" aria-live="polite">
          <div className="skeleton-hero" />
          <div className="skeleton-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </main>
    </div>
  );
}
