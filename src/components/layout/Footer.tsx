import React from 'react';

export function Footer() {
  return (
    <footer className="site-footer">
      Wetterdaten:{' '}
      <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
        Open-Meteo
      </a>{' '}
      · Luftqualität:{' '}
      <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noopener noreferrer">
        CAMS ENSEMBLE
      </a>{' '}
      via{' '}
      <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
        Open-Meteo
      </a>{' '}
      · DWD-Warnungen: Deutscher Wetterdienst · Orte und Cache bleiben lokal.
    </footer>
  );
}
