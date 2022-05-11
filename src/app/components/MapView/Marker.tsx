import { memo, useContext, useEffect, useRef } from 'react';

import { MapContext } from './context';

export interface MarkerProps {
  title?: string | null;
  location: AMap.LngLatLike;
  autoZoom?: boolean;
}

export const Marker = memo(({ title, location, autoZoom }: MarkerProps) => {
  const ref = useRef<AMap.Marker | undefined>();
  const map = useContext(MapContext);
  useEffect(() => {
    if (map) {
      if (!ref.current) {
        ref.current = new AMap.Marker({ position: location as AMap.Vector2 });
        map.add(ref.current);
      }
      if (title) {
        ref.current.setLabel({
          content: title,
          offset: [0, 0],
          direction: 'bottom',
        });
      } else {
        ref.current.setLabel({
          content: '',
          offset: [0, 0],
          direction: 'bottom',
        });
      }
      ref.current.setPosition(location as AMap.Vector2);
      if (autoZoom) {
        map.setCenter(location);
      }
    }
    return () => {
      if (map && ref.current) {
        map.remove(ref.current);
        ref.current = undefined;
      }
    };
  }, [title, location, autoZoom, map]);
  return null;
});
Marker.displayName = 'Marker';
