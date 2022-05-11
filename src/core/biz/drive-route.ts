import immer from 'immer';

import { NavigationService } from '../geo';
import type { DriveRoute, Trip, TripDay } from '../types';

import { getPOIsOfDay } from './poi';
import { getDayIndex } from './trip-day';

export async function updateRoutesBasedOnChanges(
  day: TripDay,
  trip: Trip,
  callback: (changedTrip: Trip) => void | Promise<void>,
) {
  const dayIndex = getDayIndex(day, trip);
  const possiblyImpactedDays = trip.days.slice(dayIndex);
  for (const possiblyImpactDay of possiblyImpactedDays) {
    const possiblyImpactDayIndex = getDayIndex(possiblyImpactDay, trip);
    let needsUpdate = false;
    const pois = getPOIsOfDay(possiblyImpactDay, trip);
    if (pois.length > 1) {
      if (possiblyImpactDay.route) {
        const routeId = pois.map((poi) => poi.id).join(',');
        if (routeId !== possiblyImpactDay.route?.id) {
          needsUpdate = true;
        }
      } else {
        needsUpdate = true;
      }
    } else {
      if (possiblyImpactDay.route) {
        needsUpdate = true;
      }
    }
    if (needsUpdate) {
      console.info(
        'Needs update',
        pois.map((poi) => poi.name),
      );
      let newRoute: DriveRoute | null = null;
      if (pois.length > 1) {
        const routes = await NavigationService.search(pois);
        if (routes.length) {
          newRoute = routes[0];
        }
      }
      const changedTrip = immer(trip, (draft) => {
        draft.days[possiblyImpactDayIndex].route = newRoute;
      });
      await callback(changedTrip);
      await updateRoutesBasedOnChanges(
        changedTrip.days[possiblyImpactDayIndex],
        changedTrip,
        callback,
      );
      break;
    }
  }
}

export function combinePathOfRoute(route: DriveRoute) {
  const path: AMap.LngLat[] = [];
  route.steps.forEach((step) => {
    path.push(...step.path);
  });
  return path;
}

export function combinePathOfTrip(trip: Trip) {
  const path: AMap.LngLat[] = [];
  trip.days.forEach((day) => {
    if (day.route) {
      path.push(...combinePathOfRoute(day.route));
    }
  });
  return path;
}

export function sumTripDistance(trip: Trip) {
  return trip.days.reduce((acc, day) => {
    if (day.route) {
      return acc + day.route.distance;
    }
    return acc;
  }, 0);
}
