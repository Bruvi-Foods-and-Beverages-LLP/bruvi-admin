import {
  AddonAttachRow,
  ChannelMixMonth,
  CohortRetentionRow,
  DailySalesPoint,
  DrinkMixTile,
  LtvChannelRow,
  ModifierChoiceRow,
  OrderFrequencyBin,
  ProductContributionRow,
  RetentionCurvePoint,
  RfmSegmentCell,
  StoreAnalyticsRow,
  StoreProfitabilityRow,
  TopTrendProduct,
  WeeklyCustomerOrders,
} from "@/types/analytics";

export const DAILY_NET_SALES_SEP: DailySalesPoint[] = [
  { day: 1, label: "1 Sep", sepLakh: 8.8, augLakh: 10.1, isWeekend: false },
  { day: 2, label: "2 Sep", sepLakh: 8.75, augLakh: 9.9, isWeekend: false },
  { day: 3, label: "3 Sep", sepLakh: 9.0, augLakh: 8.6, isWeekend: false },
  { day: 4, label: "4 Sep", sepLakh: 9.4, augLakh: 8.5, isWeekend: false },
  { day: 5, label: "5 Sep", sepLakh: 11.0, augLakh: 8.35, isWeekend: true },
  { day: 6, label: "6 Sep", sepLakh: 11.25, augLakh: 8.2, isWeekend: true },
  { day: 7, label: "7 Sep", sepLakh: 9.5, augLakh: 9.0, isWeekend: false },
  { day: 8, label: "8 Sep", sepLakh: 9.45, augLakh: 10.3, isWeekend: false },
  { day: 9, label: "9 Sep", sepLakh: 9.4, augLakh: 10.55, isWeekend: false },
  { day: 10, label: "10 Sep", sepLakh: 9.1, augLakh: 8.65, isWeekend: false },
  { day: 11, label: "11 Sep", sepLakh: 9.8, augLakh: 8.45, isWeekend: false },
  { day: 12, label: "12 Sep", sepLakh: 11.35, augLakh: 8.4, isWeekend: true },
  { day: 13, label: "13 Sep", sepLakh: 11.3, augLakh: 8.5, isWeekend: true },
  { day: 14, label: "14 Sep", sepLakh: 9.15, augLakh: 8.8, isWeekend: false },
  { day: 15, label: "15 Sep", sepLakh: 9.25, augLakh: 10.2, isWeekend: false },
  { day: 16, label: "16 Sep", sepLakh: 9.75, augLakh: 10.3, isWeekend: false },
  { day: 17, label: "17 Sep", sepLakh: 9.7, augLakh: 8.7, isWeekend: false },
  { day: 18, label: "18 Sep", sepLakh: 10.25, augLakh: 8.25, isWeekend: false },
  { day: 19, label: "19 Sep", sepLakh: 11.9, augLakh: 8.3, isWeekend: true },
  { day: 20, label: "20 Sep", sepLakh: 11.5, augLakh: 8.65, isWeekend: true },
  { day: 21, label: "21 Sep", sepLakh: 9.5, augLakh: 8.85, isWeekend: false },
  { day: 22, label: "22 Sep", sepLakh: 9.7, augLakh: 10.55, isWeekend: false },
  { day: 23, label: "23 Sep", sepLakh: 9.8, augLakh: 10.5, isWeekend: false },
  { day: 24, label: "24 Sep", sepLakh: 9.9, augLakh: 8.6, isWeekend: false },
  { day: 25, label: "25 Sep", sepLakh: 10.55, augLakh: 8.8, isWeekend: false },
  { day: 26, label: "26 Sep", sepLakh: 11.6, augLakh: 8.5, isWeekend: true },
  { day: 27, label: "Sun 27", sepLakh: 12.0, augLakh: 8.7, isWeekend: true },
  { day: 28, label: "28 Sep", sepLakh: 9.95, augLakh: 8.95, isWeekend: false },
  { day: 29, label: "29 Sep", sepLakh: 9.85, augLakh: 10.75, isWeekend: false },
  { day: 30, label: "30 Sep", sepLakh: 9.65, augLakh: 10.5, isWeekend: false },
];

