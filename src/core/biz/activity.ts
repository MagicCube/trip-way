import immer from 'immer';

import type { Activity, DetailedPOI, Trip, TripDay } from '../types';

import { getDayIndex } from './trip-day';

export function getLastActivityOfDay(day: TripDay, trip: Trip) {
  if (day.activities.length > 0) {
    let lastActivity: Activity | undefined = undefined;
    for (let i = day.activities.length - 1; i >= 0; i--) {
      lastActivity = day.activities[i];
      if (lastActivity.poi) {
        break;
      }
    }
    return lastActivity || null;
  } else {
    return getLastActivityOfPreviousDay(day, trip);
  }
}

export function getLastActivityOfPreviousDay(day: TripDay, trip: Trip) {
  const dayIndex = getDayIndex(day, trip);
  if (dayIndex >= 1) {
    const previousDay = trip.days[dayIndex - 1];
    let previousActivity: Activity | undefined = undefined;
    for (let i = previousDay.activities.length - 1; i >= 0; i--) {
      previousActivity = previousDay.activities[i];
      if (previousActivity.poi) {
        break;
      }
    }
    return previousActivity || null;
  }
  return null;
}

export function getActivitiesOfDay(day: TripDay, trip: Trip) {
  const results: Activity[] = [...day.activities];
  const prevActivity = getLastActivityOfPreviousDay(day, trip);
  if (prevActivity) {
    results.unshift(prevActivity);
  }
  return results;
}

export function updatePOIOfActivity(
  poi: DetailedPOI | null,
  activity: Activity,
) {
  return immer(activity, (draft) => {
    if (poi) {
      draft.poi = poi;
    } else {
      draft.poi = null;
    }
  });
}
