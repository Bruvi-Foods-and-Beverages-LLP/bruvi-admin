export interface DashboardKpi {
  netSales: {
    valuePaise: number;
    formatted: string;
    changePercent: number;
    changeLabel: string;
    targetFormatted: string;
  };
  orders: {
    value: number;
    changePercent: number;
    liveNow: number;
  };
  avgOrderValue: {
    valuePaise: number;
    formatted: string;
    changePercent: number;
  };
  digitalShare: {
    totalPercent: number;
    appPercent: number;
    kioskPercent: number;
  };
  avgMakeTime: {
    formatted: string;
    diffFormatted: string;
    targetFormatted: string;
    isOverTarget: boolean;
  };
}

export interface DashboardStoreItem {
  rank: number;
  id: string;
  code: string;
  name: string;
  city: string;
  netSalesFormatted: string;
  ordersCount: number;
  makeTimeFormatted: string;
  isMakeTimeHigh?: boolean;
  status: string;
  statusTone: 'warning' | 'error' | 'success' | 'neutral';
}

export interface DashboardIssueItem {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  subtitle: string;
  actionLabel: string;
  actionUrl: string;
}

export interface DashboardFeed {
  greeting: string;
  user: {
    name: string;
    role: string;
  };
  updatedAtFormatted: string;
  kpi: DashboardKpi;
  storesToday: {
    totalStores: number;
    topStores: DashboardStoreItem[];
  };
  needsAttention: {
    count: number;
    items: DashboardIssueItem[];
  };
}

