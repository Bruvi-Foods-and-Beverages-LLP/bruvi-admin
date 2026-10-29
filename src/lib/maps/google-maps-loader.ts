/**
 * Google Maps JavaScript SDK Singleton Loader
 */

let loadPromise: Promise<typeof google> | null = null;

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

  loadPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      if (window.google?.maps) {
        resolve(window.google);
        return;
      }
      existing.addEventListener("load", () => {
        if (window.google?.maps) resolve(window.google);
        else reject(new Error("Google Maps script loaded but google.maps is unavailable."));
      });
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBB0jvvnQ5YRme4JPOQQwruPFy7IPLCO2g";

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

  return loadPromise;
}

