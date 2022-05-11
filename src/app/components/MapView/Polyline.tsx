import { useContext, useEffect, useRef } from 'react';

import { MapContext } from './context';

export interface PolylineProps {
  path: AMap.LngLatLike[];
  autoZoom?: boolean;
}

export const Polyline = ({ path, autoZoom }: PolylineProps) => {
  const ref = useRef<AMap.Polyline | undefined>();
  const map = useContext(MapContext);
  useEffect(() => {
    if (map) {
      if (!ref.current) {
        ref.current = new AMap.Polyline({
          path,
          showDir: true,
          strokeWeight: 6,
          strokeColor: 'blue',
          lineJoin: 'round',
        });
        map.add(ref.current);
      } else {
        ref.current.setPath(path);
      }
      if (autoZoom) {
        const bounds = ref.current.getBounds();
        if (bounds) {
          map.setBounds(bounds, false, [64, 64, 64, 64]);
        }
      }
    }
    return () => {
      if (map && ref.current) {
        map.remove(ref.current);
        ref.current = undefined;
      }
    };
  }, [autoZoom, map, path]);
  return null;
};
