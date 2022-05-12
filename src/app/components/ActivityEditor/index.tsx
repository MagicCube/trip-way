import {
  HolderOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
} from '@ant-design/icons';
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
  allowInsertBefore?: boolean;
  allowRemove?: boolean;
  allowReorder?: boolean;
  onChange?: (activity: Activity) => void;
  onInsertBefore?: (activityId: string) => void;
  onRemove?: (activityId: string) => void;
}

let __globalDragTooltipVisible = true;

export const ActivityEditor = memo(
  ({
    className,
    activity,
    readonly,
    autoFocus,
    allowInsertBefore,
    allowRemove,
    allowReorder,
    onChange,
    onInsertBefore,
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
    const handleInsertBefore = useCallback(() => {
      if (onInsertBefore) {
        onInsertBefore(activity.id);
      }
    }, [activity.id, onInsertBefore]);
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
              mouseEnterDelay={__globalDragTooltipVisible ? 0.1 : 5}
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
          {allowInsertBefore !== false && (
            <Tooltip title="插入目的地">
              <div
                className={cn(styles.insertButton, styles.before)}
                onClick={handleInsertBefore}
              >
                <PlusCircleFilled />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  },
);
ActivityEditor.displayName = 'ActivityEditor';
