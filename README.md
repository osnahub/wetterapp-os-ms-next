# WetterApp

Moderne Wetteranwendung für **Osnabrück** und **Münster** mit stündlicher und 10-tägiger Vorhersage, amtlichen DWD-Warnungen, detaillierten meteorologischen Kennzahlen und europäischem Luftqualitätsindex.

## Funktionen

- **Dual-View Dashboard**: Wählbar zwischen klassischer Wetterübersicht und moderner **Bento Modern** Ansicht mit responsiven Kacheln, Tiefenwirkung und Glassmorphismus.
- **Echtzeit-Wetter**: Aktuelle Temperatur, gefühlte Temperatur, Tageshöchst- und Tiefstwerte sowie animierte Wettereffekte basierend auf WMO-Wetterzustand und Tageszeit.
- **Standortauswahl**: Schneller Wechsel zwischen vordefinierten Regionen (Osnabrück und Münster) mit Live-Aktualisierung.
- **Sonnenverlauf (Sun Arc)**: Mathematisch exakte SVG-Sonnenbahn mit tageszeitlicher Positionierung und Sonnenzeiten.
- **7-Tage-Temperaturtrend**: Reines SVG mit kubischen Bézier-Kurven für Höchst- und Tiefsttemperaturen sowie tägliche Temperatur-Spannebalken.
- **Lokale Freizeit- & Aktivitätsempfehlungen**: Kontextsensitive Eignungsprüfung für Sehenswürdigkeiten und Aktivitäten in Osnabrück und Münster (z. B. Wochenmarkt, Allwetterzoo, Aasee, Museen).
- **Stündliche Vorhersage**: Horizontale, scrollbare und tastatursteuerbare 48-Stunden-Vorhersage mit Temperatur, Symbolen und Niederschlagswahrscheinlichkeit.
- **10-Tage-Trend**: Übersichtliche Tagesprognose mit Wochentag, Höchst-/Tiefstwerten, Wetterzustand, Niederschlagswahrscheinlichkeit und maximalen Windböen.
- **Meteorologische Details**: Strukturierte Kacheln für UV-Index, Wind & Böen, Niederschlagsrisiko, Luftfeuchtigkeit, Luftdruck, Sichtweite und Taupunkt.
- **Luftqualität**: Anzeige des europäischen Luftqualitätsindex (AQI) nach CAMS ENSEMBLE mit farblicher Einstufung und Ausweisung des Hauptschadstoffs.
- **Amtliche Unwetterwarnungen**: Vollständige Integration des Deutschen Wetterdienstes (DWD) mit Einstufung nach Schweregrad und aufklappbaren Handlungsempfehlungen.
- **Design & Barrierefreiheit**: Dynamisches Theming (Licht- und Dunkelmodus), Retina-optimierte SVG-Glyphen und vollständige ARIA-Auszeichnung.

## Technischer Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Sprache**: [TypeScript](https://www.typescriptlang.org/) (strikte Typisierung)
- **Bibliothek**: [React 19](https://react.dev/)
- **Styling**: Modulares CSS mit semantischen Custom Properties für Licht-/Dunkelmodus, Bento-Grid und dynamische Wetteranimationen
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
│   ├── globals.css               # Design-Tokens, Bento-Layout & responsive Breakpoints
│   ├── layout.tsx                # App-Layout, PWA-Metadaten & Viewport
│   └── page.tsx                  # Server Component mit ISR-Caching
├── components/
│   ├── forecast/
│   │   ├── DailyForecast.tsx     # 10-Tage-Vorhersageliste
│   │   └── HourlyForecast.tsx    # Horizontale 48-Stunden-Leiste
│   ├── layout/
│   │   ├── Footer.tsx            # Quellennachweise & Lizenzhinweise
│   │   ├── Header.tsx            # App-Kopfzeile mit View-Toggle
│   │   └── LocationSwitcher.tsx  # Standort-Auswahlchips
│   ├── warnings/
│   │   └── WeatherWarningsCard.tsx # DWD-Warnungskarte
│   ├── weather/
│   │   ├── AirQualityCard.tsx    # Luftqualitätskachel
│   │   ├── CurrentWeatherHero.tsx# Klassische Hero-Karte
│   │   ├── WeatherAppShell.tsx   # Client-Orchestrierung & View-Umschaltung
│   │   ├── WeatherDetailsGrid.tsx# 4-teiliges Detailraster
│   │   └── WeatherGlyph.tsx      # SVG-Vektorglyphen
│   └── widgets/
│       ├── ActivitySuitabilityCard.tsx # Lokale Freizeit- & Aktivitätsbewertung
│       ├── BentoDashboard.tsx    # Modernes 2-Spalten-Bento-Dashboard
│       ├── BentoHeroCard.tsx     # Glowing Hero-Karte
│       ├── BentoMetricsGrid.tsx  # Raster für UV, Wind, Niederschlag & Atmosphäre
│       ├── SunArcCard.tsx        # Sonnenstand-Bogen
│       └── TemperatureTrendChart.tsx # SVG Bézier-Temperaturverlauf & 7-Tage-Liste
├── lib/
│   └── weather/
│       ├── activities.ts         # Bewertungslogik für lokale Aktivitäten
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
