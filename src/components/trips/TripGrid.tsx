"use client";

import React from "react";
import { Search, Compass, Plus } from "lucide-react";
import { useTravel } from "@/context/TravelContext";
import TripCard from "./TripCard";
import { TripCardSkeleton } from "@/components/common/Skeletons";

export default function TripGrid() {
  const {
    filteredTrips,
    isLoadingTrips,
    searchQuery,
    setSearchQuery,
    openCreateModal,
  } = useTravel();

  return (
    <section id="explore" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#2B2D2F]">
            Explore trips
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLoadingTrips
              ? "Loading open trips…"
              : `${filteredTrips.length} open trip${
                  filteredTrips.length === 1 ? "" : "s"
                } looking for travel companions`}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination or trip title…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-colors focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
      </div>

      {isLoadingTrips ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Compass className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No trips match &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Try another destination, or start your own trip.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#2B2D2F] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Make a Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  );
}
