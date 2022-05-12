import type { DetailedPOI } from '../types';

const POI_TYPES = [
  '汽车服务',
  '汽车销售',
  '汽车维修',
  '摩托车服务',
  '餐饮服务',
  '购物服务',
  '生活服务',
  '体育休闲服务',
  '医疗保健服务',
  '住宿服务',
  '风景名胜',
  '商务住宅',
  '政府机构及社会团体',
  '科教文化服务',
  '交通设施服务',
  '金融保险服务',
  '公司企业',
  '道路附属设施',
  '地名地址信息',
  '公共设施',
];

class POIServiceImpl {
  // private _autocomplete: AMap.Autocomplete | undefined;
  // private _placeSearch: AMap.PlaceSearch | undefined;
  private _internal: AMap.PlaceSearch | undefined;

  // private get _internalAutocomplete() {
  //   if (!this._autocomplete) {
  //     this._autocomplete = new AMap.Autocomplete({});
  //   }
  //   return this._autocomplete;
  // }

  // private get _internalPlaceSearch() {
  //   if (!this._placeSearch) {
  //     this._placeSearch = new AMap.PlaceSearch({
  //       extensions: 'base',
  //       type: POI_TYPES.join('|'),
  //     });
  //   }
  //   return this._placeSearch;
  // }

  private get internal() {
    if (!this._internal) {
      this._internal = new AMap.PlaceSearch({
        extensions: 'all',
        type: POI_TYPES.join('|'),
      });
    }
    return this._internal;
  }

  autocomplete(keyword: string) {
    return this.search(keyword);
  }

  search(keyword: string) {
    return new Promise<DetailedPOI[]>((resolve, reject) => {
      this.internal.search(
        keyword,
        this._createPlaceSearchCallback(resolve, reject),
      );
    });
  }

  getDetails(poiId: string) {
    return new Promise<DetailedPOI[]>((resolve, reject) => {
      this.internal.getDetails(
        poiId,
        this._createPlaceSearchCallback(resolve, reject),
      );
    }).then((pois) => (pois?.length ? pois[0] : null));
  }

  private _createPlaceSearchCallback(
    resolve: (pois: DetailedPOI[]) => void,
    reject: (error: Error) => void,
  ) {
    return (
      status: AMap.CallbackStatus,
      result: AMap.PlaceSearchResult | string,
    ) => {
      if (status === 'complete' && typeof result === 'object') {
        resolve(result.poiList.pois.map(extractPOI));
      } else if (status === 'no_data') {
        resolve([]);
      } else {
        reject(new Error(result as string));
      }
    };
  }
}

function extractPOI(poi: DetailedPOI): DetailedPOI {
  const l = poi.location as unknown as AMap.LngLat;
  return {
    id: poi.id,
    name: poi.name,
    type: poi.type,
    location: [l.lng, l.lat],
    address: poi.address,
    pname: poi.pname,
    cityname: poi.cityname,
    adname: poi.adname,
    photos: poi.photos,
  };
}

export const POIService = new POIServiceImpl();
(window as any).POIService = POIService;
