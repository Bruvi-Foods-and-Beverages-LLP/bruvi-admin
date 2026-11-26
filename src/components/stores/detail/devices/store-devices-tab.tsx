"use client";

import * as React from "react";
import {
  CheckCircle2,
  CreditCard,
  Monitor,
  Plus,
  Printer,
  Radio,
  Smartphone,
  Wifi,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearDeviceBanner,
  fetchStoreDevices,
  pingDevice,
  restartDevice,
  setAddDeviceModalOpen,
  unpairDevice,
  updateAllDevices,
} from "@/store/slices/store-devices-slice";
import { StoreEntity } from "@/store/slices/stores-slice";
import { StoreDevice, StoreDeviceType } from "@/types/store-devices";
import { AddDeviceModal } from "./add-device-modal";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import { DeviceDetailModal } from "./device-detail-modal";
import { cn } from "@/lib/utils/cn";

interface StoreDevicesTabProps {
  store: StoreEntity;
}

function DeviceIcon({ type, attention }: { type: StoreDeviceType; attention?: boolean }) {
  const iconClass = cn("h-4 w-4", attention ? "text-warning" : "text-text");
  switch (type) {
    case "POS":
      return <Smartphone className={iconClass} />;
    case "KDS":
    case "KIOSK":
      return <Monitor className={iconClass} />;
    case "PRINTER":
      return <Printer className={iconClass} />;
    case "CARD_TERMINAL":
      return <CreditCard className={iconClass} />;
  }
}

function StatusBadge({ device }: { device: StoreDevice }) {
  if (device.isDisabled || device.status === "OFFLINE") {
    return (
      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-error-surface text-error text-caption-bold whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-error shrink-0" />
        <span>{device.statusLabel}</span>
      </span>
    );
  }
  if (device.status === "ATTENTION") {
    return (
      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-warning-surface text-warning text-caption-bold whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
        <span>{device.statusLabel}</span>
      </span>
    );
  }
  if (device.status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-info-surface text-info text-caption-bold whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-info shrink-0" />
        <span>{device.statusLabel}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-success-surface text-success text-caption-bold whitespace-nowrap">
      <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
      <span>{device.statusLabel}</span>
    </span>
  );
}

