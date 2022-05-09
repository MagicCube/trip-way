import { memo, useEffect, useRef } from 'react';

export interface MapViewProps {
  className?: string;
}

export const MapView = memo(({ className }: MapViewProps) => {
  const mapRef = useRef<AMap.Map>();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapRef.current && containerRef.current) {
      // mapRef.current = new AMap.Map(containerRef.current, {
      //   zoom: 11, //级别
      //   center: [116.397428, 39.90923], //中心点坐标
      //   viewMode: '3D', //使用3D视图
      // });
    }
  }, []);
  return <div ref={containerRef} className={className}></div>;
});
MapView.displayName = 'MapView';
