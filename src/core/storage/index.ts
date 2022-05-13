import moment from 'moment';

import type { Trip } from '../types';
import { uuid } from '../util/uuid';

import { TripWayDatabase } from './TripWayDatabase';

const db = new TripWayDatabase();

export async function addNewTrip(): Promise<string> {
  const trip: Trip = {
    id: uuid(),
    title: '全新旅程',
    coverImageURL:
      'https://drscdn.500px.org/photo/1047855817/q%3D80_m%3D1500/v2?sig=2d12add739182d0c1a7dc94050f1e1c35799b7ff773ad16cbcfdd9f246a105a7',
    departureDate: moment(Date.now()).format('YYYY-MM-DD'),
    description: '',
    days: [
      {
        id: uuid(),
        activities: [
          {
            id: uuid(),
          },
        ],
      },
    ],
    createdTime: Date.now(),
    lastModifiedTime: Date.now(),
  };
  await db.trips.add(trip);
  return trip.id;
}

export async function deleteTrip(tripId: string) {
  await db.trips.delete(tripId);
}

export async function saveTrip(trip: Trip) {
  await db.trips.put({
    ...trip,
    lastModifiedTime: Date.now(),
  });
}

export async function loadTrip(id: string) {
  const trip = await db.trips.get(id);
  return trip || null;
}

export async function loadTrips() {
  const trips = await db.trips.toArray();
  trips.sort((a, b) => b.lastModifiedTime - a.lastModifiedTime);
  return trips;
}