export function StoreDevicesTab({ store }: StoreDevicesTabProps) {
  const dispatch = useAppDispatch();
  const { data, isLoading, actionBanner } = useAppSelector((state) => state.storeDevices);
  const [showHowItWorks, setShowHowItWorks] = React.useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = React.useState<{
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const storeKey = store.code || store.id;

  React.useEffect(() => {
    if (storeKey) {
      dispatch(fetchStoreDevices(storeKey));
    }
  }, [dispatch, storeKey]);

  if (isLoading || !data) {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-8 text-body-s text-text-muted">
        Loading store devices…
      </div>
    );
  }

  const pendingUpdateCount = data.devices.filter((d) => d.updateAvailable).length;
  const selectedDevice =
    data.devices.find((d) => d.id === selectedDeviceId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionBanner && (
        <div className="rounded-[12px] border border-success/30 bg-success-surface px-4 py-3 flex items-center justify-between gap-3 text-body-s font-semibold text-success animate-alert-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearDeviceBanner())}
            className="text-success hover:text-text cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top 3 Summary Cards (Figma Node 474:224709) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pair new device (Dark Card) */}
        <div className="lg:col-span-4 rounded-[16px] bg-surface-inverse p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-heading-s text-white">Pair new device</h3>
            <span className="text-caption font-semibold text-text-inverse-muted">
              {data.activePairingCode
                ? `Expires ${data.activePairingCode.expiresAtLabel}`
                : "No active code"}
            </span>
          </div>

          <p className="text-body-s text-text-inverse-secondary">
            Make a one-time 8-character code for the new POS, Kiosk or KDS. It expires after 15 minutes.
          </p>

          <div className="text-display-m tracking-wider text-text-inverse-muted">
            {data.activePairingCode ? (
              <span className="text-accent">{data.activePairingCode.code}</span>
            ) : (
              "XXXX-XXXX"
            )}
          </div>

          {showHowItWorks && (
            <p className="text-caption text-text-inverse-secondary bg-white/10 rounded-[10px] p-2.5">
              1. Generate a code in HQ · 2. Enter it on the KDS/POS first-run screen · 3. Pick a station and sign in with staff PIN.
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(setAddDeviceModalOpen(true))}
              className="h-9 px-3.5 rounded-[10px] border border-white/25 bg-white/10 text-label text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              Generate code
            </button>
            <button
              type="button"
              onClick={() => setShowHowItWorks((v) => !v)}
              className="h-9 px-3.5 rounded-[10px] border border-white/25 bg-transparent text-label text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              How pairing works
            </button>
          </div>
        </div>

        {/* Network Card */}
        <div className="lg:col-span-6 rounded-[16px] border border-border bg-surface p-5 flex flex-col justify-between gap-4">
          <h3 className="text-heading-s text-text">Network</h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[10px] bg-success-surface flex items-center justify-center text-success">
                  <Wifi className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-body-s font-bold text-text">
                    {data.network.primaryName}
                  </div>
                  <div className="text-caption text-text-muted">
                    {data.network.primaryMeta}
                  </div>
                </div>
              </div>
              <span className="text-caption-bold text-success">
                {data.network.primaryStatus}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[10px] bg-gray-50 border border-border flex items-center justify-center text-text-muted">
                  <Radio className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-body-s font-bold text-text">
                    {data.network.backupName}
                  </div>
                  <div className="text-caption text-text-muted">
                    {data.network.backupMeta}
                  </div>
                </div>
              </div>
              <span className="text-caption-bold text-text-muted">
                {data.network.backupStatus}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-3 flex flex-wrap items-center gap-4 text-caption text-text-muted">
            <span>Router uptime {data.network.routerUptime}</span>
            <span>Latency to HQ {data.network.latencyToHq}</span>
            <span>Offline mode: {data.network.offlineModeNote}</span>
          </div>
        </div>

        {/* Devices Online Card */}
        <div className="lg:col-span-2 rounded-[16px] border border-border bg-surface p-5 flex flex-col justify-between">
          <span className="text-body-s text-text-muted">Devices online</span>
          <div className="text-display-m text-text my-2">
            {data.onlineCount}/{data.totalCount}
          </div>
          <span className="text-caption-bold text-warning">
            {data.attentionCount} needs attention
          </span>
        </div>
      </div>

      {/* Paired Devices Table (Figma Node 474:224820) */}
      <div className="rounded-[16px] border border-border bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h3 className="text-heading-s text-text">Paired devices</h3>
            <p className="text-caption text-text-muted mt-0.5">
              {data.devices.length} devices · latest app {data.latestVersion} ·{" "}
              {pendingUpdateCount} update pending
            </p>
          </div>
          {pendingUpdateCount > 0 && (
            <button
              type="button"
              onClick={() => dispatch(updateAllDevices(storeKey))}
              className="text-label text-primary hover:underline cursor-pointer"
            >
              Update all to {data.latestVersion}
            </button>
          )}
        </div>

        {data.devices.length === 0 ? (
          <div className="px-6 py-14 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-[14px] bg-gray-50 border border-border flex items-center justify-center text-text-muted">
              <Monitor className="h-6 w-6" />
            </div>
            <div className="max-w-[380px]">
              <h4 className="text-heading-s text-text">Register your first device</h4>
              <p className="text-body-s text-text-muted mt-1">
                No POS terminals, KDS displays, kiosks, or printers are paired to{" "}
                {store.name} yet. Generate a one-time pairing code to connect your first screen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(setAddDeviceModalOpen(true))}
              className="h-10 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label font-bold text-white inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Register first device</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-caption-bold text-text-muted uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-6">Device</th>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last seen</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.devices.map((device) => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDeviceId(device.id)}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-[10px] border flex items-center justify-center shrink-0",
                            device.status === "ATTENTION"
                              ? "bg-warning-surface border-warning/30"
                              : "bg-gray-50 border-border"
                          )}
                        >
                          <DeviceIcon
                            type={device.type}
                            attention={device.status === "ATTENTION"}
                          />
                        </div>
                        <div>
                          <div className="text-body-s font-bold text-text">
                            {device.code}
                          </div>
                          <div className="text-caption text-text-muted">
                            {device.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-body-s text-text whitespace-nowrap">
                      {device.station}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge device={device} />
                    </td>
                    <td className="py-3.5 px-4 text-body-s text-text-muted whitespace-nowrap">
                      {device.lastSeenLabel}
                    </td>
                    <td
                      className={cn(
                        "py-3.5 px-4 text-body-s font-medium whitespace-nowrap",
                        device.updateAvailable ? "text-warning" : "text-text"
                      )}
                    >
                      {device.version}
                    </td>
                    <td
                      className="py-3.5 px-6 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(pingDevice({ storeIdOrCode: storeKey, deviceId: device.id }))
                          }
                          className="h-8 px-3 rounded-[8px] border border-border-input bg-surface text-caption-bold text-text hover:bg-gray-50 cursor-pointer"
                        >
                          Ping
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              restartDevice({ storeIdOrCode: storeKey, deviceId: device.id })
                            )
                          }
                          className="h-8 px-3 rounded-[8px] border border-border-input bg-surface text-caption-bold text-text hover:bg-gray-50 cursor-pointer"
                        >
                          Restart
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Unpair ${device.code}?`,
                              description:
                                "Active sessions on this device will be revoked immediately. It will require a new pairing code to reconnect.",
                              confirmLabel: "Unpair device",
                              destructive: true,
                              onConfirm: () => {
                                dispatch(
                                  unpairDevice({ storeIdOrCode: storeKey, deviceId: device.id })
                                );
                                setPendingConfirm(null);
                              },
                            })
                          }
                          className="h-8 px-3 rounded-[8px] border border-border-input bg-surface text-caption-bold text-error hover:bg-error-surface cursor-pointer"
                        >
                          Unpair
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddDeviceModal
        storeIdOrCode={storeKey}
        storeName={store.name}
        defaultType="KDS"
      />

      <DeviceDetailModal
        device={selectedDevice}
        storeIdOrCode={storeKey}
        onClose={() => setSelectedDeviceId(null)}
        onRequestConfirm={(opts) =>
          setPendingConfirm({
            ...opts,
            onConfirm: () => {
              opts.onConfirm();
              setPendingConfirm(null);
            },
          })
        }
      />

      <ConfirmActionDialog
        open={pendingConfirm !== null}
        title={pendingConfirm?.title ?? ""}
        description={pendingConfirm?.description ?? ""}
        confirmLabel={pendingConfirm?.confirmLabel ?? "Confirm"}
        destructive={pendingConfirm?.destructive}
        onConfirm={() => pendingConfirm?.onConfirm()}
        onCancel={() => setPendingConfirm(null)}
      />
    </div>
  );
}
