import { apiClient } from "@/lib/api/client";
import { PermissionAccessLevel } from "@/types/staff";

export interface StaffListApiResponse {
  kpis: {
    onShiftNow: number;
    totalStaff: number;
    openShifts: number;
    certificationsExpiring: number;
    onLeave: number;
    invited: number;
  };
  total: number;
  page: number;
  limit: number;
  staff: Array<{
    id: string;
    empCode: string;
    name: string;
    roleId: string;
    roleName: string;
    storeId: string | null;
    storeName: string;
    status: "ON_SHIFT" | "OFF" | "LEAVE" | "INVITED";
    phoneMasked: string;
    certifications: Array<{
      id: string;
      label: string;
      status: "valid" | "expiring" | "expired";
      expiresAt?: string | null;
    }>;
    joinedAt: string;
  }>;
}

export interface StaffRoleApiRow {
  id: string;
  code: string;
  name: string;
  description: string;
  scope: "Store" | "Warehouse" | "HQ";
  default_apps: string[];
  is_system: boolean;
  display_order: number;
}

export interface PermissionsMatrixApiResponse {
  roles: StaffRoleApiRow[];
  capabilities: Array<{
    id: string;
    area: "ORDERS" | "CASH" | "INVENTORY" | "MENU" | "STAFF" | "FINANCE" | "SETTINGS";
    label: string;
    subtitle?: string | null;
    is_sensitive: boolean;
    display_order: number;
  }>;
  assignments: Array<{
    role_id: string;
    capability_id: string;
    access_level: PermissionAccessLevel;
    rule_meta?: Record<string, unknown>;
  }>;
  changeLog: Array<{
    id: string;
    actor_name: string;
    summary: string;
    created_at: string;
  }>;
}

export const StaffApi = {
  async listStaff(params: {
    search?: string;
    store?: string;
    roleId?: string;
    status?: string;
    certExpiring?: boolean;
    page?: number;
    limit?: number;
  }): Promise<StaffListApiResponse> {
    return apiClient.request<StaffListApiResponse>("/v1/admin/staff", { params });
  },

  async inviteStaff(payload: {
    fullName: string;
    phoneNumber?: string;
    email?: string;
    storeIdOrCode: string;
    roleId: string;
    pin?: string;
  }) {
    return apiClient.request<{
      userId: string;
      empCode: string;
      fullName: string;
      storeName: string;
      roleName: string;
      status: string;
    }>("/v1/admin/staff/invite", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async bulkAction(payload: {
    userIds: string[];
    action: "CHANGE_ROLE" | "DEACTIVATE" | "ACTIVATE";
    roleId?: string;
  }) {
    return apiClient.request<{ updatedCount: number; action: string }>(
      "/v1/admin/staff/bulk",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  getExportUrl(): string {
    return "/api/proxy/v1/admin/staff/export";
  },

  async getStaffDetail(id: string) {
    return apiClient.request<any>(`/v1/admin/staff/${encodeURIComponent(id)}`);
  },

  async updateStaffProfile(
    id: string,
    payload: {
      fullName?: string;
      roleId?: string;
      homeOutletId?: string | null;
      reportsToUserId?: string | null;
      employmentStatus?: "ACTIVE" | "ON_LEAVE" | "INVITED" | "DEACTIVATED";
    },
  ) {
    return apiClient.request<any>(`/v1/admin/staff/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async updateStaffAccess(
    id: string,
    payload: {
      appKey: "STAFF_APP" | "POS" | "KDS" | "WAREHOUSE_APP" | "HQ_ADMIN";
      isGranted: boolean;
      outletId?: string;
      deviceId?: string;
      scopeLabel?: string;
    },
  ) {
    return apiClient.request<any>(
      `/v1/admin/staff/${encodeURIComponent(id)}/access`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },

  async addStaffNote(id: string, body: string) {
    return apiClient.request<any>(
      `/v1/admin/staff/${encodeURIComponent(id)}/notes`,
      {
        method: "POST",
        body: JSON.stringify({ body }),
      },
    );
  },

  async listRoles() {
    return apiClient.request<{ roles: StaffRoleApiRow[] }>("/v1/admin/roles");
  },

  async createRole(payload: {
    name: string;
    description: string;
    scope: "Store" | "Warehouse" | "HQ";
    defaultApps: string[];
  }) {
    return apiClient.request<StaffRoleApiRow>("/v1/admin/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateRole(
    id: string,
    payload: {
      name?: string;
      description?: string;
      defaultApps?: string[];
    },
  ) {
    return apiClient.request<StaffRoleApiRow>(
      `/v1/admin/roles/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },

  async duplicateRole(id: string) {
    return apiClient.request<StaffRoleApiRow>(
      `/v1/admin/roles/${encodeURIComponent(id)}/duplicate`,
      { method: "POST" },
    );
  },

  async getPermissionsMatrix() {
    return apiClient.request<PermissionsMatrixApiResponse>("/v1/admin/permissions");
  },

  async savePermissionsMatrix(
    updates: Array<{
      roleId: string;
      capabilityId: string;
      accessLevel: PermissionAccessLevel;
    }>,
  ) {
    return apiClient.request<{ savedCount: number; summary: string }>(
      "/v1/admin/permissions",
      {
        method: "PUT",
        body: JSON.stringify({ updates }),
      },
    );
  },

  async getShiftManagement(store: string, weekStart?: string) {
    return apiClient.request<{
      store: { id: string; code: string; name: string };
      weekStart: string;
      shifts: any[];
      openShifts: any[];
      swapRequests: any[];
    }>("/v1/admin/shifts", {
      params: { store, weekStart },
    });
  },

  async publishRota(storeIdOrCode: string, weekStart: string) {
    return apiClient.request<{ publishedCount: number; weekStart: string }>(
      "/v1/admin/shifts/publish",
      {
        method: "POST",
        body: JSON.stringify({ outletIdOrCode: storeIdOrCode, weekStart }),
      },
    );
  },

  async decideSwap(swapId: string, decision: "APPROVED" | "DECLINED") {
    return apiClient.request<any>(
      `/v1/admin/shifts/swaps/${encodeURIComponent(swapId)}/decision`,
      {
        method: "POST",
        body: JSON.stringify({ decision }),
      },
    );
  },
};