export const CHANNEL_MIX_MONTHS: ChannelMixMonth[] = [
  { month: "Jun", appPct: 29, counterPct: 48, kioskPct: 14, qrDeliveryPct: 9 },
  { month: "Jul", appPct: 31, counterPct: 46, kioskPct: 14, qrDeliveryPct: 9 },
  { month: "Aug", appPct: 34, counterPct: 43, kioskPct: 15, qrDeliveryPct: 8 },
  { month: "Sep", appPct: 37, counterPct: 40, kioskPct: 15, qrDeliveryPct: 8 },
];

export const STORE_ANALYTICS_RANKING: StoreAnalyticsRow[] = [
  {
    rank: 1,
    id: "ind",
    name: "Indiranagar",
    city: "Bengaluru",
    code: "BLR-IND",
    tierLabel: "Flagship",
    manager: "Meera K.",
    netSalesLakh: 35.3,
    orders: 10995,
    ordersDeltaPct: 9.1,
    aovInr: 321,
    aovDeltaPct: 3.0,
    makeTime: "4:52",
    makeTimeTarget: "0:14 · target 4:30",
    makeTimeAlert: false,
    rating: 4.7,
    deltaAugPct: 12.4,
    hourlySales: [32, 68, 92, 76, 54, 48, 44, 42, 48, 56, 62, 58, 52, 46, 38, 22],
    topProducts: [
      { name: "Salted Cream Cold Brew", sold: 3400, sharePct: 21.4, tone: "coffee" },
      { name: "Cà Phê Sữa Đá", sold: 2350, sharePct: 14.8, tone: "coffee" },
      { name: "Iced Matcha Latte", sold: 1780, sharePct: 11.2, tone: "matcha" },
    ],
  },
  {
    rank: 2,
    id: "kor",
    name: "Koramangala",
    city: "Bengaluru",
    code: "BLR-KOR",
    tierLabel: "High-street",
    manager: "Vikram S.",
    netSalesLakh: 33.4,
    orders: 10244,
    ordersDeltaPct: 7.4,
    aovInr: 326,
    aovDeltaPct: 2.2,
    makeTime: "4:31",
    makeTimeTarget: "0:01 · target 4:30",
    makeTimeAlert: false,
    rating: 4.6,
    deltaAugPct: 9.8,
    hourlySales: [28, 60, 84, 72, 50, 44, 42, 40, 46, 54, 60, 56, 50, 44, 34, 20],
    topProducts: [
      { name: "Salted Cream Cold Brew", sold: 3110, sharePct: 20.6, tone: "coffee" },
      { name: "Cà Phê Sữa Đá", sold: 2190, sharePct: 14.5, tone: "coffee" },
      { name: "Iced Matcha Latte", sold: 1620, sharePct: 10.8, tone: "matcha" },
    ],
  },
  { rank: 3, id: "ban", name: "Bandra", city: "Mumbai", code: "BOM-BAN", tierLabel: "Flagship", manager: "Sana Q.", netSalesLakh: 32.3, orders: 9529, ordersDeltaPct: 6.2, aovInr: 339, aovDeltaPct: 1.8, makeTime: "5:06", makeTimeTarget: "0:36 · target 4:30", makeTimeAlert: false, rating: 4.6, deltaAugPct: 8.1, hourlySales: [24, 54, 78, 70, 52, 46, 44, 42, 50, 58, 64, 60, 54, 48, 38, 24], topProducts: [{ name: "Salted Cream Cold Brew", sold: 2940, sharePct: 19.8, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1840, sharePct: 13.4, tone: "matcha" }, { name: "Cà Phê Sữa Đá", sold: 1790, sharePct: 12.9, tone: "coffee" }] },
  { rank: 4, id: "lpl", name: "Lower Parel", city: "Mumbai", code: "BOM-LPL", tierLabel: "Corporate", manager: "Rhea P.", netSalesLakh: 28.3, orders: 8473, ordersDeltaPct: 5.1, aovInr: 334, aovDeltaPct: 1.5, makeTime: "4:44", makeTimeTarget: "0:14 · target 4:30", makeTimeAlert: false, rating: 4.5, deltaAugPct: 6.9, hourlySales: [20, 48, 86, 78, 60, 54, 48, 42, 40, 46, 48, 42, 34, 28, 20, 12], topProducts: [{ name: "Salted Cream Cold Brew", sold: 2510, sharePct: 18.9, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1920, sharePct: 14.4, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1410, sharePct: 10.6, tone: "matcha" }] },
  { rank: 5, id: "cyb", name: "Cyber Hub", city: "Gurugram", code: "GGN-CYB", tierLabel: "Corporate", manager: "Arjun M.", netSalesLakh: 26.7, orders: 8342, ordersDeltaPct: -1.8, aovInr: 320, aovDeltaPct: -0.6, makeTime: "6:12", makeTimeTarget: "1:42 · target 4:30", makeTimeAlert: true, rating: 4.2, deltaAugPct: -2.4, hourlySales: [18, 44, 72, 68, 52, 46, 40, 38, 42, 48, 52, 46, 38, 30, 22, 14], topProducts: [{ name: "Salted Cream Cold Brew", sold: 2300, sharePct: 17.5, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1850, sharePct: 14.1, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1120, sharePct: 8.6, tone: "matcha" }] },
  { rank: 6, id: "hsr", name: "HSR Layout", city: "Bengaluru", code: "BLR-HSR", tierLabel: "Neighborhood", manager: "Divya N.", netSalesLakh: 24.1, orders: 7846, ordersDeltaPct: 6.0, aovInr: 307, aovDeltaPct: 1.1, makeTime: "4:39", makeTimeTarget: "0:09 · target 4:30", makeTimeAlert: false, rating: 4.5, deltaAugPct: 7.2, hourlySales: [26, 56, 74, 62, 46, 40, 38, 36, 42, 48, 54, 50, 44, 38, 28, 16], topProducts: [{ name: "Salted Cream Cold Brew", sold: 2120, sharePct: 18.1, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1740, sharePct: 14.9, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1290, sharePct: 11.0, tone: "matcha" }] },
  { rank: 7, id: "wfd", name: "Whitefield", city: "Bengaluru", code: "BLR-WFD", tierLabel: "Tech Park", manager: "Pooja S.", netSalesLakh: 22.5, orders: 7446, ordersDeltaPct: 4.8, aovInr: 302, aovDeltaPct: 0.7, makeTime: "4:57", makeTimeTarget: "0:27 · target 4:30", makeTimeAlert: false, rating: 4.4, deltaAugPct: 5.5, hourlySales: [18, 46, 72, 64, 48, 42, 38, 36, 40, 44, 46, 40, 32, 26, 18, 10], topProducts: [{ name: "Salted Cream Cold Brew", sold: 1980, sharePct: 17.8, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1620, sharePct: 14.5, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1150, sharePct: 10.3, tone: "matcha" }] },
  { rank: 8, id: "mgr", name: "MG Road", city: "Bengaluru", code: "BLR-MGR", tierLabel: "High-street", manager: "Rohan D.", netSalesLakh: 22.0, orders: 6982, ordersDeltaPct: 3.2, aovInr: 315, aovDeltaPct: 0.8, makeTime: "5:01", makeTimeTarget: "0:31 · target 4:30", makeTimeAlert: false, rating: 4.4, deltaAugPct: 3.9, hourlySales: [20, 44, 68, 60, 46, 42, 38, 36, 42, 46, 50, 46, 40, 34, 24, 14], topProducts: [{ name: "Salted Cream Cold Brew", sold: 1890, sharePct: 18.0, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1520, sharePct: 14.4, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1080, sharePct: 10.2, tone: "matcha" }] },
  { rank: 9, id: "pow", name: "Powai", city: "Mumbai", code: "BOM-POW", tierLabel: "Neighborhood", manager: "Imran S.", netSalesLakh: 21.5, orders: 6635, ordersDeltaPct: 5.0, aovInr: 324, aovDeltaPct: 1.0, makeTime: "4:49", makeTimeTarget: "0:19 · target 4:30", makeTimeAlert: false, rating: 4.5, deltaAugPct: 6.1, hourlySales: [22, 48, 70, 62, 46, 40, 38, 36, 40, 46, 50, 46, 40, 34, 24, 14], topProducts: [{ name: "Salted Cream Cold Brew", sold: 1810, sharePct: 18.2, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1450, sharePct: 14.6, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 1050, sharePct: 10.5, tone: "matcha" }] },
  { rank: 10, id: "cnp", name: "Connaught Place", city: "Delhi", code: "DEL-CNP", tierLabel: "High-street", manager: "Neha G.", netSalesLakh: 20.1, orders: 6481, ordersDeltaPct: 1.4, aovInr: 310, aovDeltaPct: 0.4, makeTime: "5:18", makeTimeTarget: "0:48 · target 4:30", makeTimeAlert: false, rating: 4.3, deltaAugPct: 1.8, hourlySales: [16, 38, 60, 56, 42, 38, 36, 34, 38, 44, 48, 44, 38, 32, 24, 14], topProducts: [{ name: "Salted Cream Cold Brew", sold: 1710, sharePct: 17.6, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1380, sharePct: 14.2, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 980, sharePct: 10.1, tone: "matcha" }] },
  { rank: 11, id: "jay", name: "Jayanagar", city: "Bengaluru", code: "BLR-JAY", tierLabel: "Neighborhood", manager: "Ananya R.", netSalesLakh: 18.5, orders: 6245, ordersDeltaPct: 3.8, aovInr: 296, aovDeltaPct: 0.6, makeTime: "4:45", makeTimeTarget: "0:15 · target 4:30", makeTimeAlert: false, rating: 4.5, deltaAugPct: 4.4, hourlySales: [22, 46, 66, 56, 42, 36, 34, 32, 36, 42, 46, 42, 36, 30, 22, 12], topProducts: [{ name: "Salted Cream Cold Brew", sold: 1620, sharePct: 17.4, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1340, sharePct: 14.4, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 920, sharePct: 9.9, tone: "matcha" }] },
  { rank: 12, id: "hks", name: "Hauz Khas", city: "Delhi", code: "DEL-HKS", tierLabel: "Neighborhood", manager: "Kabir M.", netSalesLakh: 17.3, orders: 5782, ordersDeltaPct: -3.2, aovInr: 299, aovDeltaPct: -1.4, makeTime: "5:34", makeTimeTarget: "1:04 · target 4:30", makeTimeAlert: true, rating: 4.1, deltaAugPct: -4.6, hourlySales: [14, 34, 54, 50, 38, 34, 32, 30, 34, 40, 44, 40, 34, 28, 20, 12], topProducts: [{ name: "Salted Cream Cold Brew", sold: 1480, sharePct: 17.1, tone: "coffee" }, { name: "Cà Phê Sữa Đá", sold: 1220, sharePct: 14.1, tone: "coffee" }, { name: "Iced Matcha Latte", sold: 840, sharePct: 9.7, tone: "matcha" }] },
];

