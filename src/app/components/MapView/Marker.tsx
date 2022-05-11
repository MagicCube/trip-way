import { memo, useContext, useEffect, useRef } from 'react';

import { MapContext } from './context';

export interface MarkerProps {
  location: AMap.LngLatLike;
}

export const Marker = memo(({ location }: MarkerProps) => {
  const ref = useRef<AMap.Marker | undefined>();
  const map = useContext(MapContext);
  useEffect(() => {
    if (map) {
      if (!ref.current) {
        ref.current = new AMap.Marker({ position: location as AMap.Vector2 });
        map.add(ref.current);
      } else {
        ref.current.setPosition(location as AMap.Vector2);
      }
    }
    return () => {
      if (map && ref.current) {
        map.remove(ref.current);
      }
    };
  }, [location, map]);
  return null;
});
Marker.displayName = 'Marker';
