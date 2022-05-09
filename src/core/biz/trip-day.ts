import immer from 'immer';

import type { TripDay, Trip, Activity } from '../types';
import { uuid } from '../util/uuid';

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

export function appendNewActivityToDay(day: TripDay) {
  return immer(day, (draft) => {
    const newActivity: Activity = { id: uuid() };
    draft.activities.push(newActivity);
  });
}

export function removeActivityFromDay(activityId: string, day: TripDay) {
  return immer(day, (draft) => {
    const activityIndex = day.activities.findIndex((a) => a.id === activityId);
    if (activityIndex >= 0) {
      draft.activities.splice(activityIndex, 1);
    }
  });
}
