import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapView, Marker, Polyline } from '@/app/components/MapView';
import { TripDetailView } from '@/app/components/TripDetailView';
import {
  combinePathOfRoute,
  getPOIsOfDay,
  updateRoutesBasedOnChanges,
} from '@/core/biz';
import { loadTrip, saveTrip } from '@/core/storage';
import type { Trip, TripDay } from '@/core/types';
import { MOCKED_TRIP } from '@/mock/trip';

import styles from './index.module.less';

export const TripDetailPage = () => {
  const params = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const selectedDay = useMemo(() => {
    if (!trip) {
      return null;
    }
    return trip.days.find((day) => day.id === selectedDayId);
  }, [selectedDayId, trip]);
  const pois = useMemo(() => {
    if (trip && selectedDay) {
      return getPOIsOfDay(selectedDay, trip);
    } else {
      return [];
    }
  }, [selectedDay, trip]);
  const routePath = useMemo(() => {
    if (trip && selectedDay?.route) {
      return combinePathOfRoute(selectedDay.route);
    }
    return null;
  }, [selectedDay?.route, trip]);
  useEffect(() => {
    if (params.tripId) {
      loadTrip(params.tripId).then((loadedTrip) => {
        if (!loadedTrip) {
          if (params.tripId === 'MOCK_9b145ee8') {
            setTrip(MOCKED_TRIP);
          } else {
            setTrip(null);
          }
        } else {
          setTrip(loadedTrip);
        }
      });
    }
  }, [params.tripId]);
  const handleDaySelect = useCallback(
    (dayId: string | null) => {
      if (!trip) return;
      setSelectedDayId(dayId);
    },
    [trip],
  );
  const handleTripChange = useCallback(
    async (changedTrip: Trip, changedDay: TripDay | null) => {
      if (!trip) return;
      setTrip(changedTrip);
      await saveTrip(changedTrip);
      if (changedDay) {
        await updateRoutesBasedOnChanges(
          changedDay,
          changedTrip,
          async (newlyChangedTrip) => {
            console.info('newlyChangedTrip', newlyChangedTrip);
            setTrip(newlyChangedTrip);
            await saveTrip(newlyChangedTrip);
          },
        );
      }
    },
    [trip],
  );
  if (!trip) {
    return null;
  }
  return (
    <div className={styles.container}>
      <MapView className={styles.map}>
        {pois.map((poi, i) => (
          <Marker
            key={poi.id}
            title={`${i + 1}.${poi.name}`}
            location={poi.location}
            autoZoom={pois.length === 1}
          />
        ))}
        {routePath && routePath?.length > 0 && (
          <Polyline path={routePath} autoZoom />
        )}
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
