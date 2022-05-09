import cn from 'classnames';
import { memo, useCallback, useMemo } from 'react';

import type { Trip, TripDay } from '@/core/types';
import { formatDay } from '@/core/util/format';

import styles from './index.module.less';
import moment from 'moment';

export interface TripDayListViewProps {
  className?: string;
  trip: Trip;
  selection: string | null;
  onSelect: (dayId: string | null) => void;
}

export const TripDayListView = memo(
  ({
    className,
    trip,
    selection,
    onSelect: onChange,
  }: TripDayListViewProps) => {
    const handleDayClick = useCallback(
      (day: TripDay | null) => {
        onChange(day?.id || null);
      },
      [onChange],
    );
    return (
      <ul className={cn(styles.container, className)}>
        <TripDayListItem
          key="all-day"
          day={null}
          trip={trip}
          active={selection === null}
          onClick={handleDayClick}
        />
        {trip.days.map((day, dayIndex) => (
          <TripDayListItem
            key={day.id}
            day={day}
            dayIndex={dayIndex}
            trip={trip}
            active={day.id === selection}
            onClick={handleDayClick}
          />
        ))}
      </ul>
    );
  },
);
TripDayListView.displayName = 'TripDayListView';

export const TripDayListItem = memo(
  ({
    day,
    dayIndex,
    trip,
    active,
    onClick,
  }: {
    day: TripDay | null;
    dayIndex?: number;
    trip: Trip;
    active: boolean;
    onClick: (day: TripDay | null) => void;
  }) => {
    const dayDisplayName = useMemo(
      () => moment(trip.startDate).add(dayIndex, 'days').format('M月D日 ddd'),
      [dayIndex, trip.startDate],
    );
    return (
      <li
        className={cn(styles.item, active && styles.active)}
        onClick={() => onClick(day)}
      >
        <div className={styles.itemContent}>
          {day !== null && dayIndex !== undefined ? (
            <>
              <div className={styles.left}>
                <div className={styles.dayIndex}>Day {dayIndex + 1}</div>
                <div className={styles.displayName}>{formatDay(day, trip)}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.date}>{dayDisplayName}</div>
                <div>300km，7.5h</div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.left}>
                <div className={styles.desc}>全程概览</div>
              </div>
              <div className={styles.right}>
                <div>300km，7.5h</div>
              </div>
            </>
          )}
        </div>
      </li>
    );
  },
);
TripDayListItem.displayName = 'TripDayListItem';
