import {
  FinanceAttentionItem,
  PaymentAttemptRow,
  PaymentMixItem,
  ReconciliationProviderRow,
  RefundApprovalItem,
  RefundRow,
  SacSummaryRow,
  StateGstSummaryRow,
  StoreSettlementRow,
  VarianceTraceItem,
} from "@/types/finance";

export const PAYMENT_MIX_TODAY: PaymentMixItem[] = [
  { label: "UPI", percent: 61, amountInr: 255346, colorClass: "bg-primary" },
  { label: "Card", percent: 22, amountInr: 92092, colorClass: "bg-accent" },
  { label: "Cash", percent: 9, amountInr: 37674, colorClass: "bg-category-coffee" },
  { label: "BRUVI Wallet", percent: 6, amountInr: 25116, colorClass: "bg-category-matcha" },
  { label: "Other · meal cards", percent: 2, amountInr: 8372, colorClass: "bg-border-input" },
];

export const FINANCE_ATTENTION_ITEMS: FinanceAttentionItem[] = [
  {
    id: "att-1",
    title: "₹450 reconciliation variance · Thu 1 Oct",
    subtitle: "Settled ₹10,71,900 vs expected ₹10,72,350 · 2 UPI refunds pending",
    actionLabel: "Reconcile",
    actionHref: "/finance/reconciliation",
    dotTone: "error",
  },
  {
    id: "att-2",
    title: "2 refunds over ₹2,000 awaiting approval",
    subtitle: "Lower Parel ₹2,940 · Bandra ₹2,310",
    actionLabel: "Review",
    actionHref: "/finance/refunds",
    dotTone: "warning",
  },
  {
    id: "att-3",
    title: "Cyber Hub cash drawer variance −₹120",
    subtitle: "Thu 1 Oct close · counted ₹8,493 vs expected ₹8,613",
    actionLabel: "View shift",
    actionHref: "/finance/settlements",
    dotTone: "warning",
  },
  {
    id: "att-4",
    title: "GSTR-1 for September due Sun 11 Oct",
    subtitle: "4 state GSTINs · GST collected ₹15.1 L",
    actionLabel: "Prepare",
    actionHref: "/finance/tax",
    dotTone: "primary",
  },
];

export const PAYMENT_ATTEMPTS: PaymentAttemptRow[] = [
  {
    time: "9:41 am",
    paymentId: "pay_Q7hT2kLm91",
    orderNumber: "A-047",
    store: "Indiranagar",
    methodTitle: "UPI · App",
    methodDetail: "Ref 4290 7712 0034",
    methodType: "UPI",
    amountInr: 966.0,
    feeInr: 9.66,
    status: "Captured",
    gateway: "Razorpay",
  },
  {
    time: "9:39 am",
    paymentId: "PL-88213407",
    orderNumber: "C-221",
    store: "Koramangala",
    methodTitle: "Card · Counter",
    methodDetail: "Visa ···· 4417",
    methodType: "Card",
    amountInr: 480.0,
    feeInr: 8.21,
    status: "Captured",
    gateway: "Pine Labs",
  },
  {
    time: "9:38 am",
    paymentId: "pay_Q7hR4cXe07",
    orderNumber: "A-1182",
    store: "Bandra",
    methodTitle: "UPI · App",
    methodDetail: "Bank declined (U30)",
    methodType: "UPI",
    amountInr: 598.5,
    feeInr: null,
    status: "Failed",
    gateway: "Razorpay",
  },
  {
    time: "9:36 am",
    paymentId: "pay_Q7hQ8mWz33",
    orderNumber: "C-218",
    store: "Indiranagar",
    methodTitle: "UPI · Counter QR",
    methodDetail: "Ref 4291 0083 7716",
    methodType: "UPI",
    amountInr: 725.0,
    feeInr: 7.25,
    status: "Captured",
    gateway: "Razorpay",
  },
  {
    time: "9:31 am",
    paymentId: "pay_Q7hN1aPq18",
    orderNumber: "C-205",
    store: "Indiranagar",
    methodTitle: "UPI · Counter QR",
    methodDetail: "RF-30418 · ₹241.50",
    methodType: "UPI",
    amountInr: 241.5,
    feeInr: 2.42,
    status: "Refunded",
    gateway: "Razorpay",
  },
  {
    time: "9:29 am",
    paymentId: "wlt_0088412",
    orderNumber: "A-044",
    store: "Hauz Khas",
    methodTitle: "Wallet · App",
    methodDetail: "Internal ledger",
    methodType: "Wallet",
    amountInr: 451.5,
    feeInr: 0,
    status: "Captured",
    gateway: "BRUVI Wallet",
  },
];

