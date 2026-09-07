'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Wetterdaten-Ladefehler:', error);
  }, [error]);

  return (
    <div className="page-shell">
      <main className="app main-flow" role="alert">
        <div
          className="notice error"
          style={{
            padding: '28px 24px',
            textAlign: 'center',
            marginTop: '48px',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }} aria-hidden="true">
            ⚠️
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 10px' }}>
            Wetterdaten vorübergehend nicht verfügbar
          </h2>
          <p style={{ margin: '0 0 24px', lineHeight: 1.55, opacity: 0.9 }}>
            Der Wetterdienst konnte vorübergehend nicht erreicht werden. Bitte überprüfe deine Internetverbindung oder lade die Daten neu.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: 'var(--accent-strong)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '0.95rem',
              fontWeight: 650,
              cursor: 'pointer',
            }}
          >
            Erneut versuchen
          </button>
        </div>
      </main>
    </div>
  );
}
