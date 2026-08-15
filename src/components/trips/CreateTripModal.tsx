"use client";

import React, { useState } from "react";
import { X, Plane, Sparkles } from "lucide-react";
import { useTravel } from "@/context/TravelContext";
import type { TravelStyle } from "@/types";

const TRAVEL_STYLES: TravelStyle[] = [
  "Backpacking",
  "Trekking",
  "Cultural",
  "Adventure",
  "Luxury",
];

interface FormState {
  title: string;
  destination: string;
  dates: string;
  budget: string;
  spots: string;
  style: TravelStyle;
  description: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  destination: "",
  dates: "",
  budget: "",
  spots: "",
  style: "Backpacking",
  description: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CreateTripModal() {
  const { isCreateModalOpen, closeCreateModal, createTrip } = useTravel();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const update =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.title.trim()) next.title = "Trip title is required.";
    if (!form.destination.trim()) next.destination = "Destination is required.";
    if (!form.dates.trim()) next.dates = "Travel dates are required.";
    if (!form.budget.trim()) next.budget = "Budget is required.";
    if (!form.spots || Number(form.spots) <= 0)
      next.spots = "Enter a valid number of spots.";
    if (!form.description.trim())
      next.description = "Give travelers a sense of the trip.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await createTrip({
      title: form.title.trim(),
      destination: form.destination.trim(),
      dates: form.dates.trim(),
      budget: form.budget.trim(),
      spots: Number(form.spots),
      style: form.style,
      description: form.description.trim(),
    });
    setIsSubmitting(false);

    if (result.success) {
      setForm(EMPTY_FORM);
      setErrors({});
      closeCreateModal();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50">
              <Sparkles className="h-4.5 w-4.5 text-cyan-500" />
            </div>
            <h2 className="font-display text-lg font-bold text-[#2B2D2F]">
              Host a trip
            </h2>
          </div>
          <button
            onClick={closeCreateModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <Field label="Trip title" error={errors.title}>
            <input
              value={form.title}
              onChange={update("title")}
              placeholder="e.g. Coastal Road Trip Through Portugal"
              className="input"
            />
          </Field>

          <Field label="Destination" error={errors.destination}>
            <input
              value={form.destination}
              onChange={update("destination")}
              placeholder="e.g. Porto, Portugal"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Travel dates" error={errors.dates}>
              <input
                value={form.dates}
                onChange={update("dates")}
                placeholder="e.g. Mar 4 – Mar 11"
                className="input"
              />
            </Field>
            <Field label="Budget per person" error={errors.budget}>
              <input
                value={form.budget}
                onChange={update("budget")}
                placeholder="e.g. $900"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Available spots" error={errors.spots}>
              <input
                type="number"
                min="1"
                value={form.spots}
                onChange={update("spots")}
                placeholder="e.g. 5"
                className="input"
              />
            </Field>
            <Field label="Travel style">
              <select
                value={form.style}
                onChange={update("style")}
                className="input appearance-none bg-white"
              >
                {TRAVEL_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={update("description")}
              rows={4}
              placeholder="What's the vibe? What should people expect, bring, or be ready for?"
              className="input resize-none"
            />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 active:scale-[0.99] disabled:opacity-60"
          >
            <Plane className="h-4 w-4" /> {isSubmitting ? "Publishing…" : "Publish trip"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-medium text-rose-500">{error}</span>
      )}
    </label>
  );
}