export const DRINK_MIX_TILES: DrinkMixTile[] = [
  { id: "dm-1", name: "Salted Cream Cold Brew", subtitle: "#1 · 25,190 sold", sharePct: 18.2, category: "Vietnamese" },
  { id: "dm-2", name: "Cà Phê Sữa Đá", sharePct: 14.6, category: "Vietnamese" },
  { id: "dm-3", name: "Iced Matcha Latte", sharePct: 12.8, category: "Matcha" },
  { id: "dm-4", name: "Bạc Xỉu", sharePct: 11.4, category: "Vietnamese" },
  { id: "dm-5", name: "Coconut Coffee", sharePct: 10.1, category: "Vietnamese" },
  { id: "dm-6", name: "Egg Coffee", sharePct: 8.3, category: "Vietnamese" },
  { id: "dm-7", name: "Phin Đen", sharePct: 7.2, category: "Vietnamese" },
  { id: "dm-8", name: "Yuzu Matcha Tonic · LAB", sharePct: 6.1, category: "LAB" },
  { id: "dm-9", name: "6 others", sharePct: 11.3, category: "Other" },
];

export const ADDON_ATTACH_RATES: AddonAttachRow[] = [
  { name: "Oat milk +₹50", revenueLabel: "₹23.5 L", attachPct: 34, note: "▲ 4 pts vs Aug · low stock at 4 stores", noteTone: "warning" },
  { name: "2+ shots · +₹60 per extra shot", revenueLabel: "₹18.3 L", attachPct: 22, note: "▲ 1 pt · highest with Phin Đen (31%)", noteTone: "muted" },
  { name: "Salted cream foam +₹45", revenueLabel: "₹9.3 L", attachPct: 15, note: "Mostly on Cà Phê Sữa Đá", noteTone: "muted" },
  { name: "Vanilla syrup +₹30", revenueLabel: "₹3.7 L", attachPct: 9, note: "Out at Indiranagar since 9:12 today", noteTone: "error" },
];

