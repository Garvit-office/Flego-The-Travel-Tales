"use client";

import React from "react";
import { MapPin, Calendar, Wallet, Users, Plane, CheckCircle2 } from "lucide-react";
import type { Trip } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useTravel } from "@/context/TravelContext";

const STYLE_STYLES: Record<string, string> = {
  Backpacking: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Trekking: "bg-amber-50 text-amber-700 border-amber-200",
  Cultural: "bg-violet-50 text-violet-700 border-violet-200",
  Adventure: "bg-rose-50 text-rose-700 border-rose-200",
  Luxury: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const AVATAR_HUES = [
  "bg-cyan-500",
  "bg-slate-700",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-500",
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}
function hueFor(seed: string): string {
  return AVATAR_HUES[Math.abs(hashCode(seed)) % AVATAR_HUES.length];
}
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TripCard({ trip }: { trip: Trip }) {
  const { user } = useAuth();
  const { joinTrip } = useTravel();

  const full = trip.spotsLeft <= 0;
  const joined = user ? trip.joinedUsers.includes(user.id) : false;
  const isHost = user ? trip.hostId === user.id : false;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative bg-[#2B2D2F] px-5 pb-6 pt-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
              Destination
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <h3 className="font-display text-base font-bold leading-tight">
                {trip.destination}
              </h3>
            </div>
          </div>
          <Plane className="h-5 w-5 shrink-0 rotate-45 text-cyan-400/70" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-200">{trip.title}</p>
      </div>

      {/* perforation divider — the boarding-pass tear line */}
      <div className="relative h-0 border-t border-dashed border-slate-300">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{trip.dates}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Wallet className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{trip.budget}</span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {trip.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              STYLE_STYLES[trip.style] ||
              "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {trip.style}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Users className="h-3.5 w-3.5" />
            {full
              ? "Full"
              : `${trip.spotsLeft} spot${trip.spotsLeft === 1 ? "" : "s"} left`}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white ${hueFor(
                trip.host
              )}`}
            >
              {initials(trip.host)}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-[#2B2D2F]">{trip.host}</p>
              <p className="text-[11px] text-slate-400">Trip host</p>
            </div>
          </div>

          <button
            onClick={() => joinTrip(trip.id)}
            disabled={joined || full || isHost}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              joined
                ? "cursor-default bg-emerald-50 text-emerald-600"
                : isHost
                ? "cursor-default bg-slate-100 text-slate-400"
                : full
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95"
            }`}
          >
            {joined ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Joined!
              </>
            ) : isHost ? (
              "Your trip"
            ) : full ? (
              "Full"
            ) : (
              "Request to Join"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
