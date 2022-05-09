import cn from 'classnames';
import { memo, useCallback } from 'react';

import { updatePOIOfActivity } from '@/core/biz';
import type { Activity, DetailedPOI } from '@/core/types';

import { POIInput } from '../POIInput';

import styles from './index.module.less';

export interface ActivityEditorProps {
  className?: string;
  activity: Activity;
  onChange?: (activity: Activity) => void;
}

export const ActivityEditor = memo(
  ({ className, activity, onChange }: ActivityEditorProps) => {
    const handleChange = useCallback(
      (poi: DetailedPOI) => {
        const changedActivity = updatePOIOfActivity(poi, activity);
        if (onChange) {
          onChange(changedActivity);
        }
      },
      [activity, onChange],
    );
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <POIInput
            className={styles.input}
            value={activity.poi}
            onChange={handleChange}
          />
        </div>
        <div className={styles.right}></div>
      </div>
    );
  },
);
ActivityEditor.displayName = 'ActivityEditor';
