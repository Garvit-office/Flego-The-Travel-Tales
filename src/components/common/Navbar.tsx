"use client";

import React, { useState } from "react";
import { Plus, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTravel } from "@/context/TravelContext";
import Image from "next/image";
import logo from "@/assets/logo.png";
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { openAuthModal, openCreateModal } = useTravel();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
       <a href="#top" className="flex items-center gap-2.5">
      <Image 
        src={logo} 
        alt="Logo" 
        priority 
        className="w-auto h-12" />
    </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#explore"
            className="text-sm font-medium text-slate-600 hover:text-[#2B2D2F]"
          >
            Explore Trips
          </a>
          <a
            href="#stories"
            className="text-sm font-medium text-slate-600 hover:text-[#2B2D2F]"
          >
            Travel Stories
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="hidden items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600 active:scale-95 sm:inline-flex"
          >
            <Plus className="h-4 w-4" /> Make a Trip
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2B2D2F] text-xs font-bold text-white"
              >
                {initials(user.name)}
              </button>
              {menuOpen && (
                <div
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute right-0 top-11 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  <div className="px-3 py-2 text-xs text-slate-400">
                    Signed in as
                  </div>
                  <div className="truncate px-3 pb-2 text-sm font-semibold text-[#2B2D2F]">
                    {user.name}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#2B2D2F] hover:bg-slate-50 sm:inline-flex"
            >
              <UserIcon className="h-4 w-4" /> Sign in
            </button>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-slate-100 px-5 py-3 md:hidden">
          <a
            href="#explore"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Explore Trips
          </a>
          <a
            href="#stories"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Travel Stories
          </a>
          <button
            onClick={() => {
              openCreateModal();
              setMobileOpen(false);
            }}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Make a Trip
          </button>
          {!user && (
            <button
              onClick={() => {
                openAuthModal("login");
                setMobileOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#2B2D2F]"
            >
              <UserIcon className="h-4 w-4" /> Sign in
            </button>
          )}
        </div>
      )}
    </header>
  );
}
