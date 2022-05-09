import '@amap/amap-jsapi-types';

declare global {
  namespace AMap {
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

      getDetails(
        id: string,
        callback: (status: string, result: PlaceSearchResult) => void,
      ): void;

      search(
        keyword: string,
        callback: (status: string, result: PlaceSearchResult) => void,
      ): void;
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

      search(
        keyword: string,
        callback: (status: string, result: AutocompleteResult) => void,
      ): void;
    }
  }
}
