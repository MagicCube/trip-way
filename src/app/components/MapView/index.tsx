import { memo, useEffect, useRef, useState } from 'react';

import { MapContext } from './context';
import type { MarkerProps } from './Marker';
import type { PolylineProps } from './Polyline';

export * from './Marker';
export * from './Polyline';

type MapElement =
  | React.ReactElement<MarkerProps>
  | React.ReactElement<PolylineProps>;

type MapElementAsChild = null | MapElement | MapElement[];

export interface MapViewProps {
  className?: string;
  children?: MapElementAsChild | MapElementAsChild[];
}

export const MapView = memo(({ className, children }: MapViewProps) => {
  const [map, setMap] = useState<AMap.Map | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!map && containerRef.current) {
      setMap(new AMap.Map(containerRef.current));
    }
  }, [map]);
  return (
    <MapContext.Provider value={map}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </MapContext.Provider>
  );
});
MapView.displayName = 'MapView';
