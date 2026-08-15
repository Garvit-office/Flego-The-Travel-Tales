"use client";

import React from "react";
import { Plane, ArrowRight, Compass } from "lucide-react";
import { useTravel } from "@/context/TravelContext";

export default function Hero() {
  const { openCreateModal } = useTravel();

  return (
    <section id="top" className="relative overflow-hidden bg-[#2B2D2F]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300">
            <Compass className="h-3.5 w-3.5" /> Esparrow — find your next flock
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Trips are better with{" "}
            <span className="text-cyan-400">people, not itineraries.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
            Flego connects travelers headed the same direction. Join a trip
            someone&apos;s already planning, or host your own and let the
            right people find you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#explore"
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600 active:scale-95"
            >
              Explore trips <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              <Plane className="h-4 w-4" /> Host a trip
            </button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto hidden max-w-6xl px-8 pb-10 sm:block" aria-hidden="true">
        <svg viewBox="0 0 1000 60" className="w-full text-white/20" fill="none">
          <path
            d="M0 40 Q 250 -10 500 30 T 1000 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
        </svg>
      </div>
    </section>
  );
}
