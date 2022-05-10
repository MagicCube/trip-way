import cn from 'classnames';
import { useCallback, useMemo, useState } from 'react';

import type { Trip, TripDay } from '@/core/types';
import { updateDayOfTrip } from '@/core/biz';

import { ActivitiesEditor } from '../ActivitiesEditor';
import { TripBanner } from '../TripBanner';
import { TripDayListView } from '../TripDayListView';

import styles from './index.module.less';

export interface TripDetailViewProps {
  className?: string;
  trip: Trip;
  onChange?: (trip: Trip, day: TripDay | null) => void;
}

export const TripDetailView = ({
  className,
  trip: trip,
  onChange,
}: TripDetailViewProps) => {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const handleDaySelect = useCallback((dayId: string | null) => {
    setSelectedDayId(dayId);
  }, []);
  const handleActivitiesChanged = useCallback(
    (day: TripDay) => {
      const changedTrip = updateDayOfTrip(day, trip);
      if (onChange) {
        onChange(changedTrip, day);
      }
    },
    [onChange, trip],
  );
  const selectedDay = useMemo(
    () => trip.days.find((day) => day.id === selectedDayId),
    [selectedDayId, trip.days],
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
          />
        </nav>
        <main className={styles.mainContent}>
          {selectedDay && (
            <section>
              <h3>目的地</h3>
              <ActivitiesEditor
                trip={trip}
                day={selectedDay}
                onChange={handleActivitiesChanged}
              />
            </section>
          )}
        </main>
      </main>
    </div>
  );
};