export const MODIFIER_CHOICE_ROWS: ModifierChoiceRow[] = [
  {
    group: "Size",
    segments: [
      { label: "Regular 52%", pct: 52, colorClass: "bg-primary" },
      { label: "Large 41%", pct: 41, colorClass: "bg-accent" },
      { label: "", pct: 7, colorClass: "bg-category-coffee" },
    ],
    trailingLabel: "Jumbo 7%",
  },
  {
    group: "Milk",
    segments: [
      { label: "Condensed 49%", pct: 49, colorClass: "bg-primary" },
      { label: "Oat 34%", pct: 34, colorClass: "bg-accent" },
      { label: "", pct: 11, colorClass: "bg-category-coffee" },
      { label: "", pct: 6, colorClass: "bg-category-matcha" },
    ],
    trailingLabel: "Coco 11 · Alm 6",
  },
  {
    group: "Sweetness",
    segments: [
      { label: "Regular 58%", pct: 58, colorClass: "bg-primary" },
      { label: "Less 31%", pct: 31, colorClass: "bg-accent" },
      { label: "", pct: 6, colorClass: "bg-category-coffee" },
      { label: "", pct: 5, colorClass: "bg-category-matcha" },
    ],
    trailingLabel: "Extra 6 · None 5",
  },
  {
    group: "Ice",
    segments: [
      { label: "Regular 71%", pct: 71, colorClass: "bg-primary" },
      { label: "Less 24%", pct: 24, colorClass: "bg-accent" },
      { label: "", pct: 5, colorClass: "bg-category-coffee" },
    ],
    trailingLabel: "No ice 5%",
  },
];

