import { useContext, useEffect, useRef } from 'react';

import { MapContext } from './context';

export interface PolylineProps {
  path: AMap.LngLatLike[];
}

export const Polyline = ({ path }: PolylineProps) => {
  const ref = useRef<AMap.Polyline | undefined>();
  const map = useContext(MapContext);
  useEffect(() => {
    if (map) {
      console.info(path);
      if (!ref.current) {
        ref.current = new AMap.Polyline({
          path,
          strokeWeight: 6,
          strokeColor: 'blue',
          lineJoin: 'round',
        });
        map.add(ref.current);
      } else {
        ref.current.setPath(path);
      }
    }
    return () => {
      if (map && ref.current) {
        map.remove(ref.current);
      }
    };
  }, [map, path]);
  return null;
};