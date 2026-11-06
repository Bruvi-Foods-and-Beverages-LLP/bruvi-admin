import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { ModifierGroupDetail, ModifierGroupPayload } from "@/types/catalog";
import { CatalogApi } from "@/lib/api/catalog";
import type { SavePlan } from "@/lib/catalog/modifier-editor";

interface ModifierGroupsState {
  groups: ModifierGroupDetail[];
  loading: boolean;
  error: string | null;
  search: string;
  selectedId: string | null;
  detail: ModifierGroupDetail | null;
  detailLoading: boolean;
  detailError: string | null;
  saving: boolean;
  saveError: string | null;
}

const initialState: ModifierGroupsState = {
  groups: [],
  loading: false,
  error: null,
  search: "",
  selectedId: null,
  detail: null,
  detailLoading: false,
  detailError: null,
  saving: false,
  saveError: null,
};

const message = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

export const fetchModifierGroups = createAsyncThunk(
  "modifierGroups/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      return await CatalogApi.getModifierGroups();
    } catch (err: unknown) {
      return rejectWithValue(message(err, "Failed to fetch modifier groups"));
    }
  },
);

export const fetchModifierGroupDetail = createAsyncThunk(
  "modifierGroups/fetchDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      return await CatalogApi.getModifierGroupById(id);
    } catch (err: unknown) {
      return rejectWithValue(message(err, "Failed to load modifier group"));
    }
  },
);

export const createModifierGroup = createAsyncThunk(
  "modifierGroups/create",
  async (payload: ModifierGroupPayload & { name: string }, { rejectWithValue }) => {
    try {
      return await CatalogApi.createModifierGroup(payload);
    } catch (err: unknown) {
      return rejectWithValue(message(err, "Could not create the group"));
    }
  },
);

export const duplicateModifierGroup = createAsyncThunk(
  "modifierGroups/duplicate",
  async (id: string, { rejectWithValue }) => {
    try {
      return await CatalogApi.duplicateModifierGroup(id);
    } catch (err: unknown) {
      return rejectWithValue(message(err, "Could not duplicate the group"));
    }
  },
);

export const deleteModifierGroup = createAsyncThunk(
  "modifierGroups/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await CatalogApi.deleteModifierGroup(id);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(message(err, "Could not delete the group"));
    }
  },
);

export const reorderModifierGroups = createAsyncThunk(
  "modifierGroups/reorder",
  async (ids: string[], { rejectWithValue }) => {
    try {
      return await CatalogApi.reorderModifierGroups(ids);
    } catch (err: unknown) {
      return rejectWithValue(message(err, "Could not save the new order"));
    }
  },
);

/**
 * Applies an editor save plan: group settings, removed, changed and new options, then order.
 * Ends with the fresh group from the server.
 */
export const saveModifierGroup = createAsyncThunk(
  "modifierGroups/save",
  async ({ id, plan }: { id: string; plan: SavePlan }, { dispatch, rejectWithValue }) => {
    try {
      if (Object.keys(plan.group).length > 0) await CatalogApi.updateModifierGroup(id, plan.group);
      for (const optionId of plan.deletes) await CatalogApi.deleteModifierOption(optionId);
      for (const u of plan.updates) await CatalogApi.updateModifierOption(u.id, u.payload);
      // Each create returns the whole group; the one id we have not seen yet is the new option
      const createdIds = new Map<string, string>();
      const known = new Set(
        plan.orderKeys.filter((k) => !k.startsWith("new-")),
      );
      for (const c of plan.creates) {
        const after = await CatalogApi.createModifierOption({ ...c.payload, modifierGroupId: id });
        const created = after.modifiers.find((m) => !known.has(m.id));
        if (created) {
          createdIds.set(c.key, created.id);
          known.add(created.id);
        }
      }
      let fresh: ModifierGroupDetail;
      if (plan.orderChanged) {
        const ids = plan.orderKeys
          .map((k) => createdIds.get(k) ?? k)
          .filter((k) => !k.startsWith("new-"));
        fresh = await CatalogApi.reorderModifierOptions(id, ids);
      } else {
        fresh = await CatalogApi.getModifierGroupById(id);
      }
      void dispatch(fetchModifierGroups());
      return fresh;
    } catch (err: unknown) {
      // Something may have been written: reload what the server has now
      void dispatch(fetchModifierGroupDetail(id));
      return rejectWithValue(message(err, "Failed to save changes"));
    }
  },
);

const modifierGroupsSlice = createSlice({
  name: "modifierGroups",
  initialState,
  reducers: {
    setModifierSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    selectModifierGroup(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearModifierSaveError(state) {
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModifierGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModifierGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
        if (!state.groups.some((g) => g.id === state.selectedId)) {
          state.selectedId = state.groups[0]?.id ?? null;
        }
      })
      .addCase(fetchModifierGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch modifier groups";
      })
      .addCase(fetchModifierGroupDetail.pending, (state, action) => {
        state.detailLoading = true;
        state.detailError = null;
        if (state.detail && state.detail.id !== action.meta.arg) state.detail = null;
      })
      .addCase(fetchModifierGroupDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchModifierGroupDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = (action.payload as string) || "Failed to load modifier group";
      })
      .addCase(saveModifierGroup.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveModifierGroup.fulfilled, (state, action) => {
        state.saving = false;
        state.detail = action.payload;
      })
      .addCase(saveModifierGroup.rejected, (state, action) => {
        state.saving = false;
        state.saveError = (action.payload as string) || "Failed to save changes";
      })
      .addCase(deleteModifierGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((g) => g.id !== action.payload);
        if (state.detail?.id === action.payload) state.detail = null;
      })
      .addCase(reorderModifierGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(createModifierGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(duplicateModifierGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      });
  },
});

export const { setModifierSearch, selectModifierGroup, clearModifierSaveError } = modifierGroupsSlice.actions;
export default modifierGroupsSlice.reducer;