export const TOP_5_TREND_PRODUCTS: TopTrendProduct[] = [
  { name: "Salted Cream Cold Brew", sold: 25190, deltaPct: 8, weeklyPoints: [5800, 6100, 6450, 6840] },
  { name: "Cà Phê Sữa Đá", sold: 20206, deltaPct: 2, weeklyPoints: [5100, 4800, 5200, 5106] },
  { name: "Iced Matcha Latte", sold: 17715, deltaPct: 31, weeklyPoints: [3400, 3900, 4600, 5815] },
  { name: "Bạc Xỉu", sold: 15778, deltaPct: -3, weeklyPoints: [4200, 4050, 3850, 3678] },
  { name: "Coconut Coffee", sold: 13978, deltaPct: 5, weeklyPoints: [3300, 3550, 3420, 3708] },
];

export const WEEKLY_CUSTOMER_ORDERS: WeeklyCustomerOrders[] = [
  { week: "1–6", returningK: 11.8, newK: 7.0, totalK: 18.8 },
  { week: "7–13", returningK: 13.9, newK: 8.1, totalK: 22.0 },
  { week: "14–20", returningK: 14.0, newK: 8.3, totalK: 22.3 },
  { week: "21–27", returningK: 14.6, newK: 8.5, totalK: 23.1 },
  { week: "28–30", returningK: 5.5, newK: 3.3, totalK: 8.8 },
];

