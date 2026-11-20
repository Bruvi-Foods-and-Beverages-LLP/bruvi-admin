import { create } from "zustand";
import type { SupportWaitingChat } from "@/lib/api/support";

const DISMISSED_KEY = "bruvi.support.dismissedAlerts";

function readDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(DISMISSED_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === "string") : [];
  } catch {
    return [];
  }
}

function writeDismissed(keys: string[]) {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(keys));
  } catch {
    // Private mode or blocked storage: dismissals last for this page only.
  }
}

interface SupportLiveState {
  /** Live chats not resolved yet (drives the blue dot on Customers). */
  unresolved: number;
  /** Chats waiting on staff, oldest first. */
  waiting: SupportWaitingChat[];
  /** Live event stream status, shared with the inbox. */
  connected: boolean;
  /** Bumps on every support event; the inbox refetches when it changes. */
  eventSeq: number;
  lastEventTicketId: string | null;
  /** Conversation open in the inbox; it never raises an alert. */
  activeTicketId: string | null;
  /** Alert keys the agent closed with Later or Dismiss all. */
  dismissed: string[];

  setLive: (live: { unresolved: number; waiting: SupportWaitingChat[] }) => void;
  setConnected: (connected: boolean) => void;
  recordEvent: (ticketId: string) => void;
  setActiveTicket: (ticketId: string | null) => void;
  dismiss: (alertKeys: string[]) => void;
}

export const useSupportLiveStore = create<SupportLiveState>((set, get) => ({
  unresolved: 0,
  waiting: [],
  connected: false,
  eventSeq: 0,
  lastEventTicketId: null,
  activeTicketId: null,
  dismissed: readDismissed(),

  setLive: ({ unresolved, waiting }) => {
    // Forget dismissals for chats that are no longer waiting, so the list stays small.
    const live = new Set(waiting.map((w) => w.alertKey));
    const dismissed = get().dismissed.filter((k) => live.has(k));
    if (dismissed.length !== get().dismissed.length) writeDismissed(dismissed);
    set({ unresolved, waiting, dismissed });
  },
  setConnected: (connected) => set({ connected }),
  recordEvent: (ticketId) => set((s) => ({ eventSeq: s.eventSeq + 1, lastEventTicketId: ticketId })),
  setActiveTicket: (activeTicketId) => set({ activeTicketId }),
  dismiss: (alertKeys) => {
    const dismissed = [...new Set([...get().dismissed, ...alertKeys])];
    writeDismissed(dismissed);
    set({ dismissed });
  },
}));

/** Waiting chats that should alert right now. */
export function selectAlerts(s: SupportLiveState): SupportWaitingChat[] {
  return s.waiting.filter((w) => w.id !== s.activeTicketId && !s.dismissed.includes(w.alertKey));
}
