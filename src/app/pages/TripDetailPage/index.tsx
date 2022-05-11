import { useCallback, useState } from 'react';
import { MapView, Marker, Polyline } from '@/app/components/MapView';
import { TripDetailView } from '@/app/components/TripDetailView';
import { getPOIsOfDay } from '@/core/biz';
import { NavigationService } from '@/core/geo';
import { MOCKED_TRIP } from '@/mock/trip';
import type { DetailedPOI, DriveRoute, Trip, TripDay } from '@/core/types';

import styles from './index.module.less';

export const TripDetailPage = () => {
  const [trip, setTrip] = useState<Trip>(MOCKED_TRIP);
  const [pois, setPOIs] = useState<DetailedPOI[]>([]);
  const [route, setRoute] = useState<DriveRoute | null>(null);
  const handleDaySelect = useCallback(
    (dayId: string | null) => {
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
      setTrip(changedTrip);
      if (changedDay) {
        const pois = getPOIsOfDay(changedDay, trip);
        setPOIs(pois);
        if (pois.length >= 2) {
          const routes = await NavigationService.search(pois);
          // console.info(
          //   'Routes',
          //   pois.map((poi) => poi.name),
          //   routes,
          // );
        }
      }
    },
    [trip],
  );
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
