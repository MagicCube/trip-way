import type { TripDay } from './TripDay';

export interface Trip {
  id: string;
  title: string;
  description?: string;
  coverImageURL: string;
  departureDate: string;
  days: TripDay[];
  createdTime: number;
  lastModifiedTime: number;
}
