import type { DriveStep } from './DriveStep';

export interface DriveRoute {
  distance: number;
  restriction: number;
  policy: string;
  time: number;
  tolls: number;
  tolls_distance: number;
  steps: DriveStep[];
}