export const ORDER_FREQUENCY_BINS: OrderFrequencyBin[] = [
  { label: "1", pct: 41, isRegular: false },
  { label: "2", pct: 22, isRegular: false },
  { label: "3", pct: 12, isRegular: false },
  { label: "4–5", pct: 11, isRegular: true },
  { label: "6–9", pct: 8, isRegular: true },
  { label: "10+", pct: 6, isRegular: true },
];

export const LTV_CHANNELS: LtvChannelRow[] = [
  { channel: "Corporate tie-ups", ltvInr: 5210, cacInr: 420, ratioLabel: "12.4×", barPct: 100, tone: "primary" },
  { channel: "App referral", ltvInr: 4820, cacInr: 180, ratioLabel: "26.8×", barPct: 92, tone: "primary" },
  { channel: "Walk-in → app signup", ltvInr: 3960, cacInr: 120, ratioLabel: "33.0×", barPct: 76, tone: "primary" },
  { channel: "Instagram ads", ltvInr: 2640, cacInr: 310, ratioLabel: "8.5×", barPct: 51, tone: "coffee" },
  { channel: "Swiggy / Zomato", ltvInr: 1480, cacInr: null, ratioLabel: "—", barPct: 28, tone: "coffee" },
];

export const RFM_SEGMENTS: RfmSegmentCell[] = [
  { id: "champions", title: "Champions", pct: 9, customers: 16578, tone: "success", detailHeadline: "Champions · 16,578 customers", detailSpendLabel: "₹4.8 Cr past spend", detailDescription: "Order 6+ times a month with high AOV. Ideal for Bruvi Lab early access and Club tier upsells." },
  { id: "loyal", title: "Loyal", pct: 9, customers: 16578, tone: "success", detailHeadline: "Loyal · 16,578 customers", detailSpendLabel: "₹3.1 Cr past spend", detailDescription: "Consistent 3–5 monthly orders. Reward with double loyalty points on weekday afternoons." },
  { id: "at-risk", title: "At risk", pct: 7, customers: 12894, tone: "warning", detailHeadline: "At risk · 12,894 customers", detailSpendLabel: "₹1.9 Cr past spend", detailDescription: "Used to order 5+ times a month; last order 21–45 days ago. Win them back before they lapse." },
  { id: "potential", title: "Potential", pct: 10, customers: 18420, tone: "info", detailHeadline: "Potential · 18,420 customers", detailSpendLabel: "₹1.4 Cr past spend", detailDescription: "Recent repeat buyers (2–3 orders). Nudge toward Club trial or oat-milk combo." },
  { id: "need-attention", title: "Need attention", pct: 5, customers: 9210, tone: "info", detailHeadline: "Need attention · 9,210 customers", detailSpendLabel: "₹84 L past spend", detailDescription: "Mid-frequency buyers slowing down over the last 3 weeks." },
  { id: "about-to-sleep", title: "About to sleep", pct: 6, customers: 11052, tone: "muted", detailHeadline: "About to sleep · 11,052 customers", detailSpendLabel: "₹72 L past spend", detailDescription: "Haven't ordered in 30+ days; trigger automated push + ₹50 off comeback coupon." },
  { id: "new", title: "New", pct: 21, customers: 38682, tone: "info", detailHeadline: "New · 38,682 customers", detailSpendLabel: "₹1.2 Cr past spend", detailDescription: "First order in the last 30 days. Free extra shot on 2nd order lifts M1 retention to 52%." },
  { id: "hibernating", title: "Hibernating", pct: 6, customers: 11052, tone: "muted", detailHeadline: "Hibernating · 11,052 customers", detailSpendLabel: "₹58 L past spend", detailDescription: "Low frequency, 45+ days since last order." },
  { id: "lapsed", title: "Lapsed", pct: 27, customers: 49734, tone: "error", detailHeadline: "Lapsed · 49,734 customers", detailSpendLabel: "₹2.1 Cr past spend", detailDescription: "No activity in 60+ days. Include only in seasonal Monsoon/Festive win-back campaigns." },
];

