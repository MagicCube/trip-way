import type { TripDay, Trip, DetailedPOI } from '../types';

import { getActivitiesOfDay } from './activity';

export function getPOIsOfDay(day: TripDay, trip: Trip) {
  return getActivitiesOfDay(day, trip)
    .map((a) => a.poi)
    .filter((p) => p !== null && p !== undefined) as DetailedPOI[];
}
