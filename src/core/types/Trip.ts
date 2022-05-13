import type { TripDay } from './TripDay';

export interface Trip {
  id: string;
  title: string;
  description?: string;
  coverImageURL: string;
  startDate: string;
  days: TripDay[];
}
