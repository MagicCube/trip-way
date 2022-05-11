import type { TripDay, Trip, DetailedPOI } from '../types';

import { getActivitiesOfDay, getLastActivityOfDay } from './activity';

export function getPOIsOfDay(day: TripDay, trip: Trip) {
  return getActivitiesOfDay(day, trip)
    .map((a) => a.poi)
    .filter((p) => p !== null && p !== undefined) as DetailedPOI[];
}

export function getPOIsOfTrip(trip: Trip) {
  return trip.days.reduce(
    (acc, day) => acc.concat(getPOIsOfDay(day, trip)),
    [] as DetailedPOI[],
  );
}

export function getDailyPOIsOfTrip(trip: Trip) {
  let results: DetailedPOI[] = [];
  const firstPOI = trip.days[0].activities[0].poi;
  if (firstPOI) {
    results.push(firstPOI);
  }
  results = trip.days.reduce((acc, day) => {
    const activity = getLastActivityOfDay(day, trip);
    if (activity?.poi) {
      return acc.concat(activity.poi);
    }
    return acc;
  }, results);
  return results.map((poi) => poi);
}
