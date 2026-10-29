"use client";

import * as React from "react";
import { Search, Loader2, X, AlertCircle } from "lucide-react";
import { LocationPinIcon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";
import { AutocompletePrediction, ParsedAddress } from "@/types/maps";
import {
  searchPlaces,
  getPlaceDetails,
  generateGoogleMapsSessionToken,
} from "@/lib/maps/google-maps-client";

export interface PlaceAutocompleteInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect: (place: ParsedAddress) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  id?: string;
  autoFocus?: boolean;
}

export function PlaceAutocompleteInput({
  value: controlledValue,
  onChange,
  onPlaceSelect,
  placeholder = "Search location, landmark, area, or street address...",
  className,
  disabled = false,
  error,
  latitude,
  longitude,
  radius,
  id,
  autoFocus = false,
}: PlaceAutocompleteInputProps) {
  const [internalValue, setInternalValue] = React.useState(controlledValue || "");
  const [predictions, setPredictions] = React.useState<AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const [sessionToken, setSessionToken] = React.useState<string>("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastUserTypedValueRef = React.useRef<string>("");

  // Sync controlled value
  React.useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== internalValue) {
      lastUserTypedValueRef.current = "";
      setInternalValue(controlledValue);
      setPredictions([]);
      setIsOpen(false);
    }
  }, [controlledValue, internalValue]);

  // Handle outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced places search - ONLY triggers when value was actively typed by user
  React.useEffect(() => {
    if (!lastUserTypedValueRef.current || internalValue !== lastUserTypedValueRef.current) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    const trimmed = internalValue.trim();
    if (!trimmed || trimmed.length < 2) {
      setPredictions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (internalValue !== lastUserTypedValueRef.current) {
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchPlaces(trimmed, {
          sessionToken: sessionToken || undefined,
          latitude,
          longitude,
          radius,
          signal: controller.signal,
        });

        if (!controller.signal.aborted && internalValue === lastUserTypedValueRef.current) {
          setPredictions(results);
          setIsOpen(results.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Autocomplete search error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      controller.abort();
    };
  }, [internalValue, sessionToken, latitude, longitude, radius]);

  const handleFocus = () => {
    if (!sessionToken) {
      setSessionToken(generateGoogleMapsSessionToken());
    }
    if (predictions.length > 0 && lastUserTypedValueRef.current) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    lastUserTypedValueRef.current = val;
    setInternalValue(val);
    onChange?.(val);
  };

  const handleSelectPrediction = async (prediction: AutocompletePrediction) => {
    // Immediately dismiss dropdown and clear predictions
    setIsOpen(false);
    setPredictions([]);
    setSelectedIndex(-1);
    lastUserTypedValueRef.current = "";

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    inputRef.current?.blur();
    setIsLoading(true);
    setInternalValue(prediction.description);
    onChange?.(prediction.description);

    try {
      const details = await getPlaceDetails(prediction.placeId, sessionToken);
      if (details) {
        onPlaceSelect(details);
      }
    } catch (err) {
      console.error("Failed to retrieve place details:", err);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setPredictions([]);
      setSessionToken(generateGoogleMapsSessionToken());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || predictions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectPrediction(predictions[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    setPredictions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        {/* Left Search Icon */}
        <div className="absolute left-3.5 flex items-center pointer-events-none text-[#7F8CA0]">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#1C3A66]" />
          ) : (
            <Search className="w-4 h-4 text-[#7F8CA0]" />
          )}
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoFocus={autoFocus}
          disabled={disabled}
          value={internalValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "w-full h-10 pl-10 pr-9 rounded-[12px] bg-white text-body-s text-[#0F2340] placeholder:text-[#7F8CA0] transition-all outline-none",
            error
              ? "border-2 border-[#C0352B] shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
              : "border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66]",
            disabled && "bg-gray-100 text-[#7F8CA0] cursor-not-allowed",
            className
          )}
        />

        {/* Clear Button */}
        {internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-[#7F8CA0] hover:text-[#0F2340] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Clear address"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[12px] font-medium text-[#C0352B] mt-1.5 flex items-center gap-1 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Autocomplete Predictions Dropdown */}
      {isOpen && predictions.length > 0 && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-[14px] border border-[#dce2ea] shadow-floating p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto custom-scrollbar"
        >
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-[#7F8CA0] uppercase tracking-wider border-b border-[#f0f2f5] mb-1">
            <span>Google Maps Suggestions</span>
            <span className="text-[10px] lowercase font-normal">verified locations</span>
          </div>

          {predictions.map((p, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={p.placeId || idx}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectPrediction(p)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-[10px] flex items-start gap-2.5 transition-colors cursor-pointer",
                  isSelected
                    ? "bg-[#e8f5fd] text-[#0F2340]"
                    : "hover:bg-[#f5f7fa] text-[#0F2340]"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 p-1 rounded-full shrink-0",
                    isSelected
                      ? "bg-[#1C3A66] text-white"
                      : "bg-[#f0f4f9] text-[#1C3A66]"
                  )}
                >
                  <LocationPinIcon className="w-3.5 h-3.5" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#0F2340] truncate leading-tight">
                    {p.mainText || p.description}
                  </span>
                  {p.secondaryText && (
                    <span className="text-[11px] text-[#55647A] truncate leading-tight mt-0.5">
                      {p.secondaryText}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

