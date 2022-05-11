import type { DriveRoute } from '@/core/types';
import { formatDistance, formatDuration } from '@/core/util/format';
import cn from 'classnames';
import { memo } from 'react';

import styles from './index.module.less';

export interface RouteListViewProps {
  className?: string;
  routes: DriveRoute[];
}

export const RouteListView = memo(
  ({ className, routes }: RouteListViewProps) => {
    if (routes.length === 0) {
      return null;
    }
    return (
      <div className={styles.container}>
        <ul className={cn(styles.list, className)}>
          {routes.map((route, i) => (
            <RouteListViewItem key={route.id} routeIndex={i} route={route} />
          ))}
        </ul>
      </div>
    );
  },
);
RouteListView.displayName = 'RouteListView';

const RouteListViewItem = memo(
  ({ routeIndex, route }: { routeIndex: number; route: DriveRoute }) => {
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
      </li>
    );
  },
);
RouteListViewItem.displayName = 'RouteListViewItem';
