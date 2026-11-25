"use client";

import { useState } from "react";
import Link from "next/link";
import { createDonor } from "@/lib/store";
import { BLOOD_GROUPS, type Availability, type BloodGroup } from "@/lib/types";
import { CheckIcon, DropletIcon, ShieldIcon } from "./icons";

const AVAILABILITY_OPTIONS: { value: Availability; label: string; hint: string }[] = [
  {
    value: "available",
    label: "Open to contact",
    hint: "I am happy to be approached for a request.",
  },
  {
    value: "unknown",
    label: "Ask before assuming",
    hint: "I decide case by case.",
  },
  {
    value: "unavailable",
    label: "Not available now",
    hint: "Show my profile but do not send requests for now.",
  },
];

export default function RegisterForm() {
  const [form, setForm] = useState({
    display_name: "",
    email: "",
    blood_group: "" as BloodGroup | "",
    city: "",
    area: "",
    pincode: "",
    availability: "available" as Availability,
    last_donation_date: "",
    contact_preference: "Request form only",
    note: "",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.display_name.trim()) return setError("Please add a display name.");
    if (!form.email.trim()) return setError("Please add your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setError("Please enter a valid email address.");
    if (!form.blood_group) return setError("Please select your blood group.");
    if (!form.city.trim()) return setError("Please add your city.");
    if (form.pincode && form.pincode.length !== 6)
      return setError("PIN code should be 6 digits, or left blank.");
    if (!consent)
      return setError("Please confirm the sample-data and verification notice.");

    setSubmitting(true);
    try {
      await createDonor({
        display_name: form.display_name.trim(),
        email: form.email.trim().toLowerCase(),
        blood_group: form.blood_group as BloodGroup,
        city: form.city.trim(),
        area: form.area.trim(),
        pincode: form.pincode.trim(),
        availability: form.availability,
        last_donation_date: form.last_donation_date || null,
        contact_preference: form.contact_preference,
        note: form.note.trim() || null,
      });
      setSubmittedName(form.display_name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedName) {
    return (
      <div className="animate-rise card p-7 text-center sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="size-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Thanks, {submittedName.split(" ")[0]}!
        </h2>
        <p className="muted mx-auto mt-2 max-w-md">
          Your listing is <strong>pending admin review</strong>. Once it is
          approved it will appear in the public directory with your display name,
          general area and availability preference.
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-600 ring-1 ring-slate-200">
          <p className="font-semibold text-slate-900">What happens next</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>An administrator checks the profile for sample-data rules.</li>
            <li>The listing is approved, or returned for correction.</li>
            <li>Requesters can then find you by group and area.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Open my donor dashboard
          </Link>
          <Link href="/donors" className="btn-secondary">
            Browse the directory
          </Link>
        </div>
        <p className="mt-5 text-xs text-slate-500">
          No emails are sent in this prototype. Approvals are handled on the
          Admin page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="display_name">
            Display name <span className="text-rose-600">*</span>
          </label>
          <input
            id="display_name"
            className="input"
            value={form.display_name}
            onChange={(event) => update("display_name", event.target.value)}
            placeholder="e.g. A. Mehta"
            autoComplete="off"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Shown publicly. Use a nickname if you prefer.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="blood_group">
            Blood group <span className="text-rose-600">*</span>
          </label>
          <select
            id="blood_group"
            className="input"
            value={form.blood_group}
            onChange={(event) => update("blood_group", event.target.value)}
          >
            <option value="">Select group</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="email">
          Email address <span className="text-rose-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          className="input"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          placeholder="e.g. aarav@example.com"
          autoComplete="email"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Kept private. Requesters send a request through LifeLink; you see it on
          your dashboard and can reply by email if you choose.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="city">
            City <span className="text-rose-600">*</span>
          </label>
          <input
            id="city"
            className="input"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="e.g. Mumbai"
          />
        </div>
        <div>
          <label className="label" htmlFor="area">
            Area / locality
          </label>
          <input
            id="area"
            className="input"
            value={form.area}
            onChange={(event) => update("area", event.target.value)}
            placeholder="e.g. Andheri West"
          />
        </div>
        <div>
          <label className="label" htmlFor="pincode">
            PIN code
          </label>
          <input
            id="pincode"
            className="input"
            value={form.pincode}
            onChange={(event) =>
              update("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="6 digits"
            inputMode="numeric"
          />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="label">Availability preference</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {AVAILABILITY_OPTIONS.map((option) => {
            const active = form.availability === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl p-3.5 text-sm ring-1 transition ${
                  active
                    ? "bg-rose-50 text-rose-900 ring-rose-300"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="availability"
                  className="sr-only"
                  checked={active}
                  onChange={() => update("availability", option.value)}
                />
                <span className="flex items-center gap-2 font-semibold">
                  <span
                    className={`grid size-4 place-items-center rounded-full border ${
                      active
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {active ? <CheckIcon className="size-3" /> : null}
                  </span>
                  {option.label}
                </span>
                <span className="mt-1 block pl-6 text-xs leading-relaxed text-slate-500">
                  {option.hint}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="last_donation_date">
            Last donation <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="last_donation_date"
            type="date"
            className="input"
            value={form.last_donation_date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => update("last_donation_date", event.target.value)}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            A self-declared date only. LifeLink does not check eligibility.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="contact_preference">
            Preferred contact method
          </label>
          <select
            id="contact_preference"
            className="input"
            value={form.contact_preference}
            onChange={(event) =>
              update("contact_preference", event.target.value)
            }
          >
            <option>Request form only</option>
            <option>Through the hospital coordinator</option>
            <option>Ask me before sharing anything</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="label" htmlFor="note">
          Anything else? <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="note"
          className="input min-h-24 resize-y"
          value={form.note}
          onChange={(event) => update("note", event.target.value)}
          placeholder="e.g. Can reach hospitals in the western suburbs on weekends."
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Do not include phone numbers, addresses, medical conditions or reports.
        </p>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-rose-600"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          I understand this is a prototype, that I should use fictional or sample
          data only, and that LifeLink does not verify identity, eligibility or
          availability. Real arrangements must go through a hospital or licensed
          blood bank.
        </span>
      </label>

      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          <DropletIcon className="size-4" />
          {submitting ? "Submitting..." : "Submit for review"}
        </button>
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldIcon className="size-4 text-slate-400" />
          New listings stay hidden until an admin approves them.
        </p>
      </div>
    </form>
  );
}
