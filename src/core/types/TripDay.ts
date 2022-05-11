import type { Activity } from './Activity';
import type { DriveRoute } from './DriveRoute';

export interface TripDay {
  id: string;
  description?: string;
  activities: Activity[];
  route?: DriveRoute | null;
}
