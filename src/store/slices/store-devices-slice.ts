import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ActivePairingCode,
  StoreDevice,
  StoreDevicesData,
  StoreDeviceType,
  StoreStation,
  StoreStationKind,
} from "@/types/store-devices";

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (json && typeof json.message === "string" && json.message) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return (json && "data" in json ? json.data : json) as T;
}

export const fetchStoreDevices = createAsyncThunk<StoreDevicesData, string>(
  "storeDevices/fetch",
  async (storeIdOrCode) => {
    return apiRequest<StoreDevicesData>(
      `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices`
    );
  }
);

export const generatePairingCode = createAsyncThunk<
  { pairing: ActivePairingCode; pendingDevice: StoreDevice },
  {
    storeIdOrCode: string;
    deviceType: StoreDeviceType;
    deviceName: string;
    station: string;
    stationId?: string;
  }
>(
  "storeDevices/generateCode",
  async ({ storeIdOrCode, deviceType, deviceName, station, stationId }) => {
    return apiRequest<{ pairing: ActivePairingCode; pendingDevice: StoreDevice }>(
      `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/pairing-code`,
      {
        method: "POST",
        body: JSON.stringify({ deviceType, deviceName, station, stationId }),
      }
    );
  }
);

export const regenerateDevicePairingCode = createAsyncThunk<
  { pairing: ActivePairingCode; pendingDevice: StoreDevice },
  { storeIdOrCode: string; deviceId: string }
>("storeDevices/regenerateCode", async ({ storeIdOrCode, deviceId }) => {
  return apiRequest<{ pairing: ActivePairingCode; pendingDevice: StoreDevice }>(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}/pairing-code`,
    { method: "POST" }
  );
});

export const updateDevice = createAsyncThunk<
  { device: StoreDevice; message: string },
  {
    storeIdOrCode: string;
    deviceId: string;
    deviceName?: string;
    stationId?: string;
    station?: string;
  }
>("storeDevices/updateDevice", async ({ storeIdOrCode, deviceId, ...body }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
});

export const pingDevice = createAsyncThunk<
  { device: StoreDevice; latencyMs: number; message: string },
  { storeIdOrCode: string; deviceId: string }
>("storeDevices/ping", async ({ storeIdOrCode, deviceId }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}/ping`,
    { method: "POST" }
  );
});

export const restartDevice = createAsyncThunk<
  { device: StoreDevice; message: string },
  { storeIdOrCode: string; deviceId: string }
>("storeDevices/restart", async ({ storeIdOrCode, deviceId }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}/restart`,
    { method: "POST" }
  );
});

export const disableDevice = createAsyncThunk<
  { device: StoreDevice; message: string },
  { storeIdOrCode: string; deviceId: string; reason?: string }
>("storeDevices/disable", async ({ storeIdOrCode, deviceId, reason }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}/disable`,
    {
      method: "POST",
      body: JSON.stringify({ reason }),
    }
  );
});

export const enableDevice = createAsyncThunk<
  { device: StoreDevice; message: string },
  { storeIdOrCode: string; deviceId: string }
>("storeDevices/enable", async ({ storeIdOrCode, deviceId }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}/enable`,
    { method: "POST" }
  );
});

export const unpairDevice = createAsyncThunk<
  { unpairedId: string; message: string },
  { storeIdOrCode: string; deviceId: string }
>("storeDevices/unpair", async ({ storeIdOrCode, deviceId }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/${encodeURIComponent(deviceId)}`,
    { method: "DELETE" }
  );
});

export const updateAllDevices = createAsyncThunk<
  { latestVersion: string; message: string; data: StoreDevicesData },
  string
>("storeDevices/updateAll", async (storeIdOrCode) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/update-all`,
    { method: "POST" }
  );
});

export const runDiagnostics = createAsyncThunk<
  { data: StoreDevicesData; message: string },
  string
>("storeDevices/diagnostics", async (storeIdOrCode) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/devices/diagnostics`,
    { method: "POST" }
  );
});

export const createStation = createAsyncThunk<
  { station: StoreStation; message: string },
  { storeIdOrCode: string; name: string; kind: StoreStationKind }
