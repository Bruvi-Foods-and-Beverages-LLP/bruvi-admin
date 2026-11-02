"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreFormCard } from "@/components/stores/store-form-card";
import { GeofenceMapPreview } from "@/components/stores/geofence-map-preview";
import { AddCityModal, CityMetadata } from "@/components/stores/add-city-modal";
import { PlaceAutocompleteInput } from "@/components/maps/place-autocomplete-input";
import {
  InteractiveLocationPickerModal,
  LocationPickerResult,
} from "@/components/maps/interactive-location-picker-modal";
import {
  ActionStatusModal,
  useActionStatusModal,
} from "@/components/feedback";
import { StoreAtAGlanceCard } from "@/components/stores/edit/store-at-a-glance-card";
import { StoreDangerZoneCard } from "@/components/stores/edit/store-danger-zone-card";
import { StoreDetailSkeleton } from "@/components/stores/detail/store-detail-skeleton";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchStoreOverview,
  updateStoreThunk,
  deleteStoreThunk,
  StoreEntity,
} from "@/store/slices/stores-slice";
import { fetchCities, addCityLocally } from "@/store/slices/cities-slice";
import { ParsedAddress } from "@/types/maps";
import { Check, ChevronDown, Plus, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EditStorePageProps {
  params: Promise<{ id: string }>;
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const unwrappedParams = React.use(params);
  const storeId = unwrappedParams.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Action status modal feedback (Loading -> Success Tick -> Error)
  const actionStatus = useActionStatusModal();

  // Redux state
  const overview = useAppSelector((state) => state.stores.currentStoreOverview);
  const isOverviewLoading = useAppSelector((state) => state.stores.isOverviewLoading);
  const citiesFromRedux = useAppSelector((state) => state.cities.cities);

  // Form State
  const [store, setStore] = React.useState<StoreEntity | null>(null);
  const [storeName, setStoreName] = React.useState("");
  const [storeCode, setStoreCode] = React.useState("");
  const [format, setFormat] = React.useState<"Flagship" | "Express" | "Kiosk" | "">("Flagship");
  const [city, setCity] = React.useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = React.useState(false);
  const [isAddCityModalOpen, setIsAddCityModalOpen] = React.useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = React.useState(false);

  const [address, setAddress] = React.useState("");
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [postalCode, setPostalCode] = React.useState("");
  const [stateName, setStateName] = React.useState("Karnataka");
  const [geofenceRadius, setGeofenceRadius] = React.useState(50);
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [gstin, setGstin] = React.useState("");
  const [fssai, setFssai] = React.useState("");
  const [openDate, setOpenDate] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  // Touched state for validation
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((p) => ({ ...p, [field]: true }));
  const [prevStoreId, setPrevStoreId] = React.useState<string | undefined>(undefined);

  // Load store overview and cities on mount
  React.useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreOverview(storeId));
      dispatch(fetchCities());
    }
  }, [dispatch, storeId]);

  // Sync form state when store overview arrives
  if (overview?.store && overview.store.id !== prevStoreId) {
    setPrevStoreId(overview.store.id);
    const s = overview.store;
    setStore(s);
    setStoreName(s.name || "");
    setStoreCode(s.code || "");
    setFormat(s.type === "Flagship" || s.type === "Express" || s.type === "Kiosk" ? s.type : "Flagship");
    setCity(s.city || s.cityName || "");
    setAddress(s.addressLine1 || "");
    setLatitude(s.latitude ?? 12.9784);
    setLongitude(s.longitude ?? 77.6408);
    setPostalCode(s.postalCode || "");
    setStateName(s.state || "Karnataka");
    setGeofenceRadius(s.geofenceRadiusMeters || 50);
    setPhone(s.phone || "");
    setEmail(s.email || "");
    setManager(s.manager || "");
    setGstin(s.gstin || "");
    setFssai(s.fssaiLicenceNo || "11223344556677");
    setOpenDate(s.openDate || "");
  }

  // Handle location picking from interactive map modal
  const handleLocationPicked = (result: LocationPickerResult) => {
    setAddress(result.address);
    setLatitude(result.latitude);
    setLongitude(result.longitude);
    if (result.postalCode) setPostalCode(result.postalCode);
    if (result.state) setStateName(result.state);
    if (result.city && !city) setCity(result.city);
    setIsLocationPickerOpen(false);
  };

  // Handle place autocomplete selection
  const handlePlaceSelect = (parsed: ParsedAddress) => {
    if (parsed.formattedAddress) setAddress(parsed.formattedAddress);
    if (parsed.latitude) setLatitude(parsed.latitude);
    if (parsed.longitude) setLongitude(parsed.longitude);
    if (parsed.pincode) setPostalCode(parsed.pincode);
    if (parsed.state) setStateName(parsed.state);
    if (parsed.city && !city) setCity(parsed.city);
  };

  // Add City callback
  const handleAddCity = async (newCity: CityMetadata) => {
    dispatch(
      addCityLocally({
        id: `city-${Date.now()}`,
        name: newCity.name,
        code: newCity.code || newCity.name.slice(0, 3).toUpperCase(),
        state: newCity.state,
        latitude: newCity.latitude,
        longitude: newCity.longitude,
        isActive: true,
      })
    );
    setCity(newCity.name);
    if (newCity.latitude && newCity.longitude) {
      setLatitude(newCity.latitude);
      setLongitude(newCity.longitude);
    }
    if (newCity.state) setStateName(newCity.state);
    setIsAddCityModalOpen(false);
  };

  // Validations
  const isNameValid = storeName.trim().length >= 3;
  const isCodeValid = /^[A-Z0-9_-]{3,32}$/i.test(storeCode.trim());
  const isFormatValid = format !== "";
  const isCityValid = city.trim().length > 0;
  const isAddressValid = address.trim().length >= 5;
  const isPhoneValid = /^\+?[0-9\s-]{8,20}$/.test(phone.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isGstinValid = !gstin || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gstin.trim());
  const isFssaiValid = !fssai || /^\d{14}$/.test(fssai.trim());

  const attentionFields: string[] = [];
  if (!isNameValid) attentionFields.push("Store name");
  if (!isCodeValid) attentionFields.push("Store code");
  if (!isFormatValid) attentionFields.push("Format");
  if (!isCityValid) attentionFields.push("City");
  if (!isAddressValid) attentionFields.push("Address");
  if (!isPhoneValid) attentionFields.push("Phone");
  if (!isEmailValid) attentionFields.push("Email");
  if (!isGstinValid) attentionFields.push("GSTIN");
  if (!isFssaiValid) attentionFields.push("FSSAI");

  // Save changes handler
  const handleSaveChanges = async () => {
    setSubmitAttempted(true);

    if (attentionFields.length > 0) {
      actionStatus.showError({
        title: "Please complete required fields",
        description: `The following fields need attention: ${attentionFields.join(", ")}.`,
        primaryActionLabel: "Review Fields",
        onPrimaryAction: actionStatus.closeModal,
      });
      return;
    }

    setIsSubmitting(true);
    actionStatus.showLoading(
      "Saving store changes...",
      "Updating store configuration, geofence, and contact details across Bruvi services."
    );

    const payload = {
      name: storeName.trim(),
      code: storeCode.trim().toUpperCase(),
      format,
      city: city.trim(),
      addressLine1: address.trim(),
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      geofenceRadiusMeters: geofenceRadius,
      postalCode: postalCode.trim() || undefined,
      state: stateName,
      phone: phone.trim(),
      email: email.trim(),
      managerName: manager.trim() || undefined,
      gstin: gstin.trim() || undefined,
      fssaiLicenceNo: fssai.trim() || undefined,
      openDate: openDate || undefined,
    };

    try {
      const resultAction = await dispatch(
        updateStoreThunk({ id: store?.id || storeId, payload })
      );

      if (updateStoreThunk.fulfilled.match(resultAction)) {
        actionStatus.showSuccess({
          title: "Store changes saved successfully!",
          description: `Store "${payload.name}" (${payload.code}) has been updated.`,
          autoDismissMs: 1800,
          primaryActionLabel: "View Store",
          onPrimaryAction: () => {
            actionStatus.closeModal();
            router.push(`/stores/${store?.id || storeId}`);
          },
        });

        setTimeout(() => {
          router.push(`/stores/${store?.id || storeId}`);
        }, 1800);
      } else {
        const payloadObj = typeof resultAction.payload === "object" && resultAction.payload !== null ? (resultAction.payload as Record<string, unknown>) : null;
        const errorMsg =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : (payloadObj?.message as string) ||
              "Could not update store details. Please verify inputs.";

        actionStatus.showError({
          title: "Update failed",
          description: errorMsg,
          primaryActionLabel: "Try Again",
          onPrimaryAction: actionStatus.closeModal,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to reach server. Please try again.";
      actionStatus.showError({
        title: "Network error",
        description: message,
        primaryActionLabel: "Dismiss",
        onPrimaryAction: actionStatus.closeModal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle store status (Open vs Closed)
  const handleToggleStoreStatus = async () => {
    if (!store) return;
    const newStatus = store.isOpen ? "CLOSED" : "OPEN";

    setIsTogglingStatus(true);
    actionStatus.showLoading(
      `${newStatus === "CLOSED" ? "Closing" : "Reopening"} store...`,
      `Updating live dispatch channels and visibility for ${store.name}.`
    );

    try {
      const res = await dispatch(
        updateStoreThunk({
          id: store.id,
          payload: { status: newStatus, isOpen: newStatus === "OPEN" },
        })
      );

      if (updateStoreThunk.fulfilled.match(res)) {
        setStore((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus === "OPEN" ? "Open" : "Closed",
                isOpen: newStatus === "OPEN",
              }
            : null
        );

        actionStatus.showSuccess({
          title: `Store ${newStatus === "CLOSED" ? "closed" : "reopened"} successfully`,
          description: `Store visibility and channels have been updated.`,
          autoDismissMs: 1500,
        });
      } else {
        actionStatus.showError({
          title: "Status change failed",
          description: "Unable to update store operational status.",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      actionStatus.showError({
        title: "Error",
        description: message,
      });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Archive store handler
  const handleArchiveStore = async () => {
    if (!store) return;

    setIsArchiving(true);
    actionStatus.showLoading(
      "Archiving store...",
      `Removing ${store.name} from customer channels and unpairing devices.`
    );

    try {
      const res = await dispatch(deleteStoreThunk(store.id));

      if (deleteStoreThunk.fulfilled.match(res)) {
        actionStatus.showSuccess({
          title: "Store archived successfully",
          description: `Store "${store.name}" has been safely archived. Sales history is retained.`,
          autoDismissMs: 1500,
        });

        setTimeout(() => {
          router.push("/stores");
        }, 1500);
      } else {
        actionStatus.showError({
          title: "Archive failed",
          description: (res.payload as string) || "Could not archive store.",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to archive store";
      actionStatus.showError({
        title: "Error",
        description: message,
      });
    } finally {
      setIsArchiving(false);
    }
  };

  if (isOverviewLoading && !store) {
    return <StoreDetailSkeleton />;
  }

  const lastEditedDateFormatted = "18 Sep";

  return (
    <div className="flex flex-col gap-6 max-w-[1136px] w-full pb-12">
      {/* 1. Top Architecture: Header (Figma Node 225:87361) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Left: Breadcrumbs + Title + Subtitle */}
        <div className="flex flex-col gap-1">
          {/* Breadcrumb Navigation (Figma Node 225:87363) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-body-s text-text-muted">
            <Link
              href="/stores"
              className="hover:text-text transition-colors cursor-pointer"
            >
              Stores
            </Link>
            <span className="text-border-strong select-none">/</span>
            <Link
              href={`/stores/${store?.id || storeId}`}
              className="hover:text-text transition-colors cursor-pointer"
            >
              {store?.city || store?.name || "Store"}
            </Link>
            <span className="text-border-strong select-none">/</span>
            <span className="text-text font-medium">Edit</span>
          </nav>

          {/* Title (Figma Node 225:87364) */}
          <h1 className="text-display-s text-text tracking-tight">
            Edit store
          </h1>

          {/* Subtitle Meta (Figma Node 225:87365) */}
          <p className="text-body-s text-text-muted">
            {store?.name || storeName || "BRUVI Store"} · {store?.code || storeCode || "CODE"} · last edited {lastEditedDateFormatted} by Kavya R.
          </p>
        </div>

        {/* Right: View store button (Figma Node 225:87366) */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/stores/${store?.id || storeId}`}
            className="flex h-9 px-4 items-center justify-center rounded-[12px] border-[1.5px] border-border-input bg-surface text-label text-text hover:bg-gray-50 hover:border-text transition-all cursor-pointer shadow-2xs font-bold"
          >
            View store
          </Link>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Figma Node 225:87369) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Form Area (712px) */}
        <div className="flex flex-col gap-5 flex-1 w-full max-w-full lg:max-w-[712px]">
          {/* Card 1: Basic details */}
          <StoreFormCard
            title="Basic details"
            description="The public name, unique store code, format and primary city location."
          >
            <div className="flex flex-col gap-4">
              {/* Row 1: Store Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-text mb-1.5 font-bold">
                    Store name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    onBlur={() => markTouched("name")}
                    placeholder="e.g. Indiranagar Flagship"
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-text placeholder:text-text-muted transition-all outline-none",
                      (touched.name || submitAttempted) && !isNameValid
                        ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-border-input focus:border-2 focus:border-primary"
                    )}
                  />
                  {(touched.name || submitAttempted) && !isNameValid && (
                    <p className="text-[12px] font-medium text-error mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>At least 3 characters required</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label text-text mb-1.5 font-bold">
                    Store code
                  </label>
                  <input
                    type="text"
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
                    onBlur={() => markTouched("code")}
                    placeholder="e.g. BLR-IND"
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white text-body-s font-mono uppercase text-text placeholder:text-text-muted transition-all outline-none",
                      (touched.code || submitAttempted) && !isCodeValid
                        ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-border-input focus:border-2 focus:border-primary"
                    )}
                  />
                  {(touched.code || submitAttempted) && !isCodeValid && (
                    <p className="text-[12px] font-medium text-error mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Uppercase alphanumeric code (3-32 chars)</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Format & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label text-text mb-1.5 font-bold">
                    Format
                  </label>
                  <div className="relative">
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as "Flagship" | "Express" | "Kiosk")}
                      className="w-full h-10 px-3 pr-8 rounded-[12px] border border-border-input bg-white text-body-s text-text appearance-none outline-none focus:border-2 focus:border-primary cursor-pointer"
                    >
                      <option value="Flagship">Flagship · Full kitchen, dine-in & delivery</option>
                      <option value="Express">Express · High-throughput takeaway & app orders</option>
                      <option value="Kiosk">Kiosk · Mall / Tech park footprint</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-label text-text mb-1.5 font-bold">
                    City
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCityDropdownOpen((p) => !p)}
                    className={cn(
                      "w-full h-10 px-3 rounded-[12px] bg-white flex items-center justify-between text-body-s text-text transition-all outline-none cursor-pointer",
                      (touched.city || submitAttempted) && !isCityValid
                        ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                        : "border border-border-input focus:border-2 focus:border-primary"
                    )}
                  >
                    <span className={city ? "text-text font-medium" : "text-text-muted"}>
                      {city || "Select operational city..."}
                    </span>
                    <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {isCityDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-[12px] bg-surface border border-border shadow-lg z-30 overflow-hidden max-h-56 overflow-y-auto">
                      {citiesFromRedux.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCity(c.name);
                            if (c.latitude && c.longitude) {
                              setLatitude(c.latitude);
                              setLongitude(c.longitude);
                            }
                            if (c.state) setStateName(c.state);
                            setIsCityDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2.5 text-left text-body-s hover:bg-surface-brand flex items-center justify-between transition-colors",
                            city === c.name ? "bg-surface-brand text-primary font-bold" : "text-text"
                          )}
                        >
                          <span>{c.name} ({c.code})</span>
                          {city === c.name && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}

                      <div className="p-1 border-t border-border bg-gray-50">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCityDropdownOpen(false);
                            setIsAddCityModalOpen(true);
                          }}
                          className="w-full px-3 py-2 text-left text-label text-primary hover:bg-white rounded-md flex items-center gap-1.5 transition-colors font-bold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add new operational city...</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </StoreFormCard>

          {/* Card 2: Location & delivery */}
          <StoreFormCard
            title="Location & delivery"
            description="Exact pinpoint entrance and hyper-local dispatch geofence perimeter."
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-label text-text mb-1.5 font-bold">
                  Street address
                </label>
                <PlaceAutocompleteInput
                  value={address}
                  onChange={(val) => setAddress(val)}
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search street, building, or area..."
                  latitude={latitude ?? undefined}
                  longitude={longitude ?? undefined}
                  radius={20000}
                />
              </div>

              {/* Geofence Map Preview Component with Pinpoint and Map Modal trigger */}
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
                <label className="block text-label text-text mb-1.5 font-bold">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched("phone")}
                  placeholder="e.g. +91 80 4123 7788"
                  className={cn(
                    "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-text placeholder:text-text-muted transition-all outline-none",
                    (touched.phone || submitAttempted) && !isPhoneValid
                      ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                      : "border border-border-input focus:border-2 focus:border-primary"
                  )}
                />
              </div>

              <div>
                <label className="block text-label text-text mb-1.5 font-bold">
                  Store email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched("email")}
                  placeholder="e.g. ind@bruvi.in"
                  className={cn(
                    "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-text placeholder:text-text-muted transition-all outline-none",
                    (touched.email || submitAttempted) && !isEmailValid
                      ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                      : "border border-border-input focus:border-2 focus:border-primary"
                  )}
                />
              </div>

              <div>
                <label className="block text-label text-text mb-1.5 font-bold">
                  Store manager
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. Priya Nambiar"
                  className="w-full h-10 px-3 rounded-[12px] border border-border-input bg-white text-body-s text-text placeholder:text-text-muted transition-all outline-none focus:border-2 focus:border-primary"
                />
              </div>
            </div>
          </StoreFormCard>

          {/* Card 4: Business details */}
          <StoreFormCard
            title="Business details"
            description="Tax compliance and food safety registration numbers."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label text-text mb-1.5 font-bold">
                  GSTIN (optional)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  onBlur={() => markTouched("gstin")}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  className={cn(
                    "w-full h-10 px-3 rounded-[12px] bg-white text-body-s font-mono uppercase text-text placeholder:text-text-muted transition-all outline-none",
                    (touched.gstin || submitAttempted) && !isGstinValid
                      ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                      : "border border-border-input focus:border-2 focus:border-primary"
                  )}
                />
              </div>

              <div>
                <label className="block text-label text-text mb-1.5 font-bold">
                  FSSAI License No.
                </label>
                <input
                  type="text"
                  value={fssai}
                  onChange={(e) => setFssai(e.target.value.replace(/\D/g, "").slice(0, 14))}
                  onBlur={() => markTouched("fssai")}
                  placeholder="14-digit registration"
                  className={cn(
                    "w-full h-10 px-3 rounded-[12px] bg-white text-body-s font-mono text-text placeholder:text-text-muted transition-all outline-none",
                    (touched.fssai || submitAttempted) && !isFssaiValid
                      ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
                      : "border border-border-input focus:border-2 focus:border-primary"
                  )}
                />
              </div>
            </div>
          </StoreFormCard>

          {/* Bottom Action Bar */}
          <div className="w-full mt-4 rounded-[16px] bg-surface border border-border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full shrink-0 transition-colors",
                  attentionFields.length > 0 ? "bg-error" : "bg-success"
                )}
              />
              <span
                className={cn(
                  "text-body-s font-medium",
                  attentionFields.length > 0 ? "text-error" : "text-success"
                )}
              >
                {attentionFields.length > 0
                  ? `${attentionFields.length} field${attentionFields.length > 1 ? "s" : ""} need attention · ${attentionFields[0]}`
                  : "All fields valid and verified."}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`/stores/${store?.id || storeId}`)}
                disabled={isSubmitting}
                className="h-9 px-4 rounded-[12px] border border-border-input bg-surface text-label text-text hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
                className="h-9 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label text-white transition-colors cursor-pointer shadow-2xs font-bold flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving changes...</span>
                  </>
                ) : (
                  <span>Save changes</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area (400px - Store at a glance + Danger zone) */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-5">
          {/* 1. Store at a glance (Figma Node 225:87480) */}
          {store && (
            <StoreAtAGlanceCard
              store={store}
              devicesCount={9}
              attentionCount={store.status === "Busy mode" ? 1 : 0}
              staffCount={14}
            />
          )}

          {/* 2. Danger zone (Figma Node 225:87495) */}
          {store && (
            <StoreDangerZoneCard
              store={store}
              onToggleStatus={handleToggleStoreStatus}
              onArchiveStore={handleArchiveStore}
              isTogglingStatus={isTogglingStatus}
              isArchiving={isArchiving}
            />
          )}
        </div>
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        onAddCity={handleAddCity}
        initialCity={city}
      />

      {/* Interactive Location Picker Modal */}
      <InteractiveLocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onConfirm={handleLocationPicked}
        initialLatitude={latitude ?? 12.9784}
        initialLongitude={longitude ?? 77.6408}
        initialAddress={address}
        initialRadius={geofenceRadius}
        cityName={city}
      />

      {/* Reusable Action Status Feedback Modal */}
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
