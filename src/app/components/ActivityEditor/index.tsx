import { HolderOutlined, MinusCircleFilled } from '@ant-design/icons';
import cn from 'classnames';
import { memo, useCallback, useState } from 'react';

import { updatePOIOfActivity } from '@/core/biz';
import type { Activity, DetailedPOI } from '@/core/types';

import { POIInput } from '../POIInput';

import styles from './index.module.less';
import { Tooltip } from 'antd';

export interface ActivityEditorProps {
  className?: string;
  activity: Activity;
  readonly?: boolean;
  autoFocus?: boolean;
  allowReorder?: boolean;
  allowRemove?: boolean;
  onChange?: (activity: Activity) => void;
  onRemove?: (activityId: string) => void;
}

let __globalDragTooltipVisible = true;

export const ActivityEditor = memo(
  ({
    className,
    activity,
    readonly,
    autoFocus,
    allowReorder,
    allowRemove,
    onChange,
    onRemove,
  }: ActivityEditorProps) => {
    const [dragTooltipVisible, setDragTooltipVisible] = useState(
      __globalDragTooltipVisible,
    );
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
    const handleDragTooltipVisibleChange = useCallback(
      (visible: boolean) => {
        if (dragTooltipVisible && visible) {
          setDragTooltipVisible(false);
          __globalDragTooltipVisible = false;
        }
      },
      [dragTooltipVisible],
    );
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.left}>
          {allowReorder !== false && (
            <Tooltip
              title={
                <p>
                  拖动可重新排序，
                  <br />
                  或移动至其他日期
                </p>
              }
              mouseEnterDelay={__globalDragTooltipVisible ? 0.5 : 5}
              onVisibleChange={handleDragTooltipVisibleChange}
            >
              <HolderOutlined className={styles.handlebar} />
            </Tooltip>
          )}
        </div>
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
            <Tooltip title="移除此目的地">
              <MinusCircleFilled
                className={styles.removeButton}
                onClick={handleRemove}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  },
);
ActivityEditor.displayName = 'ActivityEditor';