>("storeDevices/createStation", async ({ storeIdOrCode, name, kind }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/stations`,
    {
      method: "POST",
      body: JSON.stringify({ name, kind }),
    }
  );
});

export const updateStation = createAsyncThunk<
  { station: StoreStation; message: string },
  { storeIdOrCode: string; stationId: string; name?: string; kind?: StoreStationKind }
>("storeDevices/updateStation", async ({ storeIdOrCode, stationId, ...body }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/stations/${encodeURIComponent(stationId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
});

export const deleteStation = createAsyncThunk<
  { removedId: string; message: string },
  { storeIdOrCode: string; stationId: string }
>("storeDevices/deleteStation", async ({ storeIdOrCode, stationId }) => {
  return apiRequest(
    `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeIdOrCode)}/stations/${encodeURIComponent(stationId)}`,
    { method: "DELETE" }
  );
});

interface StoreDevicesState {
  data: StoreDevicesData | null;
  isLoading: boolean;
  isGenerating: boolean;
  isAddModalOpen: boolean;
  actionBanner: string | null;
  error: string | null;
}

const initialState: StoreDevicesState = {
  data: null,
  isLoading: false,
  isGenerating: false,
  isAddModalOpen: false,
  actionBanner: null,
  error: null,
};

function upsertDevice(state: StoreDevicesState, updated: StoreDevice) {
  if (!state.data) return;
  const idx = state.data.devices.findIndex((d) => d.id === updated.id);
  if (idx >= 0) {
    state.data.devices[idx] = updated;
  } else {
    state.data.devices.unshift(updated);
  }
  state.data.totalCount = state.data.devices.length;
  state.data.onlineCount = state.data.devices.filter(
    (d) => d.status === "ONLINE" || d.status === "ATTENTION"
  ).length;
  state.data.attentionCount = state.data.devices.filter(
    (d) => d.status === "ATTENTION" || d.isDisabled
  ).length;
}

const storeDevicesSlice = createSlice({
  name: "storeDevices",
  initialState,
  reducers: {
    setAddDeviceModalOpen(state, action: PayloadAction<boolean>) {
      state.isAddModalOpen = action.payload;
    },
    clearDeviceBanner(state) {
      state.actionBanner = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreDevices.pending, (state) => {
        if (!state.data) state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchStoreDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load devices";
      })
      .addCase(generatePairingCode.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generatePairingCode.fulfilled, (state, action) => {
        state.isGenerating = false;
        if (!state.data) return;
        state.data.activePairingCode = action.payload.pairing;
        upsertDevice(state, {
          ...action.payload.pendingDevice,
          pendingCode: action.payload.pairing.code,
          pendingCodeExpiresAtIso: action.payload.pairing.expiresAtIso,
        });
      })
      .addCase(generatePairingCode.rejected, (state, action) => {
        state.isGenerating = false;
        state.actionBanner = action.error.message ?? "Failed to generate pairing code";
      })
      .addCase(regenerateDevicePairingCode.fulfilled, (state, action) => {
        if (!state.data) return;
        state.data.activePairingCode = action.payload.pairing;
        upsertDevice(state, {
          ...action.payload.pendingDevice,
          pendingCode: action.payload.pairing.code,
          pendingCodeExpiresAtIso: action.payload.pairing.expiresAtIso,
        });
        state.actionBanner = `New code ${action.payload.pairing.code} generated for ${action.payload.pairing.deviceName}.`;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        upsertDevice(state, action.payload.device);
        state.actionBanner = action.payload.message;
      })
      .addCase(pingDevice.fulfilled, (state, action) => {
        upsertDevice(state, action.payload.device);
        state.actionBanner = action.payload.message;
      })
      .addCase(restartDevice.fulfilled, (state, action) => {
        upsertDevice(state, action.payload.device);
        state.actionBanner = action.payload.message;
      })
      .addCase(disableDevice.fulfilled, (state, action) => {
        upsertDevice(state, action.payload.device);
        state.actionBanner = action.payload.message;
      })
      .addCase(enableDevice.fulfilled, (state, action) => {
        upsertDevice(state, action.payload.device);
        state.actionBanner = action.payload.message;
      })
      .addCase(unpairDevice.fulfilled, (state, action) => {
        if (!state.data) return;
        state.data.devices = state.data.devices.filter((d) => d.id !== action.payload.unpairedId);
        state.data.totalCount = state.data.devices.length;
        state.data.onlineCount = state.data.devices.filter(
          (d) => d.status === "ONLINE" || d.status === "ATTENTION"
        ).length;
        state.actionBanner = action.payload.message;
      })
      .addCase(updateAllDevices.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.actionBanner = action.payload.message;
      })
      .addCase(runDiagnostics.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.actionBanner = action.payload.message;
      })
      .addCase(createStation.fulfilled, (state, action) => {
        if (!state.data) return;
        state.data.stations.push(action.payload.station);
        state.actionBanner = action.payload.message;
      })
      .addCase(updateStation.fulfilled, (state, action) => {
        if (!state.data) return;
        const idx = state.data.stations.findIndex((s) => s.id === action.payload.station.id);
        if (idx >= 0) {
          state.data.stations[idx] = {
            ...state.data.stations[idx],
            ...action.payload.station,
          };
        }
        for (const d of state.data.devices) {
          if (d.stationId === action.payload.station.id) {
            d.station = action.payload.station.name;
          }
        }
        state.actionBanner = action.payload.message;
      })
      .addCase(deleteStation.fulfilled, (state, action) => {
        if (!state.data) return;
        state.data.stations = state.data.stations.filter((s) => s.id !== action.payload.removedId);
        state.actionBanner = action.payload.message;
      })
      .addCase(deleteStation.rejected, (state, action) => {
        state.actionBanner = action.error.message ?? "Unable to remove station";
      });
  },
});

export const { setAddDeviceModalOpen, clearDeviceBanner } = storeDevicesSlice.actions;

export default storeDevicesSlice.reducer;
