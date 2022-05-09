import cn from 'classnames';
import { useCallback, useMemo } from 'react';

import {
  getActivitiesOfDay,
  getDayIndex,
  updateActivityOfDay,
} from '@/core/biz';
import type { Trip, Activity, TripDay } from '@/core/types';

import { ActivityEditor } from '../ActivityEditor';

import styles from './index.module.less';

export interface ActivitiesEditorProps {
  className?: string;
  day: TripDay;
  trip: Trip;
  onChange?: (day: TripDay) => void;
}

export const ActivitiesEditor = ({
  className,
  day,
  trip,
  onChange,
}: ActivitiesEditorProps) => {
  const activities = useMemo<Activity[]>(
    () => getActivitiesOfDay(day, trip),
    [day, trip],
  );

  const handleActivityChange = useCallback(
    (activity: Activity) => {
      const changedDay = updateActivityOfDay(activity, day);
      if (onChange) {
        onChange(changedDay);
      }
    },
    [day, onChange],
  );

  const dayIndex = useMemo(() => getDayIndex(day, trip), [day, trip]);

  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {activities.map((activity, i) => {
          return (
            <li key={activity.id} className={styles.item}>
              <ActivityEditor
                activity={activity}
                readonly={i === 0 && dayIndex !== 0}
                onChange={handleActivityChange}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