export const COHORT_RETENTION_ROWS: CohortRetentionRow[] = [
  { cohort: "Mar 2026", customers: 12640, months: [100, 48, 39, 34, 31, 29, 28] },
  { cohort: "Apr 2026", customers: 13210, months: [100, 47, 38, 33, 30, 29, null] },
  { cohort: "May 2026", customers: 13980, months: [100, 49, 40, 35, 32, null, null] },
  { cohort: "Jun 2026", customers: 12870, months: [100, 46, 37, 33, null, null, null] },
  { cohort: "Jul 2026", customers: 14110, months: [100, 50, 41, null, null, null, null] },
  { cohort: "Aug 2026", customers: 14320, months: [100, 52, null, null, null, null, null] },
  { cohort: "Sep 2026", customers: 14820, months: [100, null, null, null, null, null, null] },
];

export const RETENTION_CURVE_POINTS: RetentionCurvePoint[] = [
  { month: "M1", mar: 48, jun: 46, aug: 52 },
  { month: "M2", mar: 39, jun: 37, aug: null },
  { month: "M3", mar: 34, jun: 33, aug: null },
  { month: "M4", mar: 31, jun: null, aug: null },
  { month: "M5", mar: 29, jun: null, aug: null },
  { month: "M6", mar: 28, jun: null, aug: null },
];

export const PRODUCT_CONTRIBUTION_ROWS: ProductContributionRow[] = [
  { id: "p-1", shortName: "Salted Cream", name: "Salted Cream Cold Brew", priceInr: 240, foodCostInr: 43.3, cmPct: 82.0, units: 25190, mixSharePct: 18.2, totalCmLakh: 49.5, classification: "Star", tone: "coffee" },
  { id: "p-2", shortName: "Cà Phê Sữa Đá", name: "Cà Phê Sữa Đá", priceInr: 190, foodCostInr: 39.7, cmPct: 79.1, units: 20206, mixSharePct: 14.6, totalCmLakh: 30.4, classification: "Star", tone: "coffee" },
  { id: "p-3", shortName: "Matcha Latte", name: "Iced Matcha Latte", priceInr: 260, foodCostInr: 68.4, cmPct: 73.7, units: 17715, mixSharePct: 12.8, totalCmLakh: 33.9, classification: "Plowhorse", tone: "matcha" },
  { id: "p-4", shortName: "Bạc Xỉu", name: "Bạc Xỉu", priceInr: 210, foodCostInr: 41.8, cmPct: 80.1, units: 15778, mixSharePct: 11.4, totalCmLakh: 26.5, classification: "Star", tone: "coffee" },
  { id: "p-5", shortName: "Coconut", name: "Coconut Coffee", priceInr: 230, foodCostInr: 49.5, cmPct: 78.5, units: 13978, mixSharePct: 10.1, totalCmLakh: 25.2, classification: "Plowhorse", tone: "coffee" },
  { id: "p-6", shortName: "Egg Coffee", name: "Egg Coffee", priceInr: 250, foodCostInr: 56.3, cmPct: 77.5, units: 11487, mixSharePct: 8.3, totalCmLakh: 22.3, classification: "Dog", tone: "coffee" },
  { id: "p-7", shortName: "Phin Đen", name: "Phin Đen", priceInr: 170, foodCostInr: 28.9, cmPct: 83.0, units: 9965, mixSharePct: 7.2, totalCmLakh: 14.1, classification: "Puzzle", tone: "coffee" },
  { id: "p-8", shortName: "Bánh Mì", name: "Bánh Mì Paneer", priceInr: 220, foodCostInr: 74.8, cmPct: 66.0, units: 6400, mixSharePct: 4.6, totalCmLakh: 9.3, classification: "Dog", tone: "food" },
];

