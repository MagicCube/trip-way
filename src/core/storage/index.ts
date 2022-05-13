import type { Trip } from '../types';

import { TripWayDatabase } from './TripWayDatabase';

const db = new TripWayDatabase();

export async function saveTrip(trip: Trip) {
  await db.trips.put(trip);
}

export async function loadTrip(id: string) {
  const trip = await db.trips.get(id);
  return trip || null;
}
