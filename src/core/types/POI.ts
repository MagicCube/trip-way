export interface POI {
  id: string;
  name: string;
  type: string;
  location: AMap.LngLatLike;
  address: string;
  distance: number | null;
  tel: string;
}

export interface DetailedPOI extends POI {
  website: string;
  pcode: string;
  citycode: string;
  adcode: string;
  postcode: string;
  pname: string;
  cityname: string;
  adname: string;
  email: string;
  photos: Photo[] | '';
}

export interface Photo {
  title: string;
  url: string;
}
