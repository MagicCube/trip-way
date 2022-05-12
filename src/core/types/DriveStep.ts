export interface DriveStep {
  assistant_action?: string;
  distance: number;
  time: number;
  path: AMap.Vector2[];
}
