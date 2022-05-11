import type { Trip } from '../types';

export async function saveTrip(trip: Trip) {
  const key = getLocalStorageKeyOfTrip(trip.id);
  localStorage.setItem(key, JSON.stringify(trip));
}

export async function loadTrip(id: string) {
  const key = getLocalStorageKeyOfTrip(id);
  const json = localStorage.getItem(key);
  if (json) {
    return JSON.parse(json) as Trip;
  } else {
    return null;
  }
}

function getLocalStorageKeyOfTrip(id: string) {
  return `trip-way://trips/${id}`;
}
