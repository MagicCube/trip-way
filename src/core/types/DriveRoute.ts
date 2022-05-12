import type { DriveStep } from './DriveStep';

export interface DriveRoute {
  id: string;
  distance: number;
  policy: string;
  time: number;
  tolls: number;
  steps: DriveStep[];
}
