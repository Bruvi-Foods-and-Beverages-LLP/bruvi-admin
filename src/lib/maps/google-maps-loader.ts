/**
 * Google Maps JavaScript SDK Singleton Loader
 * Dynamically retrieves configuration and API key from the backend service.
 */

let loadPromise: Promise<typeof google> | null = null;
let cachedApiKey: string | null = null;

/**
 * Fetches the active Google Maps API key from the backend configuration endpoint
 */
export async function fetchGoogleMapsApiKey(): Promise<string> {
  if (cachedApiKey) {
    return cachedApiKey;
  }

  try {
    const res = await fetch("/api/proxy/maps/config", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      const apiKey =
        json?.data?.data?.apiKey ||
        json?.data?.apiKey ||
        json?.apiKey;

      if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 5) {
        cachedApiKey = apiKey.trim();
        return cachedApiKey;
      }
    }
  } catch (err) {
    console.warn("Could not fetch Google Maps API key from backend config:", err);
  }

  const fallbackKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyBB0jvvnQ5YRme4JPOQQwruPFy7IPLCO2g";
  cachedApiKey = fallbackKey;
  return fallbackKey;
}

export function getCachedGoogleMapsApiKey(): string | null {
  return cachedApiKey;
}

export function loadGoogleMapsScript(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps script cannot be loaded on the server."));
  }

  // Already loaded
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  // Reuse in-flight promise
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    // Check if script tag already exists
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      if (window.google?.maps) {
        return window.google;
      }
      return new Promise<typeof google>((resolve, reject) => {
        existing.addEventListener("load", () => {
          if (window.google?.maps) resolve(window.google);
          else reject(new Error("Google Maps script loaded but google.maps is unavailable."));
        });
        existing.addEventListener("error", (e) => reject(e));
      });
    }

    const apiKey = await fetchGoogleMapsApiKey();

    return new Promise<typeof google>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps script loaded but google.maps is not defined."));
        }
      };

      script.onerror = (err) => {
        loadPromise = null;
        reject(err);
      };

      document.head.appendChild(script);
    });
  })();

  return loadPromise;
}