export const STORE_PROFITABILITY_ROWS: StoreProfitabilityRow[] = [
  { id: "ind", storeName: "Indiranagar", revenueLakh: 35.3, cogsPct: 28, labourPct: 19, rentPct: 20, otherPct: 12, ebitdaLakh: 7.41, ebitdaPct: 21 },
  { id: "kor", storeName: "Koramangala", revenueLakh: 33.4, cogsPct: 29, labourPct: 22, rentPct: 19, otherPct: 11, ebitdaLakh: 6.35, ebitdaPct: 19 },
  { id: "ban", storeName: "Bandra", revenueLakh: 32.3, cogsPct: 29, labourPct: 21, rentPct: 22, otherPct: 11, ebitdaLakh: 5.49, ebitdaPct: 17 },
  { id: "hsr", storeName: "HSR Layout", revenueLakh: 24.1, cogsPct: 28, labourPct: 28, rentPct: 17, otherPct: 11, ebitdaLakh: 3.86, ebitdaPct: 16 },
  { id: "lpl", storeName: "Lower Parel", revenueLakh: 28.3, cogsPct: 29, labourPct: 22, rentPct: 23, otherPct: 11, ebitdaLakh: 4.25, ebitdaPct: 15 },
  { id: "pow", storeName: "Powai", revenueLakh: 21.5, cogsPct: 29, labourPct: 27, rentPct: 19, otherPct: 11, ebitdaLakh: 3.01, ebitdaPct: 14 },
  { id: "jay", storeName: "Jayanagar", revenueLakh: 18.5, cogsPct: 28, labourPct: 31, rentPct: 16, otherPct: 11, ebitdaLakh: 2.59, ebitdaPct: 14 },
  { id: "wfd", storeName: "Whitefield", revenueLakh: 22.5, cogsPct: 29, labourPct: 29, rentPct: 18, otherPct: 11, ebitdaLakh: 2.92, ebitdaPct: 13 },
  { id: "mgr", storeName: "MG Road", revenueLakh: 22.0, cogsPct: 30, labourPct: 26, rentPct: 21, otherPct: 11, ebitdaLakh: 2.64, ebitdaPct: 12 },
  { id: "cyb", storeName: "Cyber Hub", revenueLakh: 26.7, cogsPct: 30, labourPct: 24, rentPct: 24, otherPct: 11, ebitdaLakh: 2.94, ebitdaPct: 11 },
  { id: "cnp", storeName: "Connaught Place", revenueLakh: 20.1, cogsPct: 30, labourPct: 26, rentPct: 24, otherPct: 11, ebitdaLakh: 1.81, ebitdaPct: 9 },
  { id: "hks", storeName: "Hauz Khas", revenueLakh: 17.3, cogsPct: 31, labourPct: 28, rentPct: 24, otherPct: 11, ebitdaLakh: 1.04, ebitdaPct: 6 },
];
