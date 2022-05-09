import { useCallback, useState } from 'react';
import { MapView } from '@/app/components/MapView';
import { TripDetailView } from '@/app/components/TripDetailView';
import { MOCKED_TRIP } from '@/mock/trip';
import type { Trip } from '@/core/types';

import styles from './index.module.less';

export const TripDetailPage = () => {
  const [trip, setTrip] = useState<Trip>(MOCKED_TRIP);
  const handleTripChange = useCallback((changedTrip: Trip) => {
    setTrip(changedTrip);
  }, []);
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
