import immer from 'immer';

import type { TripDay, Trip, Activity } from '../types';

import { formatActivity, getActivitiesOfDay } from './activity';

export function formatDay(day: TripDay, trip: Trip) {
  const activities = getActivitiesOfDay(day, trip);
  for (let i = activities.length - 1; i >= 0; i--) {
    const activity = activities[i];
    if (activity.poi) {
      return formatActivity(activity);
    }
  }
  return '未知';
}

export function getDayIndex(day: TripDay, trip: Trip) {
  return trip.days.findIndex((d) => d.id === day.id);
}

export function updateActivityOfDay(activity: Activity, day: TripDay) {
  return immer(day, (draft) => {
    const activityIndex = day.activities.findIndex((a) => a.id === activity.id);
    if (activityIndex >= 0) {
      draft.activities[activityIndex] = activity;
    }
  });
}
