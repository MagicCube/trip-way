import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapView, Marker, Polyline } from '@/app/components/MapView';
import { TripDetailView } from '@/app/components/TripDetailView';
import {
  appendNewDayToTrip,
  combinePathOfRoute,
  combinePathOfTrip,
  getDailyPOIsOfTrip,
  getPOIsOfDay,
  removeDayFromTrip,
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
    if (!trip) {
      return [];
    }
    if (selectedDay) {
      return getPOIsOfDay(selectedDay, trip);
    } else {
      return getDailyPOIsOfTrip(trip);
    }
  }, [selectedDay, trip]);
  const routePath = useMemo(() => {
    if (!trip) {
      return null;
    }
    if (selectedDay?.route) {
      return combinePathOfRoute(selectedDay.route);
    } else {
      return combinePathOfTrip(trip);
    }
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
  const handleAppendDay = useCallback(async () => {
    if (!trip) return;
    const changedTrip = appendNewDayToTrip(trip);
    const newDayId = changedTrip.days[changedTrip.days.length - 1].id;
    replaceTripWith(changedTrip); // don't wait for saving
    setTimeout(() => {
      setSelectedDayId(newDayId);
    }, 0);
  }, [trip]);
  const handleRemoveDay = useCallback(
    async (dayId: string) => {
      if (!trip) return;
      const originalIndex = trip.days.findIndex((day) => day.id === dayId);
      const changedTrip = removeDayFromTrip(dayId, trip);
      await replaceTripWith(changedTrip);
      if (changedTrip.days[originalIndex]) {
        setSelectedDayId(changedTrip.days[originalIndex].id);
      } else if (changedTrip.days[originalIndex - 1]) {
        setSelectedDayId(changedTrip.days[originalIndex - 1].id);
      } else {
        setSelectedDayId(null);
      }
    },
    [trip],
  );
  const handleTripChange = useCallback(
    async (changedTrip: Trip, changedDay: TripDay | null) => {
      if (!trip) return;
      await replaceTripWith(changedTrip);
      if (changedDay) {
        await updateRoutesBasedOnChanges(
          changedDay,
          changedTrip,
          async (newlyChangedTrip) => {
            await replaceTripWith(newlyChangedTrip);
          },
        );
      }
    },
    [trip],
  );
  if (!trip) {
    return null;
  }
  const replaceTripWith = async (newTrip: Trip) => {
    setTrip(newTrip);
    await saveTrip(newTrip);
  };

  return (
    <div className={styles.container}>
      <MapView className={styles.map}>
        {pois.map((poi, i) => (
          <Marker
            key={`marker-${i}`}
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
        selectedDayId={selectedDayId}
        onDaySelect={handleDaySelect}
        onAppendDay={handleAppendDay}
        onRemoveDay={handleRemoveDay}
        onChange={handleTripChange}
      />
    </div>
  );
};
