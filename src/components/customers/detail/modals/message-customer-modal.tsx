"use client";

import * as React from "react";
import { CustomerEntity } from "@/types/customers";
import { useAppDispatch } from "@/store";
import { sendCustomerMessageAction } from "@/store/slices/customers-slice";
import { X, Send } from "lucide-react";

interface MessageCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerEntity;
}

export function MessageCustomerModal({
  isOpen,
  onClose,
  customer,
}: MessageCustomerModalProps) {
  const dispatch = useAppDispatch();
  const [channel, setChannel] = React.useState<"push" | "whatsapp" | "sms">("push");
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await dispatch(
        sendCustomerMessageAction({
          id: customer.id,
          channel,
          message: message.trim(),
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        onClose();
      }, 1500);
    } catch {
      // Handled
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[20px] bg-white border border-[#dce2ea] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#dce2ea]">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] text-[#0f2340]">
              Message {customer.name}
            </h3>
            <span className="font-sans text-[12px] text-[#55647a]">
              {customer.code} · {customer.phone}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#7f8ca0] hover:text-[#0f2340] hover:bg-[#f5f7fa] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Channel Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Delivery Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["push", "whatsapp", "sms"] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannel(ch)}
                  className={`h-9 rounded-[10px] font-sans font-bold text-[13px] capitalize border transition-all ${
                    channel === ch
                      ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                      : "border-[#dce2ea] bg-white text-[#3f4b5e] hover:border-[#bcc6d3]"
                  }`}
                >
                  {ch === "push" ? "Push" : ch === "whatsapp" ? "WhatsApp" : "SMS"}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Quick Template
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    `Hi ${customer.name}, your favourite Salted Cream Cold Brew is waiting for you with double points today at Indiranagar!`
                  )
                }
                className="text-[12px] px-2.5 py-1 rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#3f4b5e] hover:border-[#1c3a66] transition-colors text-left"
              >
                Favourite drink invite
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    `Hi ${customer.name}, thank you for visiting us today! Let us know how your brew was.`
                  )
                }
                className="text-[12px] px-2.5 py-1 rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#3f4b5e] hover:border-[#1c3a66] transition-colors text-left"
              >
                Visit follow-up
              </button>
            </div>
          </div>

          {/* Message Text */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Message Text
            </label>
            <textarea
              rows={4}
              placeholder="Type your customer notification or announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] resize-none"
            />
          </div>

          {success && (
            <div className="p-3 rounded-[10px] bg-[#e3f4ea] text-[#1f7a4d] font-sans font-bold text-[13px] text-center">
              Message dispatched successfully via {channel}!
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] font-sans font-bold text-[14px] text-[#3f4b5e] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="h-9 px-5 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSending ? "Sending..." : "Send message"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

