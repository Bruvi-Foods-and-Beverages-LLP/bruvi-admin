import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storesReducer from "./slices/stores-slice";
import citiesReducer from "./slices/cities-slice";
import storeMenuReducer from "./slices/store-menu-slice";
import storeHoursReducer from "./slices/store-hours-slice";
import dashboardReducer from "./slices/dashboard-slice";
import catalogReducer from "./slices/catalog-slice";
import modifierGroupsReducer from "./slices/modifier-groups-slice";
import ordersReducer from "./slices/orders-slice";
import customersReducer from "./slices/customers-slice";
import storeOverridesReducer from "./slices/store-overrides-slice";
import pricingReducer from "./slices/pricing-slice";
import loyaltyReducer from "./slices/loyalty-slice";
import marketingReducer from "./slices/marketing-slice";
import labReducer from "./slices/lab-slice";
import membershipReducer from "./slices/membership-slice";

export const store = configureStore({
  reducer: {
    stores: storesReducer,
    cities: citiesReducer,
    storeMenu: storeMenuReducer,
    storeHours: storeHoursReducer,
    dashboard: dashboardReducer,
    catalog: catalogReducer,
    orders: ordersReducer,
    customers: customersReducer,
    modifierGroups: modifierGroupsReducer,
    storeOverrides: storeOverridesReducer,
    pricing: pricingReducer,
    loyalty: loyaltyReducer,
    marketing: marketingReducer,
    lab: labReducer,
    membership: membershipReducer,
  },
  devTools:
    process.env.NODE_ENV !== "production" ||
    process.env.APP_ENV === "staging" ||
    process.env.NEXT_PUBLIC_APP_ENV === "staging",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


