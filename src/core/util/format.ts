import moment from 'moment';

import { getActivitiesOfDay } from '../biz';
import type { Activity, DetailedPOI, Trip, TripDay } from '../types';

export function to1Decimal(num: number) {
  const result = num.toFixed(1);
  if (result.endsWith('.0')) {
    return result.replace('.0', '');
  }
  return result;
}

export function formatDistance(
  distanceInMeter: number,
  mode?: 'normal' | 'short',
) {
  if (mode === 'short') {
    return `${(distanceInMeter / 1000).toFixed(0)} 公里`;
  }
  return `${to1Decimal(distanceInMeter / 1000)} 公里`;
}

export function formatDuration(
  durationInSeconds: number,
  mode?: 'normal' | 'short',
) {
  const duration = moment.duration(durationInSeconds * 1000);
  const hours = duration.days() * 24 + duration.hours();
  const minutes = duration.minutes();
  if (mode === 'short') {
    if (hours < 1) {
      return `${minutes} 分钟`;
    }
    return `${to1Decimal(duration.asHours())} 小时`;
  }
  return `${hours > 0 ? `${hours} 小时` : ''}${
    minutes > 0 ? ` ${minutes} 分钟` : ''
  }`;
}

export function formatAdministrativeArea(name: string) {
  if (name.endsWith('区') || name.endsWith('市') || name.endsWith('县')) {
    return name.substring(0, name.length - 1);
  }
  return name;
}

export function formatPOI(poi: DetailedPOI) {
  let result: string;
  if (poi.type.includes('地名')) {
    result = poi.name;
  }
  result = poi.adname.endsWith('区') ? poi.cityname : poi.adname;
  return formatAdministrativeArea(result);
}

export function formatDay(day: TripDay, trip: Trip) {
  const activities = getActivitiesOfDay(day, trip);
  for (let i = activities.length - 1; i >= 0; i--) {
    const activity = activities[i];
    if (activity.poi) {
      return formatActivity(activity);
    }
  }
  return '未知';
}

export function formatActivity(activity: Activity) {
  if (activity.poi) {
    const poi = activity.poi;
    return formatPOI(poi);
  }
  return '未知';
}
