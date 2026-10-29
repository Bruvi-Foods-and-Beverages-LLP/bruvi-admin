import React from "react";
import { BruviIcon } from "./bruvi-icon";
import { BruviIconProps } from "./types";

type DirectIconProps = Omit<BruviIconProps, "name">;

export const PhinIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="phin" categoryColor {...props} />
));
PhinIcon.displayName = "PhinIcon";

export const BeanIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="bean" categoryColor {...props} />
));
BeanIcon.displayName = "BeanIcon";

export const CoffeeIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="coffee" categoryColor {...props} />
));
CoffeeIcon.displayName = "CoffeeIcon";

export const LeafIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="leaf" categoryColor {...props} />
));
LeafIcon.displayName = "LeafIcon";

export const StoreIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="store" {...props} />
));
StoreIcon.displayName = "StoreIcon";

export const WarehouseIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="warehouse" {...props} />
));
WarehouseIcon.displayName = "WarehouseIcon";

export const CartIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="cart" {...props} />
));
CartIcon.displayName = "CartIcon";

export const ReceiptIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="receipt" {...props} />
));
ReceiptIcon.displayName = "ReceiptIcon";

export const WalletIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="wallet" {...props} />
));
WalletIcon.displayName = "WalletIcon";

export const ScanQrIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="scan-qr" {...props} />
));
ScanQrIcon.displayName = "ScanQrIcon";

export const TimerIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="timer" {...props} />
));
TimerIcon.displayName = "TimerIcon";

export const ShieldCheckIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="shield-check" size={20} {...props} />
));
ShieldCheckIcon.displayName = "ShieldCheckIcon";

export const GoogleWorkspaceIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="google-workspace" size={20} {...props} />
));
GoogleWorkspaceIcon.displayName = "GoogleWorkspaceIcon";

export const EyeIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="eye" size={20} {...props} />
));
EyeIcon.displayName = "EyeIcon";

export const EyeOffIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="eye-off" size={20} {...props} />
));
EyeOffIcon.displayName = "EyeOffIcon";

export const CheckIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="check" size={16} {...props} />
));
CheckIcon.displayName = "CheckIcon";

export const LockIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="lock" size={20} {...props} />
));
LockIcon.displayName = "LockIcon";

export const LocationIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="location" size={24} {...props} />
));
LocationIcon.displayName = "LocationIcon";

export const LocationPinIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="location-pin" size={24} {...props} />
));
LocationPinIcon.displayName = "LocationPinIcon";

export const WordmarkIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="wordmark" size={32} {...props} />
));
WordmarkIcon.displayName = "WordmarkIcon";

export const WordmarkTaglineIcon = React.forwardRef<SVGSVGElement, DirectIconProps>((props, ref) => (
  <BruviIcon ref={ref} name="wordmark-tagline" size={48} {...props} />
));
WordmarkTaglineIcon.displayName = "WordmarkTaglineIcon";
