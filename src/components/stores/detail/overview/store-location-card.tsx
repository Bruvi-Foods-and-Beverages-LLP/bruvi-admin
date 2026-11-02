"use client";

import * as React from "react";
import { StoreEntity } from "@/store/slices/stores-slice";
import { getStaticMapUrl } from "@/lib/maps/google-maps-client";
import { fetchGoogleMapsApiKey } from "@/lib/maps/google-maps-loader";
import { StoreInteractiveMapModal } from "./store-interactive-map-modal";

interface StoreLocationCardProps {
  store: StoreEntity;
}

export function StoreLocationCard({ store }: StoreLocationCardProps) {
  const [mapError, setMapError] = React.useState(false);
  const [isInteractiveModalOpen, setIsInteractiveModalOpen] = React.useState(false);

  // Fetch backend Google Maps configuration and API key on mount
  React.useEffect(() => {
    fetchGoogleMapsApiKey().catch(() => {});
  }, []);

  const lat = typeof store.latitude === "number" && !isNaN(store.latitude) ? store.latitude : 12.9784;
  const lng = typeof store.longitude === "number" && !isNaN(store.longitude) ? store.longitude : 77.6408;

  const fullAddress = [
    store.addressLine1,
    store.addressLine2,
    store.city,
    store.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const staticMapUrl = React.useMemo(() => {
    return getStaticMapUrl({
      latitude: lat,
      longitude: lng,
      zoom: 18,
      width: 400,
      height: 120,
      scale: 2,
      includeMarker: true,
      markerColor: "0x1C3A66",
    });
  }, [lat, lng]);

  return (
    <>
      <div className="flex flex-col rounded-[16px] bg-surface border border-border shadow-sm overflow-hidden">
        {/* Real Google Map Preview: Clean & Unbadged (Click to open interactive map modal) */}
        <button
          type="button"
          onClick={() => setIsInteractiveModalOpen(true)}
          title="Click to view interactive map"
          className="relative h-[120px] w-full bg-[#f4f2ec] overflow-hidden border-b border-border group block cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        >
          {!mapError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={staticMapUrl}
              alt={`Location map of ${store.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setMapError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#f4f2ec] text-text-muted text-caption">
              Tap to view interactive map
            </div>
          )}
        </button>

        {/* Store Location Details Body (Figma Node 225:86758) */}
        <div className="flex flex-col gap-4 p-5">
          {/* Address */}
          <div className="flex flex-col gap-1">
            <span className="text-caption text-text-muted">Address</span>
            <p className="text-body-s text-text font-normal leading-snug">
              {fullAddress || "Address details on file"}
            </p>
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-text-muted">Phone</span>
              <span className="text-body-s text-text font-normal truncate">
                {store.phone || "--"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-caption text-text-muted">Email</span>
              <span className="text-body-s text-text font-normal truncate">
                {store.email || "--"}
              </span>
            </div>
          </div>

          {/* GSTIN & Geofence Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-text-muted">GSTIN</span>
              <span className="text-body-s text-text font-mono truncate">
                {store.gstin || "--"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-caption text-text-muted">Geofence</span>
              <span className="text-body-s text-text font-normal">
                {store.geofenceRadiusMeters || 50} m radius
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Read-Only Store Location & Geofence Modal */}
      <StoreInteractiveMapModal
        isOpen={isInteractiveModalOpen}
        onClose={() => setIsInteractiveModalOpen(false)}
        storeName={store.name}
        latitude={lat}
        longitude={lng}
        address={fullAddress}
        geofenceRadiusMeters={store.geofenceRadiusMeters || 50}
        phone={store.phone}
        city={store.city}
      />
    </>
  );
}
