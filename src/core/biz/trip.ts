import immer from 'immer';

import type { TripDay, Trip } from '../types';

import { getDayIndex } from './trip-day';

export function updateDayOfTrip(day: TripDay, trip: Trip) {
  return immer(trip, (draft) => {
    const dayIndex = getDayIndex(day, trip);
    if (dayIndex >= 0) {
      draft.days[dayIndex] = day;
    }
  });
}
