export * from './POIService';

export function ready() {
  return new Promise<void>((resolve) => {
    AMap.plugin(['AMap.AutoComplete', 'AMap.PlaceSearch'], () => {
      resolve();
    });
  });
}
