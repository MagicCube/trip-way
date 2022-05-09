import { MinusCircleFilled } from '@ant-design/icons';
import cn from 'classnames';
import { memo, useCallback } from 'react';

import { updatePOIOfActivity } from '@/core/biz';
import type { Activity, DetailedPOI } from '@/core/types';

import { POIInput } from '../POIInput';

import styles from './index.module.less';

export interface ActivityEditorProps {
  className?: string;
  activity: Activity;
  readonly?: boolean;
  autoFocus?: boolean;
  allowRemove?: boolean;
  onChange?: (activity: Activity) => void;
  onRemove?: (activityId: string) => void;
}

export const ActivityEditor = memo(
  ({
    className,
    activity,
    readonly,
    autoFocus,
    allowRemove,
    onChange,
    onRemove,
  }: ActivityEditorProps) => {
    const handleChange = useCallback(
      (poi: DetailedPOI | null) => {
        const changedActivity = updatePOIOfActivity(poi, activity);
        if (onChange) {
          onChange(changedActivity);
        }
      },
      [activity, onChange],
    );
    const handleRemove = useCallback(() => {
      if (onRemove) {
        onRemove(activity.id);
      }
    }, [activity, onRemove]);
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <POIInput
            className={styles.input}
            value={activity.poi}
            autoFocus={autoFocus}
            disabled={readonly}
            onChange={handleChange}
          />
        </div>
        <div className={styles.right}>
          {allowRemove !== false && (
            <MinusCircleFilled
              className={styles.removeButton}
              onClick={handleRemove}
            />
          )}
        </div>
      </div>
    );
  },
);
ActivityEditor.displayName = 'ActivityEditor';
