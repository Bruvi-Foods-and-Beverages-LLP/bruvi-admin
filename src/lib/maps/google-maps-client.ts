import { AutocompletePrediction, ParsedAddress, StaticMapOptions } from "@/types/maps";
import { getCachedGoogleMapsApiKey } from "./google-maps-loader";

/**
 * In-memory LRU cache to prevent redundant API calls for recently fetched places
 */
const detailsCache = new Map<string, ParsedAddress>();
const reverseGeocodeCache = new Map<string, ParsedAddress>();

/**
 * Generates a random session token for Google Places Autocomplete billing grouping
 */
export function generateGoogleMapsSessionToken(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Searches places using Google Places Autocomplete API via the Next.js BFF proxy
 */
export async function searchPlaces(
  query: string,
  options: {
    sessionToken?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    signal?: AbortSignal;
  } = {}
): Promise<AutocompletePrediction[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const searchParams = new URLSearchParams({ query: trimmed });
  if (options.sessionToken) searchParams.set("sessionToken", options.sessionToken);
  if (options.latitude !== undefined) searchParams.set("latitude", String(options.latitude));
  if (options.longitude !== undefined) searchParams.set("longitude", String(options.longitude));
  if (options.radius !== undefined) searchParams.set("radius", String(options.radius));

  try {
    const res = await fetch(`/api/proxy/maps/autocomplete?${searchParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: options.signal,
    });

    if (!res.ok) {
      console.warn(`Autocomplete request returned status: ${res.status}`);
      return [];
    }

    const json = await res.json();
    const predictions = json?.data?.data?.predictions || json?.data?.predictions || [];
    return Array.isArray(predictions) ? predictions : [];
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return [];
    }
    console.error("Error searching places:", error);
    return [];
  }
}

/**
 * Fetches full place details (lat, lng, address components) by Google Place ID
 */
export async function getPlaceDetails(
  placeId: string,
  sessionToken?: string
): Promise<ParsedAddress | null> {
  const cleanId = placeId.trim().replace(/^places\//, "");
  if (!cleanId) return null;

  if (detailsCache.has(cleanId)) {
    return detailsCache.get(cleanId)!;
  }

  const searchParams = new URLSearchParams();
  if (sessionToken) searchParams.set("sessionToken", sessionToken);

  try {
    const url = `/api/proxy/maps/place-details/${encodeURIComponent(cleanId)}${
      sessionToken ? `?${searchParams.toString()}` : ""
    }`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.warn(`Place details request failed with status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    const address = json?.data?.data?.address || json?.data?.address;

    if (address && typeof address.latitude === "number" && typeof address.longitude === "number") {
      detailsCache.set(cleanId, address);
      return address;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching place details for ${cleanId}:`, error);
    return null;
  }
}

/**
 * Reverse geocodes coordinates (lat, lng) into structured address details
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ParsedAddress | null> {
  const roundedKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (reverseGeocodeCache.has(roundedKey)) {
    return reverseGeocodeCache.get(roundedKey)!;
  }

  try {
    const res = await fetch(`/api/proxy/maps/reverse-geocode?lat=${lat}&lng=${lng}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.warn(`Reverse geocode request failed with status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    const address = json?.data?.data?.address || json?.data?.address;

    if (address) {
      reverseGeocodeCache.set(roundedKey, address);
      return address;
    }

    return null;
  } catch (error) {
    console.error(`Error in reverseGeocode (${lat}, ${lng}):`, error);
    return null;
  }
}

/**
 * Builds Google Static Map URL using the configured Google Maps API Key
 */
export function getStaticMapUrl({
  latitude,
  longitude,
  zoom = 16,
  width = 600,
  height = 260,
  scale = 2,
  markerColor = "0x1C3A66",
  includeMarker = true,
}: StaticMapOptions): string {
  const apiKey =
    getCachedGoogleMapsApiKey() ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyBB0jvvnQ5YRme4JPOQQwruPFy7IPLCO2g";

  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("center", `${latitude},${longitude}`);
  url.searchParams.set("zoom", String(zoom));
  url.searchParams.set("size", `${width}x${height}`);
  url.searchParams.set("scale", String(scale));
  url.searchParams.set("maptype", "roadmap");
  if (includeMarker) {
    url.searchParams.set("markers", `color:${markerColor}|${latitude},${longitude}`);
  }
  url.searchParams.set("key", apiKey);

  // Apply subtle modern styling
  url.searchParams.append("style", "feature:poi|visibility:off");
  url.searchParams.append("style", "feature:transit|visibility:simplified");

  return url.toString();
}

