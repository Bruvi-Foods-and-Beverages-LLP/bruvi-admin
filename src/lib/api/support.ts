import { apiClient } from '@/lib/api/client';

export type TicketStatus = 'OPEN' | 'IN_REVIEW' | 'AWAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export interface SupportTicketRow {
  id: string;
  ticketNumber: string;
  orderId: string | null;
  kind: 'TICKET' | 'CHAT';
  subject: string;
  issueType: string;
  status: TicketStatus;
  statusLabel: string;
  lastMessageAt: string;
  createdAt: string;
  dueAt: string | null;
  customerName: string;
  customerPhone: string | null;
  assigneeName: string | null;
}

export interface SupportMessage {
  id: string;
  role: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  senderName: string | null;
  body: string;
  attachments?: string[];
  at: string;
}

export interface SupportTicketDetail extends SupportTicketRow {
  desiredResolution: string | null;
  order: { orderNumber: string; amountFormatted: string; placedAt: string } | null;
  proposedResolution: {
    type: 'WALLET_REFUND' | 'REPLACEMENT';
    amountPaise: number;
    amountFormatted: string;
    note: string;
    state: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  } | null;
  timeline: { status: TicketStatus; label: string; at: string }[];
  messages: SupportMessage[];
}

/** A live chat whose customer is waiting on staff. */
export interface SupportWaitingChat {
  id: string;
  ticketNumber: string;
  orderId: string | null;
  status: TicketStatus;
  customerName: string;
  assigneeName: string | null;
  /** Newest customer message; null when they have only opened the chat. */
  preview: string | null;
  waitingSince: string;
  /** Changes with every new customer message, so a follow-up alerts again. */
  alertKey: string;
}

export interface SupportLiveChats {
  /** Live chats not resolved or closed. */
  unresolved: number;
  /** Oldest wait first. */
  waiting: SupportWaitingChat[];
}

export const SupportAdminApi = {
  live: () => apiClient.get<SupportLiveChats>('/admin/support/live'),
  list: (p: { status?: TicketStatus; kind?: 'TICKET' | 'CHAT'; orderId?: string }) =>
    apiClient.get<{ items: SupportTicketRow[] }>('/admin/support/tickets', {
      params: { status: p.status, kind: p.kind, orderId: p.orderId, limit: 100 },
    }),
  detail: (id: string) => apiClient.get<SupportTicketDetail>(`/admin/support/tickets/${id}`),
  reply: (id: string, body: string) =>
    apiClient.post<SupportTicketDetail>(`/admin/support/tickets/${id}/messages`, { body }),
  update: (id: string, patch: { status?: TicketStatus; assignToMe?: boolean }) =>
    apiClient.patch<SupportTicketDetail>(`/admin/support/tickets/${id}`, patch),
  propose: (id: string, p: { type: 'WALLET_REFUND' | 'REPLACEMENT'; amountPaise: number; note: string }) =>
    apiClient.post<SupportTicketDetail>(`/admin/support/tickets/${id}/resolution`, p),
};
