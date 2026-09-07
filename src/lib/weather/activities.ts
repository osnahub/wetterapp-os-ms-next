import { CurrentWeather, WeatherLocation, ActivityRecommendation } from '@/types/weather';

export function getActivityRecommendations(
  current: CurrentWeather,
  location: WeatherLocation,
  precipitationProb = 0
): ActivityRecommendation[] {
  const isOsnabrueck = location.name.toLowerCase().includes('osnabrück');
  const temp = current.temperatureCelsius ?? 20;
  const isRaining = (current.precipitationMm ?? 0) > 0.2 || (current.rainMm ?? 0) > 0.2;
  const highRainProb = precipitationProb >= 40;
  const wind = current.windKmH ?? 10;

  // 1. Marktplatz / City Center
  let marketBadge: ActivityRecommendation['badgeVariant'] = 'excellent';
  let marketText = isOsnabrueck
    ? 'Angenehmes Wetter für ein Außencafé am Markt.'
    : 'Angenehmes Wetter für die historische Altstadt und Straßencafés.';

  if (isRaining || highRainProb) {
    marketBadge = 'moderate';
    marketText = isOsnabrueck
      ? 'Bei Schauern bieten die historischen Bogengänge Schutz.'
      : 'Die Bogengänge am Prinzipalmarkt schützen gut vor Regen.';
  } else if (temp < 10) {
    marketBadge = 'good';
    marketText = 'Frisch, aber sonnig für einen zügigen Bummel.';
  } else if (temp > 30) {
    marketBadge = 'good';
    marketText = 'Sehr warm – schattige Plätze am Marktplatz aufsuchen.';
  }

  // 2. Zoo
  let zooBadge: ActivityRecommendation['badgeVariant'] = 'excellent';
  let zooText = isOsnabrueck
    ? 'Fantastisches Wetter für die Außenanlagen und die Löwen-Savanne!'
    : 'Schöne Bedingungen für die Außen- und Innengehege im Allwetterzoo.';

  if (isRaining) {
    zooBadge = isOsnabrueck ? 'moderate' : 'good'; // Allwetterzoo has covered paths
    zooText = isOsnabrueck
      ? 'Regenschirm oder Unterstände bei den Gehegen nutzen.'
      : 'Dank überdachter Allwettergänge auch bei Regen gut besuchbar!';
  } else if (temp < 5) {
    zooBadge = 'moderate';
    zooText = 'Kaltes Wetter – Tierhäuser bevorzugen.';
  }

  // 3. See (Rubbenbruchsee / Aasee)
  let lakeBadge: ActivityRecommendation['badgeVariant'] = 'excellent';
  let lakeText = isOsnabrueck
    ? 'Perfekt für Tretbootfahren oder Spaziergänge am Rubbenbruchsee.'
    : 'Perfekt für Tretbootfahren, Segeln oder Spaziergänge am Aasee.';

  if (isRaining || wind > 45) {
    lakeBadge = 'poor';
    lakeText = isOsnabrueck
      ? 'Wind und Nässe am Rubbenbruchsee – lieber wetterfeste Kleidung.'
      : 'Böig und nass am Aasee – Wassersport eher meiden.';
  } else if (highRainProb) {
    lakeBadge = 'moderate';
    lakeText = 'Regenschauer möglich, kurze Runde empfohlen.';
  }

  // 4. Museum (Felix-Nussbaum-Haus / LWL-Museum)
  let museumBadge: ActivityRecommendation['badgeVariant'] = 'good';
  let museumText = isOsnabrueck
    ? 'Ein Museumsbesuch lohnt sich immer.'
    : 'Kultureller Kunstgenuss im Herzen von Münster.';

  if (isRaining || highRainProb || temp > 32 || temp < 3) {
    museumBadge = 'excellent';
    museumText = isOsnabrueck
      ? 'Perfektes Wetter für die Architektur und Kunst im Nussbaum-Haus!'
      : 'Ideales Schlechtwetterprogramm im LWL-Museum.';
  }

  // 5. Schirm-Bedarf
  const cityCode = isOsnabrueck ? 'OS' : 'MS';
  let umbrellaBadge: ActivityRecommendation['badgeVariant'] = 'none';
  let umbrellaText = 'Kein Regenschirm nötig. Freie Sicht und Sonnenschein!';

  if (isRaining) {
    umbrellaBadge = 'poor';
    umbrellaText = 'Regenschirm unbedingt mitnehmen! Aktuell Niederschlag.';
  } else if (precipitationProb >= 50) {
    umbrellaBadge = 'moderate';
    umbrellaText = `Hohe Regenwahrscheinlichkeit (${Math.round(precipitationProb)} %). Schirm einpacken!`;
  } else if (precipitationProb >= 25) {
    umbrellaBadge = 'moderate';
    umbrellaText = `Mäßige Regenwahrscheinlichkeit (${Math.round(precipitationProb)} %). Kleiner Taschenschirm ratsam.`;
  }

  const badgeTextMap: Record<ActivityRecommendation['badgeVariant'], string> = {
    excellent: 'Hervorragend',
    good: 'Gut geeignet',
    moderate: 'Eingeschränkt',
    poor: 'Nicht ratsam',
    none: 'Kein Bedarf',
  };

  return [
    {
      id: 'market',
      title: isOsnabrueck ? 'Marktplatz & Rathaus' : 'Prinzipalmarkt & Rathaus',
      subtitle: marketText,
      badgeVariant: marketBadge,
      badgeText: badgeTextMap[marketBadge],
      iconType: 'landmark',
    },
    {
      id: 'zoo',
      title: isOsnabrueck ? 'Osnabrücker Zoo' : 'Allwetterzoo Münster',
      subtitle: zooText,
      badgeVariant: zooBadge,
      badgeText: badgeTextMap[zooBadge],
      iconType: 'zoo',
    },
    {
      id: 'lake',
      title: isOsnabrueck ? 'Rubbenbruchsee' : 'Aasee',
      subtitle: lakeText,
      badgeVariant: lakeBadge,
      badgeText: badgeTextMap[lakeBadge],
      iconType: 'lake',
    },
    {
      id: 'museum',
      title: isOsnabrueck ? 'Felix-Nussbaum-Haus' : 'LWL-Museum für Kunst und Kultur',
      subtitle: museumText,
      badgeVariant: museumBadge,
      badgeText: badgeTextMap[museumBadge],
      iconType: 'museum',
    },
    {
      id: 'umbrella',
      title: `Schirm-Bedarf (${cityCode})`,
      subtitle: umbrellaText,
      badgeVariant: umbrellaBadge,
      badgeText: umbrellaBadge === 'none' ? 'Kein Bedarf' : umbrellaBadge === 'poor' ? 'Akut nötig' : 'Empfohlen',
      iconType: 'umbrella',
    },
  ];
}
