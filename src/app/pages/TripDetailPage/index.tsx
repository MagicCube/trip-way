import { useCallback, useState } from 'react';
import { MapView } from '@/app/components/MapView';
import { TripDetailView } from '@/app/components/TripDetailView';
import { MOCKED_TRIP } from '@/mock/trip';
import type { Trip, TripDay } from '@/core/types';

import styles from './index.module.less';
import { getPOIsOfDay } from '@/core/biz';
import { NavigationService } from '@/core/geo';

export const TripDetailPage = () => {
  const [trip, setTrip] = useState<Trip>(MOCKED_TRIP);
  const handleTripChange = useCallback(
    async (changedTrip: Trip, changedDay: TripDay | null) => {
      setTrip(changedTrip);
      if (changedDay) {
        const pois = getPOIsOfDay(changedDay, trip);
        if (pois.length >= 2) {
          const routes = await NavigationService.search(pois);
          // console.info('Routes', routes);
        }
      }
    },
    [trip],
  );
  return (
    <div className={styles.container}>
      <MapView className={styles.map} />
      <TripDetailView
        className={styles.tripDetail}
        trip={trip}
        onChange={handleTripChange}
      />
    </div>
  );
};
