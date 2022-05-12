import immer from 'immer';

import type { TripDay, Trip, Activity, DriveRoute } from '../types';
import { uuid } from '../util/uuid';

export function getDayIndex(day: TripDay | string, trip: Trip) {
  return trip.days.findIndex(
    (d) => d.id === (typeof day === 'string' ? day : day.id),
  );
}

export function updateActivityOfDay(activity: Activity, day: TripDay) {
  return immer(day, (draft) => {
    const activityIndex = day.activities.findIndex((a) => a.id === activity.id);
    if (activityIndex >= 0) {
      draft.activities[activityIndex] = activity;
    }
  });
}

export function updateRouteOfDay(route: DriveRoute | null, day: TripDay) {
  return immer(day, (draft) => {
    draft.route = route;
  });
}

export function insertNewActivityToDay(activityId: string, day: TripDay) {
  return immer(day, (draft) => {
    const activityIndex = day.activities.findIndex((a) => a.id === activityId);
    const newActivity: Activity = { id: uuid() };
    if (activityIndex >= 0) {
      draft.activities.splice(activityIndex, 0, newActivity);
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

export function reorderActivitiesOfDay(
  sourceIndex: number,
  destIndex: number,
  day: TripDay,
) {
  return immer(day, (draft) => {
    const tmp = draft.activities[sourceIndex];
    draft.activities.splice(sourceIndex, 1);
    draft.activities.splice(destIndex, 0, tmp);
  });
}
