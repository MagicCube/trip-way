import cn from 'classnames';

import styles from './index.module.less';

export interface TripListPageProps {
  className?: string;
}

export const TripListPage = ({ className }: TripListPageProps) => {
  return <div className={cn(styles.container, className)}>TripListPage</div>;
};
