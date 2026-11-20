"use client";

import * as React from "react";
import { Star, MessageSquareQuote } from "lucide-react";
import { RatingDistribution, CustomerQuote } from "@/types/lab";

interface RatingsFeedbackCardProps {
  distribution?: RatingDistribution[];
  sweetnessSentiment?: string;
  quotes?: CustomerQuote[];
}

const DEFAULT_DIST: RatingDistribution[] = [
  { stars: 5, pct: 64, count: 520 },
  { stars: 4, pct: 24, count: 195 },
  { stars: 3, pct: 8, count: 65 },
  { stars: 2, pct: 3, count: 24 },
  { stars: 1, pct: 1, count: 8 },
];

const DEFAULT_QUOTES: CustomerQuote[] = [
  {
    quote: "“Best matcha drink I’ve had in Bangalore. Please make this permanent!”",
    author: "Priya M. · Indiranagar",
    rating: 5,
  },
  {
    quote: "“Great balance of acidity and grassy matcha. Perfect 4 pm refresher.”",
    author: "Rahul K. · Koramangala",
    rating: 5,
  },
  {
    quote: "“A bit too tart on first sip, but after stirring it was lovely.”",
    author: "Ananya S. · Bandra",
    rating: 4,
  },
];

export function RatingsFeedbackCard({
  distribution = DEFAULT_DIST,
  sweetnessSentiment = "52% “just right”, 31% “too tart”",
  quotes = DEFAULT_QUOTES,
}: RatingsFeedbackCardProps) {
  return (
    <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#dce2ea]">
        <h3 className="text-title text-[#0F2340]">Ratings & feedback</h3>
        <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-[#EBF1DE] text-[#566F2C] border border-[#C6D8A8]">
          ★ 4.5 average (812 reviews)
        </span>
      </div>

      {/* 5-Star Breakdown */}
      <div className="flex flex-col gap-2">
        {distribution.map((d) => (
          <div key={d.stars} className="flex items-center gap-3 text-caption">
            <span className="w-6 text-right font-bold text-[#0F2340] flex items-center justify-end gap-1">
              {d.stars} <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
            </span>
            <div className="flex-1 bg-[#EBEFF4] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F59E0B] h-full rounded-full transition-all duration-300"
                style={{ width: `${d.pct}%` }}
              />
            </div>
            <span className="w-10 text-right text-[#55647A] font-semibold">
              {d.pct}%
            </span>
            <span className="w-12 text-right text-[11px] text-[#7F8CA0]">
              ({d.count})
            </span>
          </div>
        ))}
      </div>

      {/* Sensory Sweetness Sentiment Pill */}
      <div className="p-3 rounded-[12px] bg-[#F5F7FA] border border-[#EBEFF4] flex flex-col gap-1">
        <span className="text-[11px] font-bold text-[#55647A] uppercase tracking-wider">
          SWEETNESS SENSORY SENTIMENT
        </span>
        <span className="text-caption-bold text-[#0F2340]">{sweetnessSentiment}</span>
        <span className="text-[11px] text-[#55647A]">
          Mumbai outlets rate tartness higher than Bangalore — consider adjusting syrup ratio for national rollout.
        </span>
      </div>

      {/* Customer Review Quotes */}
      <div className="flex flex-col gap-3">
        <span className="text-caption-bold text-[#55647A] uppercase tracking-wider">
          RECENT TASTING COMMENTS
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          {quotes.map((q, idx) => (
            <div
              key={idx}
              className="p-3 rounded-[12px] border border-[#EBEFF4] bg-[#FAFAF8] flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0F2340]">{q.author}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: q.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
              </div>
              <p className="text-[13px] text-[#3F4B5E] italic leading-relaxed">
                {q.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

