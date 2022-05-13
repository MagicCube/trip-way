import { getPOIsOfDay } from '@/core/biz';
import type { DetailedPOI, DriveRoute, Trip, TripDay } from '@/core/types';
import { formatDistance, formatDuration } from '@/core/util/format';
import { Timeline } from 'antd';
import cn from 'classnames';
import { memo } from 'react';

import styles from './index.module.less';

export interface RouteListViewProps {
  className?: string;
  day: TripDay;
  trip: Trip;
  routes: DriveRoute[];
}

export const RouteListView = memo(
  ({ className, day, trip, routes }: RouteListViewProps) => {
    if (routes.length === 0) {
      return null;
    }
    const pois = getPOIsOfDay(day, trip);
    return (
      <div className={styles.container}>
        <ul className={cn(styles.list, className)}>
          {routes.map((route, i) => {
            return (
              <RouteListViewItem
                key={route.id}
                routeIndex={i}
                route={route}
                pois={pois}
              />
            );
          })}
        </ul>
      </div>
    );
  },
);
RouteListView.displayName = 'RouteListView';

const RouteListViewItem = memo(
  ({
    routeIndex,
    pois,
    route,
  }: {
    routeIndex: number;
    pois: DetailedPOI[];
    route: DriveRoute;
  }) => {
    return (
      <li className={styles.item} key={route.policy}>
        <h4 className={styles.policy}>方案 {routeIndex + 1}：速度最快</h4>
        <div className={styles.details}>
          <span>约 {formatDuration(route.time)}</span>
          <span>{formatDistance(route.distance)}</span>
          <span
            className={cn(
              styles.toll,
              route && route.tolls === 0 ? styles.freeOfCharge : undefined,
            )}
          >
            {route.tolls ? `收费 ${route.tolls} 元` : '免费'}
          </span>
        </div>
        <div className={styles.timelineContainer}>
          <Timeline mode="left" className={styles.timeline}>
            <Timeline.Item key={`step-0`} label={pois[0].name}>
              出发
            </Timeline.Item>
            {route.steps.map((step, stepIndex) => {
              return (
                <Timeline.Item
                  key={`step-${stepIndex}`}
                  label={pois[stepIndex + 1].name}
                >
                  <div className={styles.distance}>
                    {formatDistance(step.distance)}
                  </div>
                  <div className={styles.duration}>
                    {formatDuration(step.time)}
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      </li>
    );
  },
);
RouteListViewItem.displayName = 'RouteListViewItem';
