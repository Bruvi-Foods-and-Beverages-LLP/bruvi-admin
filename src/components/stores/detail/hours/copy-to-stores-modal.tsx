"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCopyModalOpen,
  copyHoursToStores,
} from "@/store/slices/store-hours-slice";
import { fetchStores } from "@/store/slices/stores-slice";
import { cn } from "@/lib/utils/cn";

interface CopyToStoresModalProps {
  currentStoreCode: string;
}

export function CopyToStoresModal({ currentStoreCode }: CopyToStoresModalProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.storeHours.copyModalOpen);
  const stores = useAppSelector((state) => state.stores.stores);

  // Other stores to copy to
  const otherStores = React.useMemo(() => {
    return stores.filter((s) => s.code !== currentStoreCode);
  }, [stores, currentStoreCode]);

  const [selectedCodes, setSelectedCodes] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedCodes(otherStores.map((s) => s.code));
      setSuccessMessage(null);
    }
  }

  React.useEffect(() => {
    if (isOpen && stores.length === 0) {
      dispatch(fetchStores());
    }
  }, [isOpen, stores.length, dispatch]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setCopyModalOpen(false));
  };

  const handleToggleStore = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSelectAll = () => {
    if (selectedCodes.length === otherStores.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(otherStores.map((s) => s.code));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCodes.length === 0) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        copyHoursToStores({
          storeIdOrCode: currentStoreCode,
          targetStoreCodes: selectedCodes,
        })
      ).unwrap();

      setSuccessMessage(
        `Successfully copied hours to ${selectedCodes.length} store${
          selectedCodes.length > 1 ? "s" : ""
        }!`
      );
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch {
      // Error handled by redux
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-[20px] bg-surface p-6 shadow-xl border border-[#dce2ea]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
          <div>
            <h3 className="font-sans text-[18px] font-extrabold text-[#0f2340]">Copy Hours to Other Stores</h3>
            <p className="font-sans text-[12px] font-medium text-[#3f4b5e] mt-0.5">
              Select target stores to copy opening and channel hours.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-text-muted hover:text-text hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {successMessage ? (
            <div className="p-4 rounded-[12px] bg-[#EBF1DE] text-[#566F2C] text-[14px] font-semibold text-center">
              {successMessage}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[13px] font-medium text-[#3f4b5e]">
                  {selectedCodes.length} of {otherStores.length} stores selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="font-sans text-[13px] font-bold text-[#1c3a66] hover:underline cursor-pointer"
                >
                  {selectedCodes.length === otherStores.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              {/* Stores List */}
              <div className="max-h-[240px] overflow-y-auto divide-y divide-[#dce2ea] border border-[#dce2ea] rounded-[12px]">
                {otherStores.map((store) => {
                  const isChecked = selectedCodes.includes(store.code);
                  return (
                    <div
                      key={store.code}
                      onClick={() => handleToggleStore(store.code)}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-sans text-[14px] font-bold text-[#0f2340]">
                          {store.name}
                        </div>
                        <div className="font-sans text-[12px] font-medium text-[#3f4b5e]">
                          {store.code} · {store.city}
                        </div>
                      </div>

                      <div
                        className={cn(
                          "w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors",
                          isChecked
                            ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                            : "border-[#bcc6d3] bg-surface"
                        )}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dce2ea] mt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] font-bold text-[#0f2340] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={selectedCodes.length === 0 || isSubmitting}
                  className="h-9 px-4 rounded-[12px] bg-[#1c3a66] font-sans text-[14px] font-bold text-white hover:bg-[#0f2340] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {isSubmitting
                    ? "Copying..."
                    : `Copy to ${selectedCodes.length} store${
                        selectedCodes.length > 1 ? "s" : ""
                      }`}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
