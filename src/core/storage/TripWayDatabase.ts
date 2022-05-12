import Dexie from 'dexie';

import type { Trip } from '../types';

export class TripWayDatabase extends Dexie {
  trips!: Dexie.Table<Trip, string>;

  constructor() {
    super('TripWayDatabase');
    this.version(1).stores({
      trips: '++id',
    });
  }
}
