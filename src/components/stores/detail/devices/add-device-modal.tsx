"use client";

import * as React from "react";
import { Check, Copy, QrCode, RefreshCw, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchStoreDevices,
  generatePairingCode,
  setAddDeviceModalOpen,
} from "@/store/slices/store-devices-slice";
import { StoreDeviceType } from "@/types/store-devices";
import { cn } from "@/lib/utils/cn";

interface AddDeviceModalProps {
  storeIdOrCode: string;
  storeName: string;
  defaultType?: StoreDeviceType;
}

const DEVICE_TYPES: {
  value: StoreDeviceType;
  label: string;
  subtitle: string;
  defaultCode: string;
  surfaceName: string;
}[] = [
  {
    value: "KDS",
    label: "KDS",
    subtitle: "Kitchen display",
    defaultCode: "KDS-IND-BAR1",
    surfaceName: "BRUVI KDS",
  },
  {
    value: "POS",
    label: "POS",
    subtitle: "iPad",
    defaultCode: "POS-IND-01",
    surfaceName: "BRUVI POS",
  },
  {
    value: "KIOSK",
    label: "Kiosk",
    subtitle: "Self-order",
    defaultCode: "KSK-IND-K1",
    surfaceName: "BRUVI Kiosk",
  },
  {
    value: "PRINTER",
    label: "Printer",
    subtitle: "Receipt / label",
    defaultCode: "PRN-01",
    surfaceName: "BRUVI Printer",
  },
];

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

