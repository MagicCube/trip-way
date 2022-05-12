import type { DriveRoute, DriveStep, POI } from '../types';

export class NavigationServiceImpl {
  private _internal: AMap.Driving | null = null;

  private get internal() {
    if (!this._internal) {
      this._internal = new AMap.Driving();
    }
    return this._internal;
  }

  search(pois: POI[]) {
    if (pois.length < 2) {
      throw new Error('At least provide two POIs.');
    }
    const points = pois.map((poi) => poi.location);
    return new Promise<DriveRoute[]>(
      (
        resolve: (routes: DriveRoute[]) => void,
        reject: (error: Error) => void,
      ) => {
        const callback = this._createDrivingCallback(
          pois.map((poi) => poi.id),
          resolve,
          reject,
        );
        if (points.length === 2) {
          this.internal.search(points[0], points[1], callback);
        } else {
          this.internal.search(
            points[0],
            points[points.length - 1],
            {
              waypoints: points.slice(1, points.length - 1),
            },
            callback,
          );
        }
      },
    );
  }

  private _createDrivingCallback(
    poiIds: string[],
    resolve: (routes: DriveRoute[]) => void,
    reject: (error: Error) => void,
  ) {
    return (
      status: AMap.CallbackStatus,
      result: AMap.DrivingResult | string,
    ) => {
      if (status === 'complete' && typeof result === 'object') {
        result.routes.forEach((route) => {
          route.id = poiIds.join(',');
        });
        resolve(result.routes.map(extractRoute));
      } else if (status === 'no_data') {
        resolve([]);
      } else {
        reject(new Error(result as string));
      }
    };
  }
}

function extractRoute(route: DriveRoute): DriveRoute {
  return {
    id: route.id,
    policy: route.policy,
    distance: route.distance,
    time: route.time,
    tolls: route.tolls,
    steps: extractSteps(route),
  };
}

function extractSteps(route: DriveRoute): DriveStep[] {
  const results: DriveStep[] = [];
  let currentStep: DriveStep | undefined;
  route.steps.forEach((step) => {
    if (currentStep === undefined || step.assistant_action === '到达途经地') {
      currentStep = {
        distance: step.distance,
        time: step.time,
        path: extractPath(step.path),
      };
      results.push(currentStep);
    } else {
      currentStep.distance += step.distance;
      currentStep.time += step.time;
      currentStep.path = currentStep.path.concat(extractPath(step.path));
    }
  });
  return results;
}

function extractPath(path: AMap.LngLatLike[]): AMap.Vector2[] {
  return path.map((lngLatLike: AMap.LngLatLike) => {
    const l = lngLatLike as AMap.LngLat;
    return [l.lng, l.lat];
  });
}

export const NavigationService = new NavigationServiceImpl();
(window as any).NavigationService = NavigationService;
