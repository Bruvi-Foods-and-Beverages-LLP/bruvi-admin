export interface AutocompletePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ParsedAddress {
  formattedAddress: string;
  houseFlat: string;
  areaStreet: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  nearestStoreText?: string;
  nearestStoreId?: string;
  distanceToNearestStoreKm?: number;
  isDeliveryServiceable?: boolean;
}

export interface GooglePlaceSuggestion {
  placeId: string;
  title: string;
  subtitle: string;
  fullAddress: string;
}

export interface StaticMapOptions {
  latitude: number;
  longitude: number;
  zoom?: number;
  width?: number;
  height?: number;
  scale?: 1 | 2;
  markerColor?: string;
  includeMarker?: boolean;
}

