"use client";

import React, { useState, useEffect } from "react";

import { useTravel } from "@/context/TravelContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal } =
    useTravel();
  const { login, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const isRegister = authModalMode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    const result = isRegister
      ? await register(name.trim(), email.trim(), password)
      : await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      closeAuthModal();
    } else {
      setError(result.message || "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <a>
            <Image 
        src={logo} 
        alt="Logo" 
        priority 
        className="w-auto h-12" />
    </a>
            
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </div>
          )}

          {isRegister && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>

          <p className="text-center text-xs text-slate-500">
            {isRegister ? "Already have an account?" : "New to Flego?"}{" "}
            <button
              type="button"
              onClick={() => openAuthModal(isRegister ? "login" : "register")}
              className="font-semibold text-cyan-600 hover:underline"
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </p>

          {!isRegister && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-400">
              Demo login — demo@flego.com / password123
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
