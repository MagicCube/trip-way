import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import cn from 'classnames';
import { memo, useCallback, useMemo } from 'react';

import { sumTripDistance } from '@/core/biz';
import type { Trip, TripDay } from '@/core/types';
import { formatDay, formatDistance, formatDuration } from '@/core/util/format';

import styles from './index.module.less';
import moment from 'moment';

export interface TripDayListViewProps {
  className?: string;
  trip: Trip;
  selection: string | null;
  onSelect: (dayId: string | null) => void;
  onAppendDay?: () => void;
}

export const TripDayListView = memo(
  ({
    className,
    trip,
    selection,
    onSelect: onChange,
    onAppendDay,
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
          onAppendDay={onAppendDay}
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
        <li className={styles.newItem}>
          <Button
            type="link"
            icon={
              <PlusCircleOutlined style={{ marginLeft: 2, marginRight: 6 }} />
            }
            onClick={onAppendDay}
          >
            添加下一日程
          </Button>
        </li>
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
    onAppendDay?: () => void;
  }) => {
    const dayDisplayName = useMemo(
      () =>
        moment(trip.departureDate).add(dayIndex, 'days').format('M月D日 ddd'),
      [dayIndex, trip.departureDate],
    );
    return (
      <li
        className={cn(styles.item, active && styles.active)}
        onClick={() => onClick(day)}
      >
        <div className={styles.itemContent}>
          {day !== null && dayIndex !== undefined ? (
            <>
              <div className={styles.dayIndex}>D{dayIndex + 1}</div>
              <div className={styles.left}>
                <div className={styles.day}>{dayDisplayName}</div>
                <div className={styles.displayName}>{formatDay(day, trip)}</div>
              </div>
              <div className={styles.right}>
                {day.route ? (
                  <div className={styles.routeInfo}>
                    {day.route.distance > 0 && (
                      <div className={styles.distance}>
                        {formatDistance(day.route.distance, 'short')}
                      </div>
                    )}
                    {day.route.time > 0 && (
                      <div
                        className={cn(
                          styles.duration,
                          day.route.time > 8 * 60 * 60
                            ? styles.warning
                            : undefined,
                        )}
                      >
                        {formatDuration(day.route.time, 'short')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.routeInfo}>
                    <div className={styles.distance}>0 公里</div>
                    <div className={styles.duration}>0 分钟</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.left}>
                <div className={cn(styles.displayName, styles.general)}>
                  全程概览
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.distance}>
                  {formatDistance(sumTripDistance(trip), 'short')}
                </div>
              </div>
            </>
          )}
        </div>
      </li>
    );
  },
);
TripDayListItem.displayName = 'TripDayListItem';
