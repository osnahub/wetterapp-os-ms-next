# WetterApp

Moderne Wetteranwendung für **Osnabrück** und **Münster** mit stündlicher und 10-tägiger Vorhersage, amtlichen DWD-Warnungen, detaillierten meteorologischen Kennzahlen und europäischem Luftqualitätsindex.

## Funktionen

- **Echtzeit-Wetter**: Aktuelle Temperatur, gefühlte Temperatur, Tageshöchst- und Tiefstwerte sowie animierte Wettereffekte basierend auf WMO-Wetterzustand und Tageszeit.
- **Standortauswahl**: Schneller Wechsel zwischen vordefinierten Regionen (Osnabrück und Münster) mit Live-Aktualisierung.
- **Stündliche Vorhersage**: Horizontale, scrollbare und tastatursteuerbare 48-Stunden-Vorhersage mit Temperatur, Symbolen und Niederschlagswahrscheinlichkeit.
- **10-Tage-Trend**: Übersichtliche Tagesprognose mit Wochentag, Höchst-/Tiefstwerten, Wetterzustand, Niederschlagswahrscheinlichkeit und maximalen Windböen.
- **Meteorologische Details**: Vier strukturierte Kacheln für Wind (Böen & Windrichtung), Niederschlag (Regen, Schauer, Schnee & 6-Stunden-Trend), Luft & Atmosphäre (Luftdruck NN, Wolkenbedeckung, Sichtweite) sowie Sonne & Tag (Sonnenaufgang, Sonnenuntergang, Tageslänge).
- **Luftqualität**: Anzeige des europäischen Luftqualitätsindex (AQI) nach CAMS ENSEMBLE mit farblicher Einstufung und Ausweisung des Hauptschadstoffs.
- **Amtliche Unwetterwarnungen**: Vollständige Integration des Deutschen Wetterdienstes (DWD) mit Einstufung nach Schweregrad und aufklappbaren Handlungsempfehlungen.
- **Design & Barrierefreiheit**: Dynamisches Theming (Licht- und Dunkelmodus), Retina-optimierte SVG-Glyphen und vollständige ARIA-Auszeichnung.

## Technischer Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Sprache**: [TypeScript](https://www.typescriptlang.org/) (strikte Typisierung)
- **Bibliothek**: [React 19](https://react.dev/)
- **Styling**: Modulares CSS mit semantischen Custom Properties für Licht-/Dunkelmodus und dynamische Wetteranimationen
- **Datenquellen**:
  - Wetter- und Vorhersagedaten: [Open-Meteo API](https://open-meteo.com/)
  - Luftqualität: Copernicus Atmosphere Monitoring Service (CAMS ENSEMBLE via Open-Meteo)
  - Unwetterwarnungen: Deutscher Wetterdienst (DWD)

## Architektur

Die Anwendung trennt strikt zwischen Darstellung, Datenbeschaffung und Normalisierung:

```
src/
├── app/
│   ├── api/
│   │   └── weather/route.ts      # API Route Handler für Standortwechsel & Refresh
│   ├── globals.css               # Design-Tokens, Animationen & responsive Breakpoints
│   ├── layout.tsx                # App-Layout, PWA-Metadaten & Viewport
│   └── page.tsx                  # Server Component mit ISR-Caching
├── components/
│   ├── forecast/
│   │   ├── DailyForecast.tsx     # 10-Tage-Vorhersageliste
│   │   └── HourlyForecast.tsx    # Horizontale 48-Stunden-Leiste
│   ├── layout/
│   │   ├── Footer.tsx            # Quellennachweise & Lizenzhinweise
│   │   ├── Header.tsx            # App-Kopfzeile
│   │   └── LocationSwitcher.tsx  # Standort-Auswahlchips
│   ├── warnings/
│   │   └── WeatherWarningsCard.tsx # DWD-Warnungskarte
│   └── weather/
│       ├── AirQualityCard.tsx    # Luftqualitätskachel
│       ├── CurrentWeatherHero.tsx# Hero-Karte für aktuelles Wetter
│       ├── WeatherAppShell.tsx   # Client-Orchestrierung
│       ├── WeatherDetailsGrid.tsx# 4-teiliges Detailraster
│       └── WeatherGlyph.tsx      # SVG-Vektorglyphen
├── lib/
│   └── weather/
│       ├── constants.ts          # Standorte, WMO-Tabellen & AQI-Einstufungen
│       ├── formatters.ts         # Deutsche Zahlen- & Datumsformatierer
│       └── service.ts            # Datenbeschaffung & Normalisierungsschicht
└── types/
    └── weather.ts                # Interne Domänen-Typdefinitionen
```

## Lokale Entwicklung

Voraussetzungen: Node.js 18+ und npm.

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist anschließend unter `http://localhost:3000` erreichbar.

## Produktions-Build & Deployment

```bash
# Produktions-Build erstellen
npm run build

# Produktionsserver starten
npm run start
```

### Vercel Deployment

Das Projekt ist für den sofortigen Import und Betrieb auf **Vercel** konfiguriert:
1. Repository zu GitHub pushen.
2. Projekt in Vercel importieren (Next.js wird automatisch als Preset erkannt).
3. Build & Deploy durchführen (`npm run build`). Es sind keine manuellen Build-Befehle oder Sonderkonfigurationen erforderlich.
