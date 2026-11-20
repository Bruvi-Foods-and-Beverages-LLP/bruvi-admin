import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ApiClientError } from "@/lib/api/client";
import {
  MembershipApi,
  type AdminEconomicsDto,
  type AdminOptionsDto,
  type AdminPlanCardDto,
  type AdminSubscriptionRowDto,
  type AdminSummaryDto,
  type Paged,
  type PastDueDto,
  type SubscriptionsQuery,
} from "@/lib/api/membership";

type LoadStatus = "idle" | "loading" | "ready" | "error";

/** A failed load: `forbidden` drives the no-permission state, `offline` the stale banner. */
export interface LoadError {
  message: string;
  forbidden: boolean;
  offline: boolean;
}

export type SubscriptionsFilters = Omit<SubscriptionsQuery, "page" | "pageSize">;

export interface MembershipState {
  plans: { status: LoadStatus; items: AdminPlanCardDto[]; error: LoadError | null };
  summary: { status: LoadStatus; data: AdminSummaryDto | null; error: LoadError | null };
  economics: { status: LoadStatus; data: AdminEconomicsDto | null; error: LoadError | null };
  options: AdminOptionsDto | null;
  subscribers: {
    status: LoadStatus;
    filters: SubscriptionsFilters;
    page: number;
    pageSize: number;
    data: Paged<AdminSubscriptionRowDto> | null;
    error: LoadError | null;
  };
  pastDue: { status: LoadStatus; data: PastDueDto | null; error: LoadError | null };
}

const initialState: MembershipState = {
  plans: { status: "idle", items: [], error: null },
  summary: { status: "idle", data: null, error: null },
  economics: { status: "idle", data: null, error: null },
  options: null,
  subscribers: { status: "idle", filters: {}, page: 1, pageSize: 25, data: null, error: null },
  pastDue: { status: "idle", data: null, error: null },
};

function toLoadError(err: unknown): LoadError {
  if (err instanceof ApiClientError) {
    return {
      message: err.message,
      forbidden: err.statusCode === 403,
      offline: err.statusCode === 0 || err.statusCode === 502 || err.statusCode === 504,
    };
  }
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  return { message: err instanceof Error ? err.message : "Something went wrong", forbidden: false, offline };
}

const thunk = <R, A = void>(type: string, fn: (arg: A) => Promise<R>) =>
  createAsyncThunk<R, A, { rejectValue: LoadError }>(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (err) {
      return rejectWithValue(toLoadError(err));
    }
  });

export const fetchMembershipPlans = thunk("membership/plans", () => MembershipApi.plans());
export const fetchMembershipSummary = thunk("membership/summary", () => MembershipApi.summary());
export const fetchMembershipEconomics = thunk("membership/economics", (months: number) => MembershipApi.economics(months));
export const fetchMembershipOptions = thunk("membership/options", () => MembershipApi.options());
export const fetchPastDue = thunk("membership/pastDue", () => MembershipApi.pastDue());

export const fetchSubscribers = createAsyncThunk<
  Paged<AdminSubscriptionRowDto>,
  void,
  { state: { membership: MembershipState }; rejectValue: LoadError }
>("membership/subscribers", async (_, { getState, rejectWithValue }) => {
  const { filters, page, pageSize } = getState().membership.subscribers;
  try {
    return await MembershipApi.subscriptions({ ...filters, page, pageSize });
  } catch (err) {
    return rejectWithValue(toLoadError(err));
  }
});

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    setSubscriberFilters(state, action: PayloadAction<Partial<SubscriptionsFilters>>) {
      state.subscribers.filters = { ...state.subscribers.filters, ...action.payload };
      state.subscribers.page = 1;
    },
    clearSubscriberFilters(state) {
      state.subscribers.filters = {};
      state.subscribers.page = 1;
    },
    setSubscriberPage(state, action: PayloadAction<number>) {
      state.subscribers.page = Math.max(1, action.payload);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchMembershipPlans.pending, (s) => {
      s.plans.status = "loading";
    })
      .addCase(fetchMembershipPlans.fulfilled, (s, a) => {
        s.plans = { status: "ready", items: a.payload, error: null };
      })
      .addCase(fetchMembershipPlans.rejected, (s, a) => {
        s.plans.status = "error";
        s.plans.error = a.payload ?? toLoadError(a.error);
      })
      .addCase(fetchMembershipSummary.pending, (s) => {
        s.summary.status = "loading";
      })
      .addCase(fetchMembershipSummary.fulfilled, (s, a) => {
        s.summary = { status: "ready", data: a.payload, error: null };
      })
      .addCase(fetchMembershipSummary.rejected, (s, a) => {
        s.summary.status = "error";
        s.summary.error = a.payload ?? toLoadError(a.error);
      })
      .addCase(fetchMembershipEconomics.pending, (s) => {
        s.economics.status = "loading";
      })
      .addCase(fetchMembershipEconomics.fulfilled, (s, a) => {
        s.economics = { status: "ready", data: a.payload, error: null };
      })
      .addCase(fetchMembershipEconomics.rejected, (s, a) => {
        s.economics.status = "error";
        s.economics.error = a.payload ?? toLoadError(a.error);
      })
      .addCase(fetchMembershipOptions.fulfilled, (s, a) => {
        s.options = a.payload;
      })
      .addCase(fetchPastDue.pending, (s) => {
        s.pastDue.status = "loading";
      })
      .addCase(fetchPastDue.fulfilled, (s, a) => {
        s.pastDue = { status: "ready", data: a.payload, error: null };
      })
      .addCase(fetchPastDue.rejected, (s, a) => {
        s.pastDue.status = "error";
        s.pastDue.error = a.payload ?? toLoadError(a.error);
      })
      .addCase(fetchSubscribers.pending, (s) => {
        s.subscribers.status = "loading";
      })
      .addCase(fetchSubscribers.fulfilled, (s, a) => {
        s.subscribers.status = "ready";
        s.subscribers.data = a.payload;
        s.subscribers.error = null;
      })
      .addCase(fetchSubscribers.rejected, (s, a) => {
        s.subscribers.status = "error";
        s.subscribers.error = a.payload ?? toLoadError(a.error);
      });
  },
});

export const { setSubscriberFilters, clearSubscriberFilters, setSubscriberPage } = membershipSlice.actions;
export default membershipSlice.reducer;
