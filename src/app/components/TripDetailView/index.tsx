import { Button } from 'antd';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { getDayIndex, updateDayOfTrip } from '@/core/biz';
import type { DriveRoute, Trip, TripDay } from '@/core/types';

import { ActivitiesEditor } from '../ActivitiesEditor';
import { RouteListView } from '../RouteListView';
import { TripBanner } from '../TripBanner';
import { TripDayListView } from '../TripDayListView';

import styles from './index.module.less';

export interface TripDetailViewProps {
  className?: string;
  trip: Trip;
  selectedDayId: string | null;
  onChange?: (trip: Trip, day: TripDay | null) => void;
  onDaySelect?: (dayId: string | null) => void;
  onAppendDay?: () => void;
  onRemoveDay?: (dayId: string) => void;
}

export const TripDetailView = ({
  className,
  trip: trip,
  selectedDayId,
  onChange,
  onDaySelect,
  onAppendDay,
  onRemoveDay,
}: TripDetailViewProps) => {
  const [selectedDay, setSelectedDay] = useState<TripDay | null>(null);
  const [routes, setRoutes] = useState<DriveRoute[]>([]);
  useEffect(() => {
    const d = trip.days.find((day) => day.id === selectedDayId) || null;
    setSelectedDay(d);
    if (d?.route) {
      setRoutes([d.route]);
    } else {
      setRoutes([]);
    }
  }, [selectedDayId, trip]);
  const handleDaySelect = useCallback(
    (dayId: string | null) => {
      if (onDaySelect) {
        onDaySelect(dayId);
      }
    },
    [onDaySelect],
  );
  const handleActivitiesChanged = useCallback(
    async (day: TripDay) => {
      const changedTrip = updateDayOfTrip(day, trip);
      if (onChange) {
        onChange(changedTrip, day);
      }
    },
    [onChange, trip],
  );
  return (
    <div className={cn(styles.container, className)}>
      <header>
        <TripBanner trip={trip} />
      </header>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <TripDayListView
            className={styles.dayList}
            trip={trip}
            selection={selectedDayId}
            onSelect={handleDaySelect}
            onAppendDay={onAppendDay}
          />
        </nav>
        <main className={styles.mainContent}>
          {selectedDay && (
            <>
              <section>
                <h3>目的地</h3>
                <ActivitiesEditor
                  trip={trip}
                  day={selectedDay}
                  onChange={handleActivitiesChanged}
                />
              </section>
              {routes.length > 0 && (
                <section>
                  <h3>行程</h3>
                  <RouteListView
                    routes={
                      routes.length
                        ? routes
                        : selectedDay.route
                        ? [selectedDay.route]
                        : []
                    }
                  />
                </section>
              )}
              {selectedDayId && getDayIndex(selectedDay, trip) !== 0 ? (
                <section>
                  <Button
                    danger
                    block
                    size="large"
                    shape="round"
                    onClick={() => {
                      if (onRemoveDay) {
                        onRemoveDay(selectedDayId);
                      }
                    }}
                  >
                    移除此日程
                  </Button>
                </section>
              ) : null}
            </>
          )}
        </main>
      </main>
    </div>
  );
};
