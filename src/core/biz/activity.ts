import immer from 'immer';

import type { Activity, DetailedPOI, Trip, TripDay } from '../types';

import { getDayIndex } from './trip-day';

export function formatActivity(activity: Activity) {
  if (activity.poi) {
    const poi = activity.poi;
    if (poi.type.includes('地名')) {
      return poi.name;
    }
    return poi.cityname;
  }
  return '未知';
}

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

export function updatePOIOfActivity(poi: DetailedPOI, activity: Activity) {
  return immer(activity, (draft) => {
    draft.poi = poi;
  });
}
