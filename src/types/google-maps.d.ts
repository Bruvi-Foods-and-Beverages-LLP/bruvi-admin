/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
  }

  namespace google {
    namespace maps {
      type Map = any;
      type Marker = any;
      type Circle = any;
      type LatLng = any;
      type LatLngLiteral = { lat: number; lng: number };
      type MapMouseEvent = { latLng?: { lat(): number; lng(): number } | null };
      const Map: any;
      const Marker: any;
      const Circle: any;
      const LatLng: any;
      const Size: any;
      const Point: any;
      const MapTypeId: any;
      const ControlPosition: any;
      const Animation: any;
    }
  }
}

export {};