export const REFUNDS_TODAY: RefundRow[] = [
  { id: "RF-30419", orderNumber: "C-216", store: "Indiranagar", reason: "cancelled", amountInr: 409.5, destination: "UPI", status: "Initiated", approver: "Meera K.", slaTop: "Instant", slaBottom: "within 30 min", slaTone: "normal" },
  { id: "RF-30418", orderNumber: "C-205", store: "Indiranagar", reason: "wrong item", amountInr: 241.5, destination: "UPI", status: "Processed", approver: "Meera K.", slaTop: "Instant", slaBottom: "Met · 4 min", slaTone: "success" },
  { id: "RF-30417", orderNumber: "A-031", store: "Koramangala", reason: "app cancel", amountInr: 252.0, destination: "UPI", status: "Processed", approver: "Auto-rule", slaTop: "Instant", slaBottom: "Met · 1 min", slaTone: "success" },
  { id: "RF-30416", orderNumber: "K098", store: "Bandra", reason: "wrong milk", amountInr: 283.5, destination: "Card", status: "Initiated", approver: "Sana Q.", slaTop: "5–7 days", slaBottom: "by Fri 9 Oct", slaTone: "normal" },
  { id: "RF-30415", orderNumber: "C-188", store: "Cyber Hub", reason: "VPA closed", amountInr: 199.5, destination: "UPI", status: "Failed", approver: "Vikram D.", slaTop: "Retry 10:15", slaBottom: "or to wallet", slaTone: "error" },
  { id: "RF-30414", orderNumber: "A-022", store: "HSR Layout", reason: "sold out", amountInr: 525.0, destination: "Wallet", status: "Processed", approver: "Auto-rule", slaTop: "Instant", slaBottom: "Met · 1 min", slaTone: "success" },
  { id: "RF-30413", orderNumber: "C-171", store: "Lower Parel", reason: "spilled", amountInr: 262.5, destination: "Card", status: "Initiated", approver: "Rhea P.", slaTop: "5–7 days", slaBottom: "by Fri 9 Oct", slaTone: "normal" },
  { id: "RF-30412", orderNumber: "Q-12", store: "Hauz Khas", reason: "duplicate", amountInr: 231.0, destination: "UPI", status: "Processed", approver: "Kabir S.", slaTop: "Instant", slaBottom: "Met · 6 min", slaTone: "success" },
];

export const INITIAL_REFUND_APPROVALS: RefundApprovalItem[] = [
  {
    id: "RQ-0092",
    store: "Lower Parel",
    subtitle: "Catering INV-B2B-0412 · 12 drinks short",
    requesterMeta: "Rhea P. · 9:12 am · due 1:12 pm",
    amountInr: 2940,
  },
  {
    id: "RQ-0093",
    store: "Bandra",
    subtitle: "A-1176 · duplicate UPI charge",
    requesterMeta: "Support · 9:25 am · due 1:25 pm",
    amountInr: 2310,
  },
];

