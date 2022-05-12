export interface POI {
  id: string;
  name: string;
  type: string;
  location: AMap.Vector2;
  address: string;
}

export interface DetailedPOI extends POI {
  pname: string;
  cityname: string;
  adname: string;
  photos: Photo[] | '';
}

export interface Photo {
  title: string;
  url: string;
}
