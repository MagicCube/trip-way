import type { DetailedPOI } from './POI';

export interface Activity {
  id: string;
  description?: string;
  poi?: DetailedPOI | null;
}