export const RECONCILIATION_PROVIDERS: ReconciliationProviderRow[] = [
  { id: "rp-upi", provider: "Razorpay · UPI", subtitle: "T+1 · UTR …4471 · 9:05 am", netSalesInr: 661362, feesAdjInr: 6600, expectedInr: 654762, settledInr: 654312, varianceInr: -450, statusLabel: "2 unmatched", isUnmatched: true },
  { id: "rp-card", provider: "Razorpay · Cards", subtitle: "T+1 · app & kiosk", netSalesInr: 98410, feesAdjInr: 1968, expectedInr: 96442, settledInr: 96442, varianceInr: 0, statusLabel: "Matched", isUnmatched: false },
  { id: "pl-card", provider: "Pine Labs · Cards", subtitle: "T+1 · counter terminals", netSalesInr: 140114, feesAdjInr: 2402, expectedInr: 137712, settledInr: 137712, varianceInr: 0, statusLabel: "Matched", isUnmatched: false },
  { id: "cash", provider: "Cash deposits", subtitle: "12 stores · HDFC · adj. −₹120", netSalesInr: 97578, feesAdjInr: 120, expectedInr: 97458, settledInr: 97458, varianceInr: 0, statusLabel: "Matched", isUnmatched: false },
  { id: "wallet", provider: "BRUVI Wallet", subtitle: "Internal ledger", netSalesInr: 65052, feesAdjInr: 0, expectedInr: 65052, settledInr: 65052, varianceInr: 0, statusLabel: "Matched", isUnmatched: false },
  { id: "meal", provider: "Meal cards", subtitle: "Pluxee · T+1", netSalesInr: 21684, feesAdjInr: 760, expectedInr: 20924, settledInr: 20924, varianceInr: 0, statusLabel: "Matched", isUnmatched: false },
];

export const VARIANCE_TRACES: VarianceTraceItem[] = [
  {
    id: "RF-30392",
    store: "Koramangala",
    amountInr: 210,
    orderRef: "Order A-1043 · rfnd_Q6zK1tMw20 · 1 Oct 8:52 pm",
    ledgerStatusLabel: "Ledger: Initiated · gateway: Processed",
  },
  {
    id: "RF-30397",
    store: "Bandra",
    amountInr: 240,
    orderRef: "Order C-0911 · rfnd_Q6zP8bVc57 · 1 Oct 10:14 pm",
    ledgerStatusLabel: "Ledger: Initiated · gateway: Processed",
  },
];

