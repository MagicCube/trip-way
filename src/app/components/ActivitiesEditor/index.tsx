import cn from 'classnames';
import { useCallback, useMemo } from 'react';

import { getActivitiesOfDay, updateActivityOfDay } from '@/core/biz';
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

  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {activities.map((activity) => {
          return (
            <li key={activity.id} className={styles.item}>
              <ActivityEditor
                activity={activity}
                onChange={handleActivityChange}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
