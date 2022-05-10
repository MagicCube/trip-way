import '@amap/amap-jsapi-types';

declare global {
  namespace AMap {
    type CallbackStatus = 'complete' | 'error' | 'no_data';
    type Callback<T> = (status: CallbackStatus, result: T | string) => void;

    interface POIList {
      pois: POI[];
      pageIndex: number;
      pageSize: number;
      count: number;
    }

    interface PlaceSearchOptions {
      type?: string;
      city?: string;
      pageSize?: number;
      pageIndex?: number;
      citylimit?: boolean;
      extensions?: 'all' | 'base';
    }

    interface PlaceSearchResult {
      info: string;
      poiList: POIList;
    }

    class PlaceSearch {
      constructor(options?: PlaceSearchOptions);

      getDetails(id: string, callback?: Callback<PlaceSearchResult>): void;

      search(keyword: string, callback?: Callback<PlaceSearchResult>): void;
    }

    interface AutocompleteOptions {
      type?: string;
      city?: string;
      datatype?: 'all' | 'poi' | 'bus' | 'busline';
      citylimit?: boolean;
    }

    interface AutocompleteTip {
      name: string;
      district: string;
      adcode: string;
    }

    interface AutocompleteResult {
      info: string;
      count: number;
      tips: AutocompleteTip[];
    }

    class Autocomplete {
      constructor(options?: AutocompleteOptions);

      search(keyword: string, callback?: Callback<AutocompleteResult>): void;
    }

    enum DrivingPolicy {
      FEE_HIGHWAY = 7,
      FEE_TRAFFIC = 8,
      HIGHWAY = 6,
      LEAST_DISTANCE = 2,
      LEAST_FEE = 1,
      LEAST_TIME = 0,
      MULTI_POLICIES = 5,
      REAL_TRAFFIC = 4,
      TRAFFIC_HIGHWAY = 9,
    }

    interface DrivingOptions {
      map?: Map;
      policy?: DrivingPolicy;
      extensions?: 'all' | 'base';
      autoFitView?: boolean;
      showTraffic?: boolean;
      hideMarkers?: boolean;
    }

    interface DrivingResult {
      info: string;
      origin: LngLat;
      destination: LngLat;
      routes: DriveRoute[];
    }

    class Driving {
      constructor(options?: DrivingOptions);

      search(
        start: LngLatLike,
        end: LngLatLike,
        callback?: Callback<DrivingResult>,
      );
      search(
        start: LngLatLike,
        end: LngLatLike,
        options: { waypoints: LngLatLike[] },
        callback?: Callback<DrivingResult>,
      );
    }
  }
}