export const STORE_SETTLEMENTS: StoreSettlementRow[] = [
  {
    id: "ind",
    storeName: "Indiranagar",
    storeCode: "BLR-IND",
    city: "Bengaluru",
    shiftsLabel: "2 shifts",
    grossInr: 134020,
    discountsInr: 5910,
    refundsInr: 1400,
    netInr: 126710,
    cashExpectedInr: 11405,
    cashCountedInr: 11405,
    cardUpiInr: 103887,
    varianceInr: 0,
    statusLabel: "Balanced",
    shifts: [
      { shiftName: "Morning · 6:30 am–3 pm", closedBy: "Rohan M.", device: "POS-IND-01", expectedInr: 6140, countedInr: 6140, varianceInr: 0, note: "Closed 3:08 pm · verified Meera K." },
      { shiftName: "Evening · 3–11 pm", closedBy: "Priya R.", device: "POS-IND-02", expectedInr: 5265, countedInr: 5265, varianceInr: 0, note: "Closed 11:24 pm · deposited HDFC" },
    ],
  },
  { id: "kor", storeName: "Koramangala", storeCode: "BLR-KOR", city: "Bengaluru", grossInr: 126870, discountsInr: 5600, refundsInr: 1320, netInr: 119950, cashExpectedInr: 10796, cashCountedInr: 10796, cardUpiInr: 98135, varianceInr: -210, statusLabel: "UPI refund" },
  { id: "ban", storeName: "Bandra", storeCode: "BOM-BAN", city: "Mumbai", grossInr: 122670, discountsInr: 5410, refundsInr: 1280, netInr: 115980, cashExpectedInr: 10438, cashCountedInr: 10438, cardUpiInr: 94850, varianceInr: -240, statusLabel: "UPI refund" },
  { id: "lpl", storeName: "Lower Parel", storeCode: "BOM-LPL", city: "Mumbai", grossInr: 107490, discountsInr: 4740, refundsInr: 1120, netInr: 101630, cashExpectedInr: 9147, cashCountedInr: 9147, cardUpiInr: 83325, varianceInr: 0, statusLabel: "Balanced" },
  { id: "cyb", storeName: "Cyber Hub", storeCode: "GGN-CYB", city: "NCR", grossInr: 101220, discountsInr: 4470, refundsInr: 1050, netInr: 95700, cashExpectedInr: 8613, cashCountedInr: 8493, cardUpiInr: 78463, varianceInr: -120, statusLabel: "Cash short" },
  { id: "hsr", storeName: "HSR Layout", storeCode: "BLR-HSR", city: "Bengaluru", grossInr: 91500, discountsInr: 4040, refundsInr: 950, netInr: 86510, cashExpectedInr: 7786, cashCountedInr: 7786, cardUpiInr: 70928, varianceInr: 0, statusLabel: "Balanced" },
  { id: "wfd", storeName: "Whitefield", storeCode: "BLR-WFD", city: "Bengaluru", grossInr: 85420, discountsInr: 3770, refundsInr: 890, netInr: 80760, cashExpectedInr: 7268, cashCountedInr: 7268, cardUpiInr: 66214, varianceInr: 0, statusLabel: "Balanced" },
  { id: "mgr", storeName: "MG Road", storeCode: "BLR-MGR", city: "Bengaluru", grossInr: 83440, discountsInr: 3680, refundsInr: 870, netInr: 78890, cashExpectedInr: 7100, cashCountedInr: 7100, cardUpiInr: 64680, varianceInr: 0, statusLabel: "Balanced" },
  { id: "pow", storeName: "Powai", storeCode: "BOM-POW", city: "Mumbai", grossInr: 81630, discountsInr: 3600, refundsInr: 850, netInr: 77180, cashExpectedInr: 6946, cashCountedInr: 6946, cardUpiInr: 63278, varianceInr: 0, statusLabel: "Balanced" },
  { id: "cnp", storeName: "Connaught Place", storeCode: "DEL-CNP", city: "NCR", grossInr: 76550, discountsInr: 3380, refundsInr: 800, netInr: 72370, cashExpectedInr: 6513, cashCountedInr: 6513, cardUpiInr: 59335, varianceInr: 0, statusLabel: "Balanced" },
  { id: "jay", storeName: "Jayanagar", storeCode: "BLR-JAY", city: "Bengaluru", grossInr: 70190, discountsInr: 3100, refundsInr: 730, netInr: 66360, cashExpectedInr: 5972, cashCountedInr: 5972, cardUpiInr: 54407, varianceInr: 0, statusLabel: "Balanced" },
  { id: "hks", storeName: "Hauz Khas", storeCode: "DEL-HKS", city: "NCR", grossInr: 65740, discountsInr: 2900, refundsInr: 680, netInr: 62160, cashExpectedInr: 5594, cashCountedInr: 5594, cardUpiInr: 50964, varianceInr: 0, statusLabel: "Balanced" },
];

export const STATE_GST_ROWS: StateGstSummaryRow[] = [
  { state: "Karnataka", storesCountLabel: "6 stores", gstin: "29ABCDE1234F1Z5", taxableValueInr: 15575000, cgstInr: 389375, sgstInr: 389375, totalGstInr: 778750 },
  { state: "Maharashtra", storesCountLabel: "3 stores", gstin: "27ABCDE1234F1Z9", taxableValueInr: 8212000, cgstInr: 205300, sgstInr: 205300, totalGstInr: 410600 },
  { state: "Delhi", storesCountLabel: "2 stores", gstin: "07ABCDE1234F1Z3", taxableValueInr: 3747000, cgstInr: 93675, sgstInr: 93675, totalGstInr: 187350 },
  { state: "Haryana", storesCountLabel: "1 store", gstin: "06ABCDE1234F1Z1", taxableValueInr: 2666000, cgstInr: 66650, sgstInr: 66650, totalGstInr: 133300 },
];

export const SAC_SUMMARY_ROWS: SacSummaryRow[] = [
  { sac: "996331", description: "Café & restaurant service", type: "B2C", qty: 120962, taxableValueInr: 29714000, gst5Inr: 1485700 },
  { sac: "996331", description: "Corporate catering", type: "B2B", qty: 38, taxableValueInr: 486000, gst5Inr: 24300 },
];
