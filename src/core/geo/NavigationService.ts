import type { DriveRoute, POI } from '../types';

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
        const callback = this._createDrivingCallback(resolve, reject);
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
    resolve: (routes: DriveRoute[]) => void,
    reject: (error: Error) => void,
  ) {
    return (
      status: AMap.CallbackStatus,
      result: AMap.DrivingResult | string,
    ) => {
      if (status === 'complete' && typeof result === 'object') {
        resolve(result.routes);
      } else if (status === 'no_data') {
        resolve([]);
      } else {
        reject(new Error(result as string));
      }
    };
  }
}

export const NavigationService = new NavigationServiceImpl();
(window as any).NavigationService = NavigationService;
