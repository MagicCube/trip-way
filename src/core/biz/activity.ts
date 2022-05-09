import immer from 'immer';

import type { Activity, DetailedPOI, Trip, TripDay } from '../types';

import { getDayIndex } from './trip-day';

export function getLastActivityOfDay(day: TripDay, trip: Trip) {
  if (day.activities.length > 0) {
    return day.activities[day.activities.length - 1];
  } else {
    return getLastActivityOfPreviousDay(day, trip);
  }
}

export function getLastActivityOfPreviousDay(day: TripDay, trip: Trip) {
  const dayIndex = getDayIndex(day, trip);
  if (dayIndex >= 1) {
    const previousDay = trip.days[dayIndex - 1];
    return previousDay.activities[previousDay.activities.length - 1] || null;
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
      delete draft.poi;
    }
  });
}
