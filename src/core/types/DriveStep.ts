export interface DriveStep {
  start_location: AMap.LngLat;
  end_location: AMap.LngLat;
  assist_action: string;
  distance: number;
  time: number;
  path: AMap.LngLat[];
}
