import immer from 'immer';

import type { TripDay, Trip } from '../types';
import { uuid } from '../util/uuid';

import { getDayIndex } from './trip-day';

export function appendNewDayToTrip(trip: Trip) {
  return immer(trip, (draft) => {
    const newDay: TripDay = {
      id: uuid(),
      activities: [
        {
          id: uuid(),
        },
      ],
    };
    draft.days.push(newDay);
  });
}

export function removeDayFromTrip(dayId: string, trip: Trip) {
  return immer(trip, (draft) => {
    const dayIndex = getDayIndex(dayId, draft);
    if (dayIndex !== -1) {
      draft.days.splice(dayIndex, 1);
    }
  });
}

export function updateDayOfTrip(day: TripDay, trip: Trip) {
  return immer(trip, (draft) => {
    const dayIndex = getDayIndex(day, trip);
    if (dayIndex >= 0) {
      draft.days[dayIndex] = day;
    }
  });
}
