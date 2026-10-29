/**
 * Centralized City Model Contract
 * All city data is sourced directly from the unified backend City API (/api/proxy/cities).
 * Local persistent storage caches have been completely eliminated to prevent split-brain states.
 */
export interface CityModel {
  id?: string;
  name: string;
  code?: string;
  state: string;
  country?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  defaultGeofenceRadiusMeters?: number;
  cityName?: string;
  isActive?: boolean;
}
