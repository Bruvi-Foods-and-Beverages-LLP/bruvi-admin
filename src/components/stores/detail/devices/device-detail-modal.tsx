"use client";

import * as React from "react";
import { Check, Copy, Plus, RefreshCw, ShieldAlert, Trash2, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createStation,
  deleteStation,
  disableDevice,
  enableDevice,
  pingDevice,
  regenerateDevicePairingCode,
  restartDevice,
  unpairDevice,
  updateDevice,
} from "@/store/slices/store-devices-slice";
import { StoreDevice, StoreStationKind } from "@/types/store-devices";
import { cn } from "@/lib/utils/cn";

interface DeviceDetailModalProps {
  device: StoreDevice | null;
  storeIdOrCode: string;
  onClose: () => void;
  onRequestConfirm: (opts: {
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    onConfirm: () => void;
  }) => void;
}

export function DeviceDetailModal({
  device,
  storeIdOrCode,
  onClose,
  onRequestConfirm,
}: DeviceDetailModalProps) {
  const dispatch = useAppDispatch();
  const stations = useAppSelector((state) => state.storeDevices.data?.stations ?? []);

  const [deviceName, setDeviceName] = React.useState("");
  const [stationId, setStationId] = React.useState("");
  const [copiedCode, setCopiedCode] = React.useState(false);

  // Station management inside detail modal
  const [showAddStation, setShowAddStation] = React.useState(false);
  const [newStationName, setNewStationName] = React.useState("");
  const [newStationKind, setNewStationKind] = React.useState<StoreStationKind>("drinks");

  React.useEffect(() => {
    if (!device) return;
    setDeviceName(device.code);
    setStationId(device.stationId ?? stations[0]?.id ?? "");
    setCopiedCode(false);
  }, [device, stations]);

  if (!device) return null;

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
    const selectedStation = stations.find((s) => s.id === stationId);
    dispatch(
      updateDevice({
        storeIdOrCode,
        deviceId: device.id,
        deviceName: deviceName.trim(),
        stationId: selectedStation?.id,
        station: selectedStation?.name,
      })
    );
  };

  const handleCopyCode = async () => {
    if (!device.pendingCode) return;
    try {
      await navigator.clipboard.writeText(device.pendingCode);
    } catch {
      // Clipboard unavailable
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1600);
  };

  const handleCreateStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName.trim()) return;
    dispatch(
      createStation({
        storeIdOrCode,
        name: newStationName.trim(),
        kind: newStationKind,
      })
    );
    setNewStationName("");
    setShowAddStation(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2340]/56 p-4"
    >
      <div className="w-full max-w-[520px] rounded-[24px] bg-surface shadow-overlay border border-border overflow-hidden animate-alert-in">
        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="device-detail-modal-title" className="text-heading-m text-text">
                {device.code}
              </h2>
              <p className="text-body-s text-text-muted mt-0.5">
                {device.subtitle} · {device.statusLabel} · {device.version}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close device details"
              className="h-9 w-9 rounded-[10px] flex items-center justify-center text-text-muted hover:bg-gray-50 hover:text-text cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Pending Activation Code Box */}
          {device.status === "PENDING" && (
            <div className="rounded-[16px] bg-surface-inverse p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-overline-l text-text-inverse-secondary">
                  PAIRING CODE
                </div>
                <div className="text-heading-l tracking-wider text-white mt-0.5">
                  {device.pendingCode ?? "Expired"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {device.pendingCode && (
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="h-9 px-3 rounded-[10px] border border-white/25 bg-white/10 text-caption-bold text-white hover:bg-white/15 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      regenerateDevicePairingCode({
                        storeIdOrCode,
                        deviceId: device.id,
                      })
                    )
                  }
                  className="h-9 px-3 rounded-[10px] border border-white/25 bg-transparent text-caption-bold text-white hover:bg-white/10 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>New code</span>
                </button>
              </div>
            </div>
          )}

          {/* Rename & Reassign Station */}
          <form onSubmit={handleSaveChanges} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-label text-text">Device name</span>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="h-10 rounded-[12px] border border-border-input bg-surface px-3 text-body-s font-medium text-text focus:outline-none focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-label text-text">Station</span>
                  <button
                    type="button"
                    onClick={() => setShowAddStation((v) => !v)}
                    className="text-caption-bold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add station</span>
                  </button>
                </div>
                <select
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  className="h-10 rounded-[12px] border border-border-input bg-surface px-3 text-body-s font-medium text-text focus:outline-none focus:border-primary"
                >
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="h-9 px-4 rounded-[10px] bg-primary hover:bg-navy-900 text-caption-bold text-white cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </form>

          {/* Optional Add / Manage Store Stations */}
          {showAddStation && (
            <div className="rounded-[12px] border border-border bg-gray-50/70 p-3 flex flex-col gap-3">
              <form onSubmit={handleCreateStation} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  placeholder="New station / kitchen name"
                  className="h-9 flex-1 rounded-[8px] border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:border-primary"
                />
                <select
                  value={newStationKind}
                  onChange={(e) => setNewStationKind(e.target.value as StoreStationKind)}
                  className="h-9 rounded-[8px] border border-border-input bg-surface px-2.5 text-caption-bold text-text"
                >
                  <option value="drinks">Drinks</option>
                  <option value="food">Kitchen</option>
                  <option value="expo">Expo</option>
                </select>
                <button
                  type="submit"
                  className="h-9 px-3 rounded-[8px] bg-primary text-caption-bold text-white cursor-pointer"
                >
                  Add
                </button>
              </form>
              {stations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {stations.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-surface text-caption text-text"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onRequestConfirm({
                            title: `Remove ${s.name}?`,
                            description: "This station will be archived.",
                            confirmLabel: "Remove",
                            destructive: true,
                            onConfirm: () => {
                              dispatch(
                                deleteStation({
                                  storeIdOrCode,
                                  stationId: s.id,
                                })
                              );
                            },
                          })
                        }
                        className="text-text-muted hover:text-error cursor-pointer"
                        aria-label={`Remove ${s.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Device Controls */}
          <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(pingDevice({ storeIdOrCode, deviceId: device.id }))}
                className="h-9 px-3.5 rounded-[10px] border border-border-input bg-surface text-caption-bold text-text hover:bg-gray-50 cursor-pointer"
              >
                Ping
              </button>
              <button
                type="button"
                onClick={() => dispatch(restartDevice({ storeIdOrCode, deviceId: device.id }))}
                className="h-9 px-3.5 rounded-[10px] border border-border-input bg-surface text-caption-bold text-text hover:bg-gray-50 cursor-pointer"
              >
                Restart
              </button>
              <button
                type="button"
                onClick={() => {
                  if (device.isDisabled) {
                    dispatch(enableDevice({ storeIdOrCode, deviceId: device.id }));
                  } else {
                    onRequestConfirm({
                      title: `Disable ${device.code}?`,
                      description:
                        "This display will immediately lock and show a disabled notice from HQ until re-enabled.",
                      confirmLabel: "Disable device",
                      destructive: true,
                      onConfirm: () => {
                        dispatch(disableDevice({ storeIdOrCode, deviceId: device.id }));
                      },
                    });
                  }
                }}
                className={cn(
                  "h-9 px-3.5 rounded-[10px] border text-caption-bold inline-flex items-center gap-1.5 cursor-pointer",
                  device.isDisabled
                    ? "border-success/40 bg-success-surface text-success"
                    : "border-border-input bg-surface text-text hover:bg-gray-50"
                )}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{device.isDisabled ? "Enable" : "Disable"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onRequestConfirm({
                  title: `Unpair ${device.code}?`,
                  description:
                    "Active sessions on this device will be revoked immediately. It will require a new pairing code to reconnect.",
                  confirmLabel: "Unpair device",
                  destructive: true,
                  onConfirm: () => {
                    dispatch(unpairDevice({ storeIdOrCode, deviceId: device.id }));
                    onClose();
                  },
                })
              }
              className="h-9 px-3.5 rounded-[10px] border border-border-input bg-surface text-caption-bold text-error hover:bg-error-surface cursor-pointer"
            >
              Unpair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