export function AddDeviceModal({
  storeIdOrCode,
  storeName,
  defaultType = "KDS",
}: AddDeviceModalProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.storeDevices.isAddModalOpen);
  const data = useAppSelector((state) => state.storeDevices.data);
  const isGenerating = useAppSelector((state) => state.storeDevices.isGenerating);

  const stations = data?.stations ?? [];
  const activePairingCode = data?.activePairingCode ?? null;

  const initialPreset =
    DEVICE_TYPES.find((t) => t.value === defaultType) ?? DEVICE_TYPES[0];

  const [deviceType, setDeviceType] = React.useState<StoreDeviceType>(initialPreset.value);
  const [deviceName, setDeviceName] = React.useState(initialPreset.defaultCode);
  const [selectedStationId, setSelectedStationId] = React.useState<string>("");
  const [customStation, setCustomStation] = React.useState<string>("Counter 1");
  const [generatedCodeForName, setGeneratedCodeForName] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [showQr, setShowQr] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState(15 * 60);

  // Sync default station when stations load
  React.useEffect(() => {
    if (!selectedStationId && stations.length > 0) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, selectedStationId]);

  // Reset modal transient state when opened/closed
  React.useEffect(() => {
    if (!isOpen) {
      setGeneratedCodeForName(null);
      setShowQr(false);
      setCopied(false);
      return;
    }
    if (activePairingCode) {
      setGeneratedCodeForName(activePairingCode.deviceName);
      setDeviceType(activePairingCode.deviceType);
      setDeviceName(activePairingCode.deviceName);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real countdown computed from expiresAtIso
  React.useEffect(() => {
    if (!isOpen || !activePairingCode?.expiresAtIso) return;
    const updateRemaining = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(activePairingCode.expiresAtIso).getTime() - Date.now()) / 1000)
      );
      setRemainingSeconds(diff);
    };
    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [isOpen, activePairingCode?.expiresAtIso]);

  const trackedDevice = React.useMemo(() => {
    const targetName = generatedCodeForName ?? activePairingCode?.deviceName;
    if (!targetName || !data) return null;
    return data.devices.find(
      (d) => d.code.toUpperCase() === targetName.toUpperCase()
    ) ?? null;
  }, [data, generatedCodeForName, activePairingCode?.deviceName]);

  const isPairedOnline =
    trackedDevice != null && trackedDevice.status === "ONLINE";

  // Poll backend every 2.5s while waiting for device activation
  React.useEffect(() => {
    if (!isOpen || !activePairingCode || isPairedOnline) return;
    const poller = setInterval(() => {
      dispatch(fetchStoreDevices(storeIdOrCode));
    }, 2500);
    return () => clearInterval(poller);
  }, [isOpen, activePairingCode, isPairedOnline, dispatch, storeIdOrCode]);

  if (!isOpen) return null;

  const selectedStationObj = stations.find((s) => s.id === selectedStationId);
  const resolvedStationName = selectedStationObj?.name ?? customStation;

  const handleSelectType = (nextType: StoreDeviceType) => {
    const preset = DEVICE_TYPES.find((t) => t.value === nextType);
    if (!preset) return;
    setDeviceType(nextType);
    setDeviceName(preset.defaultCode);
    setGeneratedCodeForName(null);
  };

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!deviceName.trim()) return;
    setShowQr(false);
    setCopied(false);
    setGeneratedCodeForName(deviceName.trim().toUpperCase());
    dispatch(
      generatePairingCode({
        storeIdOrCode,
        deviceType,
        deviceName: deviceName.trim(),
        station: resolvedStationName,
        stationId: selectedStationObj?.id,
      })
    );
  };

  const handleAddAnother = () => {
    setGeneratedCodeForName(null);
    setShowQr(false);
    setCopied(false);
    const nextNum = (data?.devices.length ?? 0) + 1;
    const prefix = deviceType === "KDS" ? "KDS" : deviceType === "POS" ? "POS" : deviceType === "KIOSK" ? "KSK" : "PRN";
    setDeviceName(`${prefix}-${String(nextNum).padStart(2, "0")}`);
  };

  const handleCopy = async () => {
    if (!activePairingCode) return;
    try {
      await navigator.clipboard.writeText(activePairingCode.code);
    } catch {
      // Clipboard may be unavailable in non-HTTPS contexts.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const currentSurface =
    DEVICE_TYPES.find((t) => t.value === deviceType)?.surfaceName ?? "BRUVI KDS";
  const showCodeBox = Boolean(activePairingCode && (generatedCodeForName || activePairingCode));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-device-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2340]/56 p-4"
    >
      <div className="w-full max-w-[480px] rounded-[24px] bg-surface shadow-overlay border border-border overflow-hidden animate-alert-in">
        <form onSubmit={handleGenerate} className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="add-device-modal-title"
                className="text-heading-m text-text"
              >
                Add a device to {storeName}
              </h2>
              <p className="text-body-s text-text-muted mt-1">
                Assign a name and station, then generate a one-time pairing code.
              </p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(setAddDeviceModalOpen(false))}
              aria-label="Close modal"
              className="h-9 w-9 rounded-[10px] flex items-center justify-center text-text-muted hover:bg-gray-50 hover:text-text transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Device Type Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-label text-text">Device type</span>
            <div className="grid grid-cols-4 gap-2">
              {DEVICE_TYPES.map((item) => {
                const selected = deviceType === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectType(item.value)}
                    className={cn(
                      "rounded-[12px] py-2.5 px-2 border text-center transition-all cursor-pointer",
                      selected
                        ? "border-primary bg-surface-brand ring-1 ring-primary"
                        : "border-border-input bg-surface hover:bg-gray-50"
                    )}
                  >
                    <div className="text-label text-text">{item.label}</div>
                    <div className="text-caption text-text-muted mt-0.5">
                      {item.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Name & Station */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-label text-text">Device name</span>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
                className="h-11 rounded-[12px] border border-border-input bg-surface px-3.5 text-body-s font-medium text-text focus:outline-none focus:border-primary"
                placeholder="KDS-IND-BAR1"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-label text-text">Station / Kitchen</span>
              {stations.length > 0 ? (
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="h-11 rounded-[12px] border border-border-input bg-surface px-3.5 text-body-s font-medium text-text focus:outline-none focus:border-primary"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customStation}
                  onChange={(e) => setCustomStation(e.target.value)}
                  className="h-11 rounded-[12px] border border-border-input bg-surface px-3.5 text-body-s font-medium text-text focus:outline-none focus:border-primary"
                  placeholder="Bar 1"
                />
              )}
            </label>
          </div>

          {/* Activation Code Display or Generate CTA */}
          {showCodeBox && activePairingCode ? (
            <div className="rounded-[16px] bg-surface-inverse p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-overline-l text-text-inverse-secondary">
                  ACTIVATION CODE
                </span>
                <span className="text-caption-bold text-warning">
                  Expires in {formatCountdown(remainingSeconds)}
                </span>
              </div>

              <div className="text-display-m tracking-wider text-white">
                {activePairingCode.code}
              </div>

              {showQr && (
                <div className="rounded-[12px] bg-white p-3 flex items-center justify-between gap-3">
                  <div className="text-caption text-text">
                    <div className="font-bold">Pair {activePairingCode.deviceName}</div>
                    <div className="text-text-muted mt-0.5">
                      Code: {activePairingCode.code} · {activePairingCode.station}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-[8px] border border-border bg-gray-50 flex items-center justify-center text-text">
                    <QrCode className="h-7 w-7" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-9 px-3.5 rounded-[10px] border border-white/25 bg-white/10 text-label text-white hover:bg-white/15 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-success" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQr((prev) => !prev)}
                  className="h-9 px-3.5 rounded-[10px] border border-white/25 bg-transparent text-label text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {showQr ? "Hide QR" : "Show QR"}
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="ml-auto h-9 px-3 rounded-[10px] border border-white/20 bg-transparent text-caption-bold text-text-inverse-secondary hover:text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="border-t border-white/15 pt-3 flex flex-col gap-1.5">
                {isPairedOnline ? (
                  <div className="flex items-center gap-2 text-body-s font-semibold text-success">
                    <Check className="h-4 w-4" />
                    <span>{trackedDevice?.code} activated & online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-body-s font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                    <span>
                      {isGenerating
                        ? "Generating code..."
                        : "Waiting for activation on device"}
                    </span>
                  </div>
                )}
                <p className="text-caption text-text-inverse-secondary">
                  Open {currentSurface} on the device and enter this code to pair it to{" "}
                  {resolvedStationName}.
                </p>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isGenerating || !deviceName.trim()}
              className="h-11 w-full rounded-[12px] bg-surface-inverse hover:bg-navy-900 text-label font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? "Generating pairing code…" : "Generate pairing code"}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-1">
            {showCodeBox && (
              <button
                type="button"
                onClick={handleAddAnother}
                className="h-10 px-4 rounded-[12px] border border-border-input bg-surface text-label text-text hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Add another
              </button>
            )}
            <button
              type="button"
              onClick={() => dispatch(setAddDeviceModalOpen(false))}
              className="h-10 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
