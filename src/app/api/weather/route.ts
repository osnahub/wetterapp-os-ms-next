import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData, getLocationById } from '@/lib/weather/service';
import { DEFAULT_LOCATIONS } from '@/lib/weather/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('id') || DEFAULT_LOCATIONS[0].id;

  const location = getLocationById(locationId);

  try {
    const data = await fetchWeatherData(location);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Fehler beim Laden der Wetterdaten' },
      { status: 500 }
    );
  }
}
