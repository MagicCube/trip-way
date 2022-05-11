import { useCallback, useEffect, useState } from 'react';
import { MapView, Marker, Polyline } from '@/app/components/MapView';
import { TripDetailView } from '@/app/components/TripDetailView';
import { getPOIsOfDay } from '@/core/biz';
import type { DetailedPOI, DriveRoute, Trip, TripDay } from '@/core/types';

import styles from './index.module.less';
import { loadTrip, saveTrip } from '@/core/storage';
import { MOCKED_TRIP } from '@/mock/trip';

export const TripDetailPage = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [pois, setPOIs] = useState<DetailedPOI[]>([]);
  const [route, setRoute] = useState<DriveRoute | null>(null);
  useEffect(() => {
    loadTrip('MOCK_9b145ee8').then((loadedTrip) => {
      if (!loadedTrip) {
        setTrip(MOCKED_TRIP);
      } else {
        setTrip(loadedTrip);
      }
    });
  }, []);
  const handleDaySelect = useCallback(
    (dayId: string | null) => {
      if (!trip) return;
      const day =
        dayId !== null ? trip.days.find((day) => day.id === dayId) : undefined;
      if (day) {
        setPOIs(getPOIsOfDay(day, trip));
        setRoute(day.route || null);
      }
    },
    [trip],
  );
  const handleTripChange = useCallback(
    async (changedTrip: Trip, changedDay: TripDay | null) => {
      if (!trip) return;
      setTrip(changedTrip);
      await saveTrip(changedTrip);
    },
    [trip],
  );
  if (!trip) {
    return null;
  }
  return (
    <div className={styles.container}>
      <MapView className={styles.map}>
        {pois.map((poi) => (
          <Marker key={poi.id} location={poi.location} />
        ))}
        {route &&
          route.steps.map((step, i) => (
            <Polyline key={`step-${i}`} path={step.path} />
          ))}
      </MapView>
      <TripDetailView
        className={styles.tripDetail}
        trip={trip}
        onDaySelect={handleDaySelect}
        onChange={handleTripChange}
      />
    </div>
  );
};
