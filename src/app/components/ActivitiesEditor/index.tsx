import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import cn from 'classnames';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useCallback, useMemo } from 'react';

import {
  appendNewActivityToDay,
  getLastActivityOfPreviousDay,
  insertNewActivityToDay,
  removeActivityFromDay,
  reorderActivitiesOfDay as reorderActivitiesOfDay,
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
  const lastActivity = useMemo(
    () => getLastActivityOfPreviousDay(day, trip),
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

  const handleAppendActivity = useCallback(() => {
    const changedDay = appendNewActivityToDay(day);
    if (onChange) {
      onChange(changedDay);
    }
  }, [day, onChange]);

  const handleInsertBefore = useCallback(
    (activityId: string) => {
      const changedDay = insertNewActivityToDay(activityId, day);
      if (onChange) {
        onChange(changedDay);
      }
    },
    [day, onChange],
  );

  const handleActivityRemove = useCallback(
    (activityId: string) => {
      const changedDay = removeActivityFromDay(activityId, day);
      if (onChange) {
        onChange(changedDay);
      }
    },
    [day, onChange],
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (result.destination) {
        const changedDay = reorderActivitiesOfDay(
          result.source.index,
          result.destination.index,
          day,
        );
        if (onChange) {
          onChange(changedDay);
        }
      }
    },
    [day, onChange],
  );

  const reachActivitiesLimit = day.activities.length >= 17;

  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {lastActivity && (
          <li className={styles.item}>
            <ActivityEditor
              activity={lastActivity}
              autoFocus={lastActivity.poi === undefined}
              readonly
              allowReorder={false}
              allowRemove={false}
              allowInsertBefore={false}
              onChange={handleActivityChange}
              onInsertBefore={handleInsertBefore}
              onRemove={handleActivityRemove}
            />
          </li>
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="activities">
            {(droppableProvided) => {
              return (
                <ul
                  ref={droppableProvided.innerRef}
                  className={styles.innerList}
                >
                  {day.activities.map((activity, activityIndex) => {
                    return (
                      <Draggable
                        key={activity.id}
                        draggableId={activity.id}
                        index={activityIndex}
                      >
                        {(draggableProvided) => {
                          return (
                            <li
                              ref={draggableProvided.innerRef}
                              className={styles.item}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                            >
                              <ActivityEditor
                                activity={activity}
                                autoFocus={activity.poi === undefined}
                                allowRemove={day.activities.length > 1}
                                onChange={handleActivityChange}
                                onInsertBefore={handleInsertBefore}
                                onRemove={handleActivityRemove}
                              />
                            </li>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}
                </ul>
              );
            }}
          </Droppable>
        </DragDropContext>
      </ul>
      {!reachActivitiesLimit && (
        <div className={styles.buttons}>
          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            onClick={handleAppendActivity}
          >
            ??????????????????
          </Button>
        </div>
      )}
    </div>
  );
};
