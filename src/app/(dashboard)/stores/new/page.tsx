"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStoresStore } from "@/stores/use-stores-store";
import { StoreFormCard } from "@/components/stores/store-form-card";
import { GeofenceMapPreview } from "@/components/stores/geofence-map-preview";
import { StoreSetupChecklist } from "@/components/stores/store-setup-checklist";
import { AddCityModal } from "@/components/stores/add-city-modal";
import { CityModel } from "@/stores/use-cities-store";
import { PlaceAutocompleteInput } from "@/components/maps/place-autocomplete-input";
import {
  InteractiveLocationPickerModal,
  LocationPickerResult,
} from "@/components/maps/interactive-location-picker-modal";
import {
  ActionStatusModal,
  useActionStatusModal,
} from "@/components/feedback";
import { useAppDispatch } from "@/store";
import { addStoreLocally, fetchStores } from "@/store/slices/stores-slice";
import { addCityLocally, fetchCities } from "@/store/slices/cities-slice";
import { ParsedAddress } from "@/types/maps";
import { Check, Calendar, ChevronDown, Plus, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function CreateStorePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addStore = useStoresStore((s) => s.addStore);

  // Reusable Action Status Modal for async API actions
  const actionStatus = useActionStatusModal();

  // Form State - Starts completely empty (no dummy data)
  const [storeName, setStoreName] = React.useState("");
  const [storeCode, setStoreCode] = React.useState("");
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = React.useState(false);

  // Centralized City List sourced directly from unified backend City API
  const [cities, setCities] = React.useState<CityModel[]>([]);

  const [city, setCity] = React.useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = React.useState(false);
  const [isAddCityModalOpen, setIsAddCityModalOpen] = React.useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = React.useState(false);
  const [format, setFormat] = React.useState<"Flagship" | "Express" | "Kiosk" | "">("");
  const [address, setAddress] = React.useState("");
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [postalCode, setPostalCode] = React.useState("");
  const [stateName, setStateName] = React.useState("Maharashtra");
  const [geofenceRadius, setGeofenceRadius] = React.useState(50);
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [gstin, setGstin] = React.useState("");
  const [fssai, setFssai] = React.useState("");
  const [openDate, setOpenDate] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fallback coordinates for common operational cities
  const KNOWN_CITY_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = React.useMemo(
    () => ({
      bengaluru: { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
      bangalore: { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
      mumbai: { lat: 19.076, lng: 72.8777, state: "Maharashtra" },
      "delhi ncr": { lat: 28.6139, lng: 77.209, state: "Delhi" },
      delhi: { lat: 28.6139, lng: 77.209, state: "Delhi" },
      pune: { lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
      hyderabad: { lat: 17.385, lng: 78.4867, state: "Telangana" },
      chennai: { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu" },
      edappal: { lat: 10.7601, lng: 75.9898, state: "Kerala" },
      kochi: { lat: 9.9312, lng: 76.2673, state: "Kerala" },
      naduvattom: { lat: 10.7732, lng: 76.0129, state: "Kerala" },
    }),
    []
  );

  // Apply coordinates from selected city for continuous map positioning
  const applyCityCoordinates = React.useCallback(
    (cityName: string) => {
      const cleanName = cityName.trim().toLowerCase();
      if (!cleanName) return;

      const matched = cities.find(
        (c) => c.name.trim().toLowerCase() === cleanName
      );

      if (
        matched &&
        typeof matched.latitude === "number" &&
        typeof matched.longitude === "number"
      ) {
        setLatitude(matched.latitude);
        setLongitude(matched.longitude);
        if (matched.state) setStateName(matched.state);
        return;
      }

      const fallback = KNOWN_CITY_COORDINATES[cleanName];
      if (fallback) {
        setLatitude(fallback.lat);
        setLongitude(fallback.lng);
        setStateName(fallback.state);
      }
    },
    [cities, KNOWN_CITY_COORDINATES]
  );

  // Handle City Selection from dropdown
  const handleSelectCity = (cityName: string) => {
    setCity(cityName);
    setIsCityDropdownOpen(false);
    markTouched("city");

    // Seamless continuity: If no specific street address is selected yet, center coordinates on selected city
    if (!address.trim()) {
      applyCityCoordinates(cityName);
    }
  };

  // Field Touched / Interaction State for Validation
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  const cityDropdownRef = React.useRef<HTMLDivElement>(null);

  // Synchronize Cities from unified City API (Single Source of Truth)
  React.useEffect(() => {
    let isCancelled = false;

    async function loadCities() {
      try {
        if (typeof window !== "undefined") {
          // Purge legacy split-brain local storage cache
          localStorage.removeItem("bruvi-manual-cities");
        }

        const res = await fetch("/api/proxy/cities?limit=100&isActive=true");
        if (res.ok) {
          const json = await res.json();
          const remoteList: CityModel[] = json?.data?.data || json?.data || [];
          if (Array.isArray(remoteList) && !isCancelled) {
            const sorted = [...remoteList].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            setCities(sorted);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote cities from City API:", err);
      }
    }

    loadCities();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Close city dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-generate a store code suggestion if user hasn't typed one manually
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (!isCodeManuallyEdited) {
      if (!val.trim()) {
        setStoreCode("");
      } else {
        const parts = val.trim().toUpperCase().split(/\s+/);
        if (parts.length === 1) {
          setStoreCode(parts[0].substring(0, 4));
        } else {
          const prefix = parts[0].substring(0, 3);
          const suffix = parts[1].substring(0, 3);
          setStoreCode(`${prefix}-${suffix}`);
        }
      }
    }
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation Rules
  const isNameValid = storeName.trim().length > 0;
  const isCodeValid = storeCode.trim().length > 0;
  const isCityValid = city.trim().length > 0;
  const isFormatValid = format.length > 0;
  const isAddressValid = address.trim().length > 0;
  const isPhoneValid = !phone.trim() || /^\+?[0-9\s-]{8,20}$/.test(phone.trim());
  const isEmailValid = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isGstinValid =
    !gstin.trim() ||
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gstin.trim());
  const isFssaiValid = fssai.trim().length === 14 && /^\d+$/.test(fssai.trim());

  // Determine which fields need attention
  const attentionFields: string[] = [];
  if (!isNameValid) attentionFields.push("Store name");
  if (!isCodeValid) attentionFields.push("Store code");
  if (!isCityValid) attentionFields.push("City");
  if (!isFormatValid) attentionFields.push("Store format");
  if (!isAddressValid) attentionFields.push("Store address");
  if (!isPhoneValid) attentionFields.push("Phone");
  if (!isEmailValid) attentionFields.push("Email");
  if (gstin.trim() && !isGstinValid) attentionFields.push("GSTIN");
  if (!isFssaiValid) attentionFields.push("FSSAI licence no.");

  const isFormValid = attentionFields.length === 0;

  // Handle Google Maps Place Selection
  const handlePlaceSelect = (place: ParsedAddress) => {
    setAddress(place.formattedAddress);
    markTouched("address");

    if (typeof place.latitude === "number" && typeof place.longitude === "number") {
      setLatitude(place.latitude);
      setLongitude(place.longitude);
    }

    if (place.pincode) {
      setPostalCode(place.pincode);
    }

    if (place.state) {
      setStateName(place.state);
    }
    // Note: City is a master entity explicitly chosen in the City selector or Add City modal.
    // Address autocomplete should NEVER overwrite the user's selected administrative city.
  };

  // Handle Location Picked from Interactive Google Map Picker Modal
  const handleLocationPicked = (result: LocationPickerResult) => {
    if (result.address) {
      setAddress(result.address);
    }
    setLatitude(result.latitude);
    setLongitude(result.longitude);

    if (result.postalCode) {
      setPostalCode(result.postalCode);
    }
    if (result.state) {
      setStateName(result.state);
    }
    // City remains governed strictly by the relational City entity
    markTouched("address");
  };

  // Add City Handler (syncs directly with central City API)
  const handleAddCity = async (
    cityInput: CityModel | string,
    metadata?: CityModel
  ) => {
    const cityName = typeof cityInput === "string" ? cityInput : cityInput.name;
    const model: CityModel =
      typeof cityInput === "object"
        ? cityInput
        : metadata || {
            name: cityName,
            state: stateName || "Maharashtra",
            country: "IN",
          };

    // 1. Immediately present the high-craft Bruvi loading state
    setIsAddCityModalOpen(false);
    actionStatus.showLoading(
      "Adding City to Network...",
      `Registering ${cityName} and synchronizing regional fulfillment routes...`
    );

    try {
      const res = await fetch("/api/proxy/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cityName,
          code: model.code || cityName.substring(0, 3).toUpperCase(),
          state: model.state || stateName || "Maharashtra",
          country: model.country || "IN",
          timezone: model.timezone || "Asia/Kolkata",
          latitude: model.latitude ?? undefined,
          longitude: model.longitude ?? undefined,
          defaultGeofenceRadiusMeters: model.defaultGeofenceRadiusMeters || 5000,
          isActive: true,
        }),
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        actionStatus.showError(responseJson || `Could not register ${cityName}`, {
          title: "Unable to Add City",
          primaryActionLabel: "Try again",
          onPrimaryAction: () => {
            actionStatus.closeModal();
            setIsAddCityModalOpen(true);
          },
          secondaryActionLabel: "Cancel",
          onSecondaryAction: () => {
            actionStatus.closeModal();
          },
        });
        return;
      }

      // Success! Update centralized city list
      const createdCity: CityModel = responseJson?.data || model;
      setCities((prev) => {
        const filtered = prev.filter(
          (c) => c.name.toLowerCase() !== cityName.toLowerCase()
        );
        return [...filtered, createdCity].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });

      // Synchronize Redux cities slice
      dispatch(
        addCityLocally({
          id: createdCity.id || `city-${createdCity.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
          name: createdCity.name,
          code: createdCity.code || createdCity.name.substring(0, 3).toUpperCase(),
          state: createdCity.state || "",
          country: createdCity.country || "IN",
          timezone: createdCity.timezone || "Asia/Kolkata",
          latitude: createdCity.latitude ?? null,
          longitude: createdCity.longitude ?? null,
          defaultGeofenceRadiusMeters: createdCity.defaultGeofenceRadiusMeters || 5000,
          isActive: true,
        })
      );
      dispatch(fetchCities());

      // Select this city and update form coordinates
      setCity(cityName);
      setIsCityDropdownOpen(false);
      markTouched("city");

      if (model.state) {
        setStateName(model.state);
      }
      if (typeof model.latitude === "number" && typeof model.longitude === "number") {
        setLatitude(model.latitude);
        setLongitude(model.longitude);
      }

      // Affirmative Celebratory Success Feedback with Animated Tick
      // User must explicitly click "Continue with Store Setup" (no surprising auto-dismiss)
      actionStatus.showSuccess({
        title: "City Added Successfully",
        description: `${cityName} has been registered and is now active across your operational network.`,
        primaryActionLabel: "Continue with Store Setup",
        onPrimaryAction: () => {
          actionStatus.closeModal();
        },
      });
    } catch (err) {
      actionStatus.showError(err, {
        title: "Network Connection Issue",
        primaryActionLabel: "Try again",
        onPrimaryAction: () => {
          actionStatus.closeModal();
          setIsAddCityModalOpen(true);
        },
        secondaryActionLabel: "Cancel",
        onSecondaryAction: () => {
          actionStatus.closeModal();
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Create Store Submission
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid) {
      setTouched({
        storeName: true,
        storeCode: true,
        city: true,
        format: true,
        address: true,
        phone: true,
        email: true,
        gstin: true,
        fssai: true,
      });
      return;
    }

    // 1. Immediately present the high-craft Bruvi loading state
    setIsSubmitting(true);
    actionStatus.showLoading(
      "Creating Store...",
      `Publishing ${storeName.trim()} in ${city.trim()} to the live network...`
    );

    // Fallback coordinates if user typed arbitrary text without selecting Google Maps pin
    const finalLat = latitude ?? 18.5481;
    const finalLng = longitude ?? 73.9030;

    const matchedCity = cities.find(
      (c) => c.name.trim().toLowerCase() === city.trim().toLowerCase()
    );

    const storePayload = {
      name: storeName.trim(),
      code: storeCode.trim().toUpperCase(),
      cityId: matchedCity?.id,
      cityName: matchedCity?.name || city.trim(),
      format: (format || "Express") as "Flagship" | "Express" | "Kiosk",
      addressLine1: address.trim(),
      state: matchedCity?.state || stateName,
      postalCode: postalCode.trim() || undefined,
      latitude: finalLat,
      longitude: finalLng,
      geofenceRadiusMeters: geofenceRadius,
      phone: phone.trim() || "+91 20 4860 2213",
      email: email.trim() || "store@bruvi.in",
      managerName: manager.trim() || "Lead Barista (TBD)",
      gstin: gstin.trim() || undefined,
      fssaiLicenceNo: fssai.trim(),
      openDate: openDate || new Date().toISOString().split("T")[0],
      status: "OPEN" as const,
      statusDetail: "Open",
      isActive: true,
      salesToday: 0,
      rating: 5.0,
    };

    try {
      const res = await fetch("/api/proxy/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storePayload),
      });

      const responseJson = await res.json().catch(() => null);

      if (!res.ok) {
        actionStatus.showError(responseJson || "Failed to create store", {
          title: "Unable to Create Store",
          primaryActionLabel: "Review details & retry",
          onPrimaryAction: () => {
            actionStatus.closeModal();
          },
          secondaryActionLabel: "Close",
          onSecondaryAction: () => {
            actionStatus.closeModal();
          },
        });
        return;
      }

      const createdStore = responseJson?.data || responseJson;

      // Update both Redux enterprise store and local stores store
      const newStoreEntity = {
        id: createdStore?.id || `store-${Date.now()}`,
        name: storePayload.name,
        code: storePayload.code,
        type: storePayload.format,
        cityId: storePayload.cityId,
        city: storePayload.cityName,
        manager: storePayload.managerName,
        hours: "7:00 am – 11:00 pm",
        status: "Open" as const,
        statusDetail: "Open",
        salesToday: 0,
        rating: 5.0,
      };

      dispatch(addStoreLocally(newStoreEntity));
      dispatch(fetchStores());

      addStore(newStoreEntity);

      // Celebratory Success Feedback with Animated Tick
      // User must explicitly click "View Stores Network" to navigate (no surprise redirects)
      actionStatus.showSuccess({
        title: "Store Created Successfully",
        description: `${storePayload.name} has been published to the Bruvi network and is ready for operations.`,
        primaryActionLabel: "View Stores Network",
        onPrimaryAction: () => {
          actionStatus.closeModal();
          router.push("/stores");
        },
      });
    } catch (err) {
      actionStatus.showError(err, {
        title: "Network Connection Issue",
        primaryActionLabel: "Try again",
        onPrimaryAction: () => {
          actionStatus.closeModal();
        },
        secondaryActionLabel: "Cancel",
        onSecondaryAction: () => {
          actionStatus.closeModal();
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between w-full">
      {/* Main Content Area (Figma: 1136px width, 24px gap) */}
      <div className="w-full max-w-[1136px] mx-auto pb-12">
        {/* 1. Page Header (Figma 225:86976) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <div className="text-[14px] text-[#55647A] flex items-center gap-1.5 font-medium">
              <Link href="/stores" className="hover:text-[#0F2340] hover:underline">
                Stores
              </Link>
              <span>/</span>
              <span className="text-[#0F2340]">New store</span>
            </div>

            <h1 className="text-display-s text-[#0F2340]">
              Create store
            </h1>

            <p className="text-body-s text-[#55647A]">
              {city
                ? `New store location in ${city}`
                : "Configure location details and publish to the network"}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                alert("Store draft saved locally.");
              }}
              className="h-9 px-4.5 rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-white text-label text-[#0F2340] hover:bg-[#f5f7fa] transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
            >
              Save draft
            </button>
          </div>
        </div>

        {/* 2. Main Two-Column Layout (Figma 225:86984: 712px Form + 400px Checklist) */}
        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          {/* Left Column: Form Cards (712px) */}
          <div className="w-full lg:w-[712px] flex flex-col gap-6 shrink-0">
            {/* Card 1: Basics */}
            <StoreFormCard
              title="Basics"
              description="How the store appears in the app, receipts and reports."
            >
              <div className="flex flex-col gap-4">
                {/* Row 1: Store name & code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                      Store name <span className="text-[#C0352B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      onBlur={() => markTouched("storeName")}
                      placeholder="e.g. BRUVI Indiranagar"
                      className={cn(
                        "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] transition-all outline-none",
                        (touched.storeName || submitAttempted) && !isNameValid
                          ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                          : "border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66]"
                      )}
                    />
                    {(touched.storeName || submitAttempted) && !isNameValid && (
                      <p className="text-[12px] font-medium text-[#C0352B] mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Store name is required</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                      Store code <span className="text-[#C0352B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={storeCode}
                      onChange={(e) => {
                        setStoreCode(e.target.value.toUpperCase());
                        setIsCodeManuallyEdited(true);
                      }}
                      onBlur={() => markTouched("storeCode")}
                      placeholder="e.g. BLR-IND"
                      className={cn(
                        "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] uppercase transition-all outline-none",
                        (touched.storeCode || submitAttempted) && !isCodeValid
                          ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                          : "border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66]"
                      )}
                    />
                    {(touched.storeCode || submitAttempted) && !isCodeValid ? (
                      <p className="text-[12px] font-medium text-[#C0352B] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Store code is required</span>
                      </p>
                    ) : (
                      <span className="block text-[12px] text-[#55647A] mt-1">
                        Auto-generated · editable
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: City & Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City Dropdown with Empty State & Add a City Modal Trigger */}
                  <div className="relative" ref={cityDropdownRef}>
                    <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                      City <span className="text-[#C0352B]">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                      className={cn(
                        "w-full h-10 px-3 rounded-[12px] bg-white flex items-center justify-between text-body-s cursor-pointer transition-all outline-none text-left",
                        (touched.city || submitAttempted) && !isCityValid
                          ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                          : "border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66]"
                      )}
                    >
                      {city ? (
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-semibold text-[#0F2340]">{city}</span>
                          <span className="bg-[#e8f5fd] text-[#1C3A66] text-[11px] font-bold px-2 py-0.5 rounded-[6px]">
                            New city
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#7F8CA0]">Select a city</span>
                      )}

                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[#7F8CA0] shrink-0 transition-transform duration-200",
                          isCityDropdownOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {(touched.city || submitAttempted) && !isCityValid && (
                      <p className="text-[12px] font-medium text-[#C0352B] mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Please select or add a city</span>
                      </p>
                    )}

                    {/* Dropdown Menu */}
                    {isCityDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-[14px] border border-[#dce2ea] shadow-floating p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                        {/* Empty State when no cities added yet */}
                        {cities.length === 0 ? (
                          <div className="p-3 text-center">
                            <p className="text-xs font-medium text-[#55647A]">
                              No cities added yet
                            </p>
                            <p className="text-[11px] text-[#7F8CA0] mt-0.5">
                              Click below to configure a new city hub.
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                            {cities.map((c) => (
                              <button
                                key={c.id || c.name}
                                type="button"
                                onClick={() => handleSelectCity(c.name)}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-[8px] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer",
                                  city.trim().toLowerCase() === c.name.trim().toLowerCase()
                                    ? "bg-[#1C3A66] text-white"
                                    : "text-[#0F2340] hover:bg-[#f5f7fa]"
                                )}
                              >
                                <span>{c.name}</span>
                                {city.trim().toLowerCase() === c.name.trim().toLowerCase() && <Check className="h-3.5 w-3.5" />}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="border-t border-[#dce2ea] my-1" />

                        {/* Add a City Action */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsCityDropdownOpen(false);
                            setIsAddCityModalOpen(true);
                          }}
                          className="w-full p-2 flex items-center justify-center gap-1.5 text-xs font-bold text-[#1C3A66] hover:bg-[#e8f5fd] rounded-[8px] transition-colors cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>Add a city</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Format Selector */}
                  <div>
                    <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                      Format <span className="text-[#C0352B]">*</span>
                    </label>
                    <div
                      className={cn(
                        "w-full h-10 rounded-[12px] p-1 flex items-center bg-white justify-between transition-all",
                        (touched.format || submitAttempted) && !isFormatValid
                          ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                          : "border border-[#bcc6d3]"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormat("Flagship");
                          markTouched("format");
                        }}
                        className={cn(
                          "flex-1 h-full rounded-[8px] text-xs font-semibold transition-colors cursor-pointer text-center",
                          format === "Flagship"
                            ? "bg-[#1C3A66] text-white font-bold"
                            : "text-[#55647A] hover:bg-gray-50"
                        )}
                      >
                        Flagship
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormat("Express");
                          markTouched("format");
                        }}
                        className={cn(
                          "flex-1 h-full rounded-[8px] text-xs font-semibold transition-colors cursor-pointer text-center",
                          format === "Express"
                            ? "bg-[#1C3A66] text-white font-bold"
                            : "text-[#55647A] hover:bg-gray-50"
                        )}
                      >
                        Express
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormat("Kiosk");
                          markTouched("format");
                        }}
                        className={cn(
                          "flex-1 h-full rounded-[8px] text-xs font-semibold transition-colors cursor-pointer text-center",
                          format === "Kiosk"
                            ? "bg-[#1C3A66] text-white font-bold"
                            : "text-[#55647A] hover:bg-gray-50"
                        )}
                      >
                        Kiosk-only
                      </button>
                    </div>

                    {(touched.format || submitAttempted) && !isFormatValid && (
                      <p className="text-[12px] font-medium text-[#C0352B] mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Select store format</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </StoreFormCard>

            {/* Card 2: Location */}
            <StoreFormCard
              title="Location"
              description="Used for pickup directions and the app’s “near me” list."
            >
              <div className="flex flex-col gap-4">
                {/* Google Places Autocomplete Address Input */}
                <div>
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    Address <span className="text-[#C0352B]">*</span>
                  </label>
                  <PlaceAutocompleteInput
                    value={address}
                    onChange={(val) => {
                      setAddress(val);
                      if (!val.trim()) {
                        if (city) {
                          applyCityCoordinates(city);
                        } else {
                          setLatitude(null);
                          setLongitude(null);
                        }
                      }
                    }}
                    onPlaceSelect={handlePlaceSelect}
                    placeholder={
                      city
                        ? `Search street, area or landmark in ${city}...`
                        : "Search or enter location, street address, building, or area..."
                    }
                    latitude={latitude ?? undefined}
                    longitude={longitude ?? undefined}
                    radius={20000}
                    error={
                      (touched.address || submitAttempted) && !isAddressValid
                        ? "Store address is required"
                        : undefined
                    }
                  />
                </div>

                {/* Map & Geofence Slider Component with Live Satellite Preview */}
                <GeofenceMapPreview
                  radius={geofenceRadius}
                  onRadiusChange={setGeofenceRadius}
                  latitude={latitude ?? undefined}
                  longitude={longitude ?? undefined}
                  cityName={city}
                  onOpenInteractivePicker={() => setIsLocationPickerOpen(true)}
                />
              </div>
            </StoreFormCard>

            {/* Card 3: Contact */}
            <StoreFormCard
              title="Contact"
              description="Shown to customers on the store page and order receipts."
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => markTouched("phone")}
                    placeholder="e.g. +91 98765 43210"
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] transition-all outline-none",
                      (touched.phone || submitAttempted) && !isPhoneValid
                        ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66]"
                    )}
                  />
                  {(touched.phone || submitAttempted) && !isPhoneValid && (
                    <p className="text-[12px] font-medium text-[#C0352B] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Valid phone required</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    Store email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="e.g. store@bruvi.in"
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] transition-all outline-none",
                      (touched.email || submitAttempted) && !isEmailValid
                        ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66]"
                    )}
                  />
                  {(touched.email || submitAttempted) && !isEmailValid && (
                    <p className="text-[12px] font-medium text-[#C0352B] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Valid email required</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    Store manager
                  </label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="Assign manager (optional)"
                    className="w-full h-10 px-3 rounded-[12px] border border-[#bcc6d3] bg-white text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] focus:outline-none focus:border-2 focus:border-[#1C3A66]"
                  />
                </div>
              </div>
            </StoreFormCard>

            {/* Card 4: Tax & licences */}
            <StoreFormCard
              title="Tax & licences"
              description="Printed on GST invoices. Local commercial registration required."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GSTIN Field */}
                <div>
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    GSTIN
                  </label>
                  <div
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white flex items-center justify-between transition-all",
                      gstin.trim() && !isGstinValid
                        ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-[#bcc6d3] focus-within:border-2 focus-within:border-[#1C3A66]"
                    )}
                  >
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      onBlur={() => markTouched("gstin")}
                      placeholder="15-character GSTIN (optional)"
                      className="w-full bg-transparent text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] font-mono focus:outline-none uppercase"
                    />
                    {gstin.trim() && isGstinValid && (
                      <Check className="h-4 w-4 text-[#1F7A4D] stroke-[2.5] shrink-0" />
                    )}
                  </div>
                  {gstin.trim() ? (
                    isGstinValid ? (
                      <span className="block text-[12px] text-[#1F7A4D] font-medium mt-1">
                        Verified · BRUVI Coffee Pvt Ltd
                      </span>
                    ) : (
                      <span className="block text-[12px] text-[#C0352B] font-medium mt-1">
                        Must be a valid 15-character GSTIN
                      </span>
                    )
                  ) : (
                    <span className="block text-[12px] text-[#55647A] mt-1">
                      Optional for draft setup
                    </span>
                  )}
                </div>

                {/* FSSAI licence no. Field */}
                <div>
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    FSSAI licence no. <span className="text-[#C0352B]">*</span>
                  </label>
                  <div
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white flex items-center justify-between transition-all",
                      (touched.fssai || submitAttempted) && !isFssaiValid
                        ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-[#bcc6d3] focus-within:border-2 focus-within:border-[#1C3A66]"
                    )}
                  >
                    <input
                      type="text"
                      value={fssai}
                      onChange={(e) => setFssai(e.target.value)}
                      onBlur={() => markTouched("fssai")}
                      placeholder="14-digit FSSAI licence"
                      className="w-full bg-transparent text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] font-mono focus:outline-none"
                    />
                    {isFssaiValid && (
                      <Check className="h-4 w-4 text-[#1F7A4D] stroke-[2.5] shrink-0" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "block text-[12px] mt-1 font-medium",
                      isFssaiValid
                        ? "text-[#1F7A4D]"
                        : (touched.fssai || submitAttempted)
                        ? "text-[#C0352B]"
                        : "text-[#55647A]"
                    )}
                  >
                    {isFssaiValid
                      ? "Valid 14-digit FSSAI licence"
                      : (touched.fssai || submitAttempted)
                      ? "Must be exactly 14 digits"
                      : "Mandatory 14-digit food safety registration"}
                  </span>
                </div>
              </div>
            </StoreFormCard>

            {/* Card 5: Launch (Simplified without Copy Menu) */}
            <StoreFormCard
              title="Launch"
              description="The store stays hidden in the app until the scheduled open date."
            >
              <div className="flex flex-col gap-3">
                <div className="max-w-xs">
                  <label className="block text-label text-[#0F2340] mb-1.5 font-bold">
                    Open date
                  </label>
                  <div className="w-full h-10 px-3 rounded-[12px] border border-[#bcc6d3] bg-white flex items-center justify-between text-body-s text-[#0F2340]">
                    <input
                      type="date"
                      value={openDate}
                      onChange={(e) => setOpenDate(e.target.value)}
                      className="w-full bg-transparent text-body-s text-[#0F2340] focus:outline-none cursor-pointer"
                    />
                    <Calendar className="h-4 w-4 text-[#7F8CA0] shrink-0 pointer-events-none" />
                  </div>
                </div>

                <p className="text-[12px] text-[#55647A] leading-relaxed">
                  The store profile will remain in pre-launch staging mode. Kitchen Display Systems (KDS) and POS hardware pairing will activate automatically upon publishing.
                </p>
              </div>
            </StoreFormCard>
          </div>

          {/* Right Column: Setup Checklist Sidebar (400px) */}
          <div className="w-full lg:w-[400px] shrink-0">
            <StoreSetupChecklist city={city} />
          </div>
        </div>

        {/* 3. Bottom Action Bar (Attached to bottom of the scroll page - NOT sticky) */}
        <div className="w-full mt-8 rounded-[16px] bg-white border border-[#dce2ea] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          {/* Left Status Alert */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full shrink-0 transition-colors",
                attentionFields.length > 0 ? "bg-[#C0352B]" : "bg-[#1F7A4D]"
              )}
            />
            <span
              className={cn(
                "text-body-s font-medium",
                attentionFields.length > 0 ? "text-[#C0352B]" : "text-[#1F7A4D]"
              )}
            >
              {attentionFields.length > 0
                ? `${attentionFields.length} field${attentionFields.length > 1 ? "s" : ""} need${attentionFields.length === 1 ? "s" : ""} attention · ${attentionFields[0]}`
                : "All fields valid and verified."}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/stores")}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] bg-white text-label text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateStore}
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors cursor-pointer shadow-2xs font-bold flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating store...</span>
                </>
              ) : (
                <span>Create store</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        onAddCity={handleAddCity}
        initialCity={city}
      />

      {/* Interactive Click-to-Pinpoint Location Picker Modal */}
      <InteractiveLocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onConfirm={handleLocationPicked}
        initialLatitude={latitude ?? 18.5481}
        initialLongitude={longitude ?? 73.9030}
        initialAddress={address}
        initialRadius={geofenceRadius}
        cityName={city}
      />

      {/* Reusable Action Status Feedback Modal (Loading, Animated Tick Success, Friendly Error) */}
      <ActionStatusModal
        isOpen={actionStatus.state.isOpen}
        status={actionStatus.state.status}
        title={actionStatus.state.title}
        description={actionStatus.state.description}
        primaryActionLabel={actionStatus.state.primaryActionLabel}
        onPrimaryAction={actionStatus.state.onPrimaryAction}
        secondaryActionLabel={actionStatus.state.secondaryActionLabel}
        onSecondaryAction={actionStatus.state.onSecondaryAction}
        onClose={actionStatus.closeModal}
        autoDismissMs={actionStatus.state.autoDismissMs}
      />
    </div>
  );
}
