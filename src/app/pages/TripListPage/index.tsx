import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Popover } from 'antd';
import cn from 'classnames';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { addNewTrip, deleteTrip, loadTrips } from '@/core/storage';
import type { Trip } from '@/core/types';
import { formatDistance } from '@/core/util/format';

import styles from './index.module.less';

export interface TripListPageProps {
  className?: string;
}

export const TripListPage = ({ className }: TripListPageProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadTrips().then((loadedTrips) => {
      setTrips(loadedTrips);
    });
  }, []);
  const handleAddNewTrip = useCallback(async () => {
    const tripId = await addNewTrip();
    navigate(`/trips/${tripId}`);
  }, [navigate]);
  const handleDeleteTrip = useCallback(async (tripId: string) => {
    await deleteTrip(tripId);
    setTrips((trips) => trips.filter((trip) => trip.id !== tripId));
  }, []);
  return (
    <div className={cn(styles.container, className)}>
      <header className={styles.header}>
        <h1>TripWay</h1>
      </header>
      <main className={styles.main}>
        <ul className={styles.list}>
          <li
            className={cn(styles.new, styles.item)}
            onClick={handleAddNewTrip}
          >
            <PlusOutlined />
            <span className={styles.newItemLabel}>添加新旅程</span>
          </li>
          {trips.map((trip) => {
            const totalDistance = trip.days.reduce(
              (acc, day) => acc + (day.route ? day.route?.distance : 0),
              0,
            );
            return (
              <Link key={trip.id} to={`/trips/${trip.id}`}>
                <li className={styles.item}>
                  <Card
                    className={styles.card}
                    extra={
                      <Popconfirm
                        title="确定要删除此旅程吗？"
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          e?.preventDefault();
                          handleDeleteTrip(trip.id);
                        }}
                      >
                        <Button type="link" size="small">
                          删除
                        </Button>
                      </Popconfirm>
                    }
                    title={trip.title}
                    style={{ width: 300 }}
                  >
                    <div className={styles.desc}>
                      {trip.description || '暂未描述'}
                    </div>
                    <div className={styles.details}>
                      <div className={styles.departureDate}>
                        {moment(trip.departureDate).format('M月D日')}出发
                      </div>
                      <div className={styles.days}>{trip.days.length} 天</div>
                      <div className={styles.distance}>
                        {formatDistance(totalDistance)}
                      </div>
                    </div>
                  </Card>
                </li>
              </Link>
            );
          })}
        </ul>
      </main>
    </div>
  );
};
