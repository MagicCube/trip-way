import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import cn from 'classnames';
import { useCallback, useMemo } from 'react';

import {
  appendNewActivityToDay,
  getActivitiesOfDay,
  getDayIndex,
  removeActivityFromDay,
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
  const dayIndex = useMemo(() => getDayIndex(day, trip), [day, trip]);

  const handleActivityChange = useCallback(
    (activity: Activity) => {
      const changedDay = updateActivityOfDay(activity, day);
      if (onChange) {
        onChange(changedDay);
      }
    },
    [day, onChange],
  );

  const handleActivityAppend = useCallback(() => {
    const changedDay = appendNewActivityToDay(day);
    if (onChange) {
      onChange(changedDay);
    }
  }, [day, onChange]);

  const handleActivityRemove = useCallback(
    (activityId: string) => {
      const changedDay = removeActivityFromDay(activityId, day);
      if (onChange) {
        onChange(changedDay);
      }
    },
    [day, onChange],
  );

  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {activities.map((activity, i) => {
          const readonly = i === 0 && dayIndex !== 0;
          const allowRemove = !readonly && !(i === 0 && dayIndex === 0);
          return (
            <li key={activity.id} className={styles.item}>
              <ActivityEditor
                activity={activity}
                autoFocus={activity.poi === undefined}
                readonly={readonly}
                allowRemove={allowRemove}
                onChange={handleActivityChange}
                onRemove={handleActivityRemove}
              />
            </li>
          );
        })}
        <li className={styles.appendItem}>
          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            onClick={handleActivityAppend}
          >
            添加新行程
          </Button>
        </li>
      </ul>
    </div>
  );
};
