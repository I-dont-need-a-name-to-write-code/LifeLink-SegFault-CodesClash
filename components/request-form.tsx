"use client";

import { useEffect, useState } from "react";
import { BLOOD_GROUPS, type BloodGroup, type Urgency } from "@/lib/types";
import { createRequest } from "@/lib/store";
import { CheckIcon, CopyIcon, DropletIcon, ShieldIcon } from "./icons";
import Link from "next/link";

const URGENCIES: Urgency[] = ["Routine", "Urgent", "Critical"];

function FormSection({ title }: { title: string }) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5 first:mt-0 first:border-0 first:pt-0">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-rose-700">
        {title}
      </p>
    </div>
  );
}

type Defaults = {
  blood_group?: BloodGroup | "";
  city?: string;
  area?: string;
  pincode?: string;
  donorName?: string;
  donorId?: string;
};

export function RequestForm({
  defaults,
  onDone,
  compact = false,
}: {
  defaults?: Defaults;
  onDone?: () => void;
  compact?: boolean;
}) {
  const lockedGroup = Boolean(defaults?.donorId);

  const [form, setForm] = useState({
    requester_name: "",
    requester_email: "",
    patient_name: "",
    blood_group: defaults?.blood_group ?? "",
    units: "1",
    hospital: "",
    city: defaults?.city ?? "",
    area: defaults?.area ?? "",
    pincode: defaults?.pincode ?? "",
    urgency: "Urgent" as Urgency,
    contact_note: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      blood_group: defaults?.blood_group ?? current.blood_group,
      city: defaults?.city ?? current.city,
      area: defaults?.area ?? current.area,
      pincode: defaults?.pincode ?? current.pincode,
    }));
  }, [defaults?.blood_group, defaults?.city, defaults?.area, defaults?.pincode]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.requester_name.trim()) return setError("Please add your name.");
    if (!form.requester_email.trim())
      return setError("Please add your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.requester_email.trim()))
      return setError("Please enter a valid email address.");
    if (!form.blood_group) return setError("Please select the blood group needed.");
    if (!form.hospital.trim()) return setError("Please add the hospital or blood bank.");
    if (!form.city.trim()) return setError("Please add the city.");

    setSubmitting(true);
    try {
      const request = await createRequest({
        requester_name: form.requester_name.trim(),
        requester_email: form.requester_email.trim().toLowerCase(),
        patient_name: form.patient_name.trim() || null,
        blood_group: form.blood_group as BloodGroup,
        units: Math.min(10, Math.max(1, Number(form.units) || 1)),
        hospital: form.hospital.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        pincode: form.pincode.trim(),
        urgency: form.urgency,
        contact_note: form.contact_note.trim() || null,
        message: form.message.trim() || null,
        donor_id: defaults?.donorId ?? null,
      });
      setReference(request.reference_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="animate-rise text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="size-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">Request submitted</h3>
        <p className="muted mx-auto mt-2 max-w-md">
          Save this reference code. You can use it on the Track page to see the
          status of your request.
        </p>

        <div className="mx-auto mt-5 flex max-w-xs items-center justify-between gap-3 rounded-xl border border-dashed border-rose-300 bg-rose-50 px-4 py-3">
          <span className="font-mono text-lg font-bold tracking-[0.18em] text-rose-700">
            {reference}
          </span>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(reference);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              } catch {
                setCopied(false);
              }
            }}
          >
            <CopyIcon className="size-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/track?code=${reference}`} className="btn-primary">
            Track this request
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setReference(null);
              setForm((current) => ({ ...current, message: "" }));
              onDone?.();
            }}
          >
            Submit another
          </button>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          This is a prototype workflow. The request is not sent to a real blood
          bank. Please contact the hospital directly in an emergency.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {defaults?.donorName ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 p-3 text-sm text-rose-900 ring-1 ring-rose-100">
          <ShieldIcon className="mt-0.5 size-4 shrink-0 text-rose-600" />
          <p>
            Interest will be recorded against{" "}
            <strong>{defaults.donorName}</strong>&apos;s sample profile, and the
            blood group is locked to <strong>{form.blood_group}</strong>. The
            donor decides whether to respond, and their details are never
            published.
          </p>
        </div>
      ) : null}

      <FormSection title="About you" />
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-3"}>
        <div>
          <label className="label" htmlFor="requester_name">
            Your name <span className="text-rose-600">*</span>
          </label>
          <input
            id="requester_name"
            className="input"
            value={form.requester_name}
            onChange={(event) => update("requester_name", event.target.value)}
            placeholder="e.g. Sunita Rao"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label" htmlFor="requester_email">
            Your email <span className="text-rose-600">*</span>
          </label>
          <input
            id="requester_email"
            type="email"
            className="input"
            value={form.requester_email}
            onChange={(event) => update("requester_email", event.target.value)}
            placeholder="e.g. sunita@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="patient_name">
            Patient name <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="patient_name"
            className="input"
            value={form.patient_name}
            onChange={(event) => update("patient_name", event.target.value)}
            placeholder="Name on the hospital record"
          />
        </div>
      </div>

      <p className="-mt-1 text-xs text-slate-500">
        Your email stays private. A matching donor sees the request on their
        dashboard and can reply to you directly.
      </p>

      <FormSection title="Blood needed" />
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-3"}>
        <div>
          <label className="label" htmlFor="blood_group">
            Blood group needed <span className="text-rose-600">*</span>
          </label>
          <select
            id="blood_group"
            className={`input ${lockedGroup ? "cursor-not-allowed bg-slate-100 text-slate-600" : ""}`}
            value={form.blood_group}
            disabled={lockedGroup}
            onChange={(event) => update("blood_group", event.target.value)}
          >
            <option value="">Select group</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {lockedGroup ? (
            <p className="mt-1.5 text-xs font-medium text-rose-700">
              Locked to {defaults?.donorName}&apos;s group. Need a different
              group? Close this and search again.
            </p>
          ) : null}
        </div>
        <div>
          <label className="label" htmlFor="units">
            Units needed
          </label>
          <input
            id="units"
            className="input"
            type="number"
            min={1}
            max={10}
            value={form.units}
            onChange={(event) => update("units", event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="urgency">
            Urgency
          </label>
          <select
            id="urgency"
            className="input"
            value={form.urgency}
            onChange={(event) => update("urgency", event.target.value)}
          >
            {URGENCIES.map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormSection title="Hospital and location" />
      <div>
        <label className="label" htmlFor="hospital">
          Hospital / blood bank <span className="text-rose-600">*</span>
        </label>
        <input
          id="hospital"
          className="input"
          value={form.hospital}
          onChange={(event) => update("hospital", event.target.value)}
          placeholder="e.g. City General Hospital"
        />
      </div>

      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-3"}>
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
            placeholder="e.g. Andheri East"
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

      <FormSection title="Anything else" />
      <div>
        <label className="label" htmlFor="contact_note">
          How should the hospital desk reach you?{" "}
          <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="contact_note"
          className="input"
          value={form.contact_note}
          onChange={(event) => update("contact_note", event.target.value)}
          placeholder="e.g. Ask for the attending physician at the reception"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Please do not type real phone numbers or medical details in this
          prototype.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="message">
          Short note <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="message"
          className="input min-h-24 resize-y"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Anything a potential donor should know before responding."
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" className="btn-primary" disabled={submitting}>
          <DropletIcon className="size-4" />
          {submitting ? "Submitting..." : "Submit request"}
        </button>
        <p className="text-xs text-slate-500">
          A reference code is generated so you can track the status.
        </p>
      </div>
    </form>
  );
}

export function RequestDialog({
  open,
  onClose,
  defaults,
  title = "Request blood",
}: {
  open: boolean;
  onClose: () => void;
  defaults?: Defaults;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="animate-rise my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="muted mt-1">
              Share the basics and get a reference code. This is a prototype,
              so no real messages are sent.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost size-9 !p-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <RequestForm defaults={defaults} />
      </div>
    </div>
  );
}
