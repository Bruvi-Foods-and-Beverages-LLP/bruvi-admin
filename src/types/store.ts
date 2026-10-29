/**
 * Store Status Enum
 */
export type StoreStatus = "ACTIVE" | "PAUSED" | "MAINTENANCE" | "COMING_SOON";

/**
 * Outlet definition for multi-store operations (Figma A010 - A018)
 */
export interface StoreOutlet {
  id: string;
  name: string;
  code: string; // e.g., 'INDIRANAGAR-01', 'BANDRA-02'
  city: string;
  state: string;
  status: StoreStatus;
  isOrdersPaused: boolean;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  gstin: string;
  fssaiNumber: string;
  activeShiftLead?: string;
  activeRidersCount?: number;
}

