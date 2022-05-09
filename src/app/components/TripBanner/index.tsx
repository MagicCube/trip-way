import cn from 'classnames';
import { memo } from 'react';

import type { Trip } from '@/core/types';

import styles from './index.module.less';

export interface TripBannerProps {
  className?: string;
  trip: Trip;
}

export const TripBanner = memo(({ className, trip }: TripBannerProps) => {
  return (
    <div
      className={cn(styles.container, className)}
      style={{ backgroundImage: `url(${trip.coverImageURL})` }}
    >
      <div className={styles.darken}></div>
      <div className={styles.content}>
        <div className={styles.titleAndDesc}>
          <h2 className={styles.title}>{trip.title}</h2>
          <div className={styles.desc}>{trip.description}</div>
        </div>
      </div>
    </div>
  );
});
TripBanner.displayName = 'TripBanner';
