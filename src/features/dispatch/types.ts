export type RiderStatus = "ONLINE_IDLE" | "ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "OFFLINE";

export interface DeliveryRider {
  id: string;
  fullName: string;
  phone: string;
  status: RiderStatus;
  vehicleType: "ELECTRIC_SCOOTER" | "MOTORCYCLE" | "BICYCLE";
  currentLatitude: number;
  currentLongitude: number;
  assignedOrderId?: string;
  batteryPercentage?: number;
  rating: number;
  totalDeliveriesToday: number;
  lastPingAt: string;
}

export interface DeliveryZonePolygon {
  id: string;
  storeId: string;
  zoneName: string;
  coordinates: Array<[number, number]>; // GeoJSON polygon coordinates [lng, lat]
  surgeFeeINR: number;
  estimatedDeliveryMinutes: number;
  isActive: boolean;
}

