"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createInterest, listRequests } from "@/lib/store";
import { timeAgo, URGENCY_STYLE } from "@/lib/blood";
import type { BloodRequest } from "@/lib/types";
import {
  CheckIcon,
  ClockIcon,
  DropletIcon,
  HeartPulseIcon,
  PinIcon,
} from "./icons";

const URGENCY_ORDER: Record<BloodRequest["urgency"], number> = {
  Critical: 0,
  Urgent: 1,
  Routine: 2,
};

const STATUS_STYLE: Record<BloodRequest["status"], string> = {
  Submitted: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  "In Review": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  "Donors Contacted": "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  Fulfilled: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Closed: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

export function OpenRequests({
  limit,
  showIntro = true,
  showAllLink = true,
}: {
  limit?: number;
  showIntro?: boolean;
  showAllLink?: boolean;
}) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [helperFor, setHelperFor] = useState<BloodRequest | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listRequests();
        if (cancelled) return;
        setRequests(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const open = requests
    .filter(
      (request) =>
        request.status !== "Fulfilled" && request.status !== "Closed",
    )
    .sort((a, b) => {
      const urgency = URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency];
      if (urgency !== 0) return urgency;
      return b.created_at.localeCompare(a.created_at);
    });

  const visible = limit ? open.slice(0, limit) : open;

  return (
    <div>
      {showIntro ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Open blood requests</h2>
            <p className="muted mt-2 max-w-2xl">
              Requests raised through the prototype. Donors can express interest
              and an administrator follows up. Requests are not medical advice
              and are not broadcast to real blood banks.
            </p>
          </div>
          {showAllLink ? (
            <Link href="/requests" className="btn-secondary btn-sm">
              All requests
            </Link>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className="card h-40 animate-pulse bg-slate-100/70" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="card mt-5 px-6 py-10 text-center">
          <HeartPulseIcon className="mx-auto size-8 text-rose-300" />
          <h3 className="mt-3 font-semibold text-slate-900">
            No open requests right now
          </h3>
          <p className="muted mt-1.5">
            That is good news. You can still browse the donor directory or
            register as a donor.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visible.map((request) => (
            <article key={request.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                    <DropletIcon className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">
                        {request.blood_group}
                      </span>
                      <span className="text-sm text-slate-500">
                        · {request.units} unit{request.units === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ref{" "}
                      <span className="font-mono font-semibold text-slate-700">
                        {request.reference_code}
                      </span>{" "}
                      · {timeAgo(request.created_at)}
                    </p>
                  </div>
                </div>
                <span className={`badge ${URGENCY_STYLE[request.urgency]}`}>
                  {request.urgency}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{request.hospital}</p>
                <p className="flex items-center gap-1.5 text-slate-600">
                  <PinIcon className="size-4 shrink-0 text-slate-400" />
                  {request.area ? `${request.area}, ` : ""}
                  {request.city}
                  {request.pincode ? ` · ${request.pincode}` : ""}
                </p>
                {request.message ? (
                  <p className="line-clamp-2 text-slate-600">
                    {request.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <span className={`badge ${STATUS_STYLE[request.status]}`}>
                  <ClockIcon className="size-3" />
                  {request.status}
                </span>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => setHelperFor(request)}
                >
                  I can help
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {limit && open.length > limit ? (
        <div className="mt-4">
          <Link href="/requests" className="btn-secondary btn-sm">
            View {open.length - limit} more open request
            {open.length - limit === 1 ? "" : "s"}
          </Link>
        </div>
      ) : null}

      <InterestDialog
        request={helperFor}
        onClose={() => setHelperFor(null)}
      />
    </div>
  );
}

function InterestDialog({
  request,
  onClose,
}: {
  request: BloodRequest | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (request) {
      setDone(false);
      setError("");
      setNote("");
      setName("");
      setArea("");
    }
  }, [request]);

  if (!request) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) return;
    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createInterest({
        request_id: request.id,
        helper_name: name.trim(),
        area: area.trim(),
        note: note.trim() || null,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not record your interest.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Express interest"
      onClick={onClose}
    >
      <div
        className="animate-rise w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {done ? (
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckIcon className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Interest recorded
            </h3>
            <p className="muted mt-2">
              The administrator can now see that you offered to help with{" "}
              <span className="font-mono font-semibold">
                {request.reference_code}
              </span>
              . In a real deployment this would trigger a verified
              follow-up.
            </p>
            <button type="button" className="btn-primary mt-5" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Offer to help
              </h3>
              <p className="muted mt-1">
                {request.blood_group} needed at {request.hospital},{" "}
                {request.city}.
              </p>
            </div>
            <div>
              <label className="label" htmlFor="helper-name">
                Your name <span className="text-rose-600">*</span>
              </label>
              <input
                id="helper-name"
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Fictional name for the demo is fine"
              />
            </div>
            <div>
              <label className="label" htmlFor="helper-area">
                Area you can reach
              </label>
              <input
                id="helper-area"
                className="input"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="e.g. Andheri, 30 minutes from the hospital"
              />
            </div>
            <div>
              <label className="label" htmlFor="helper-note">
                Note <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="helper-note"
                className="input min-h-20 resize-y"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="When you are free, or anything the coordinator should know."
              />
            </div>
            <p className="text-xs text-slate-500">
              Do not share real phone numbers or medical records in this
              prototype.
            </p>
            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
                {error}
              </p>
            ) : null}
            <div className="flex gap-2.5">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Send interest"}
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
