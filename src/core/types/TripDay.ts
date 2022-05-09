import type { Activity } from './Activity';

export interface TripDay {
  id: string;
  description?: string;
  activities: Activity[];
  routes: any;
}
