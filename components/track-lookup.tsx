"use client";

import { useCallback, useEffect, useState } from "react";
import { findRequestByCode } from "@/lib/store";
import { timeAgo, URGENCY_STYLE } from "@/lib/blood";
import type { BloodRequest, RequestStatus } from "@/lib/types";
import { CheckIcon, ClockIcon, DropletIcon, PinIcon, SearchIcon } from "./icons";

const STEPS: RequestStatus[] = [
  "Submitted",
  "In Review",
  "Donors Contacted",
  "Fulfilled",
];

export default function TrackLookup({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lookup = useCallback(async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const found = await findRequestByCode(value);
      setRequest(found);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCode.trim()) void lookup(initialCode);
  }, [initialCode, lookup]);

  const currentStep = request ? STEPS.indexOf(request.status) : -1;
  const closed = request?.status === "Closed";

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void lookup(code);
        }}
        className="card p-4 sm:p-5"
      >
        <label className="label" htmlFor="code">
          Reference code
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="code"
            className="input font-mono uppercase tracking-[0.14em] sm:max-w-xs"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="LL-XXXXXX"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            <SearchIcon className="size-4" />
            {loading ? "Checking..." : "Track request"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          The code is shown after a request is submitted, for example LL-7K2M4Q.
        </p>
      </form>

      {searched && !request ? (
        <div className="card mt-5 px-6 py-10 text-center">
          <SearchIcon className="mx-auto size-8 text-slate-300" />
          <h2 className="mt-3 font-semibold text-slate-900">
            No request found for that code
          </h2>
          <p className="muted mt-1.5">
            Check the code and try again. Codes use the format LL-XXXXXX.
          </p>
        </div>
      ) : null}

      {request ? (
        <article className="card animate-rise mt-5 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Request{" "}
                <span className="font-mono text-slate-700">
                  {request.reference_code}
                </span>
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {request.units} unit{request.units === 1 ? "" : "s"} of{" "}
                {request.blood_group}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <PinIcon className="size-4 text-slate-400" />
                {request.hospital} · {request.area ? `${request.area}, ` : ""}
                {request.city}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`badge ${URGENCY_STYLE[request.urgency]}`}>
                {request.urgency}
              </span>
              <span className="text-xs text-slate-500">
                Raised {timeAgo(request.created_at)}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Requested by
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {request.requester_name}
              </p>
              {request.patient_name ? (
                <p className="text-xs text-slate-500">
                  Patient: {request.patient_name}
                </p>
              ) : null}
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Current status
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {request.status}
              </p>
              <p className="text-xs text-slate-500">
                {closed
                  ? "This request is no longer active."
                  : "The admin team updates this as coordination progresses."}
              </p>
            </div>
          </div>

          {request.message ? (
            <p className="mt-4 rounded-xl bg-rose-50/70 px-4 py-3 text-sm leading-relaxed text-rose-900 ring-1 ring-rose-100">
              {request.message}
            </p>
          ) : null}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900">Progress</h3>
            <ol className="mt-3 space-y-0">
              {STEPS.map((step, index) => {
                const reached = currentStep >= index;
                const active = currentStep === index && !closed;
                return (
                  <li key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid size-7 place-items-center rounded-full text-xs font-bold ring-1 ${
                          reached
                            ? "bg-emerald-500 text-white ring-emerald-500"
                            : "bg-white text-slate-400 ring-slate-200"
                        }`}
                      >
                        {reached ? <CheckIcon className="size-3.5" /> : index + 1}
                      </span>
                      {index < STEPS.length - 1 ? (
                        <span
                          className={`my-1 h-8 w-px ${
                            currentStep > index ? "bg-emerald-400" : "bg-slate-200"
                          }`}
                        />
                      ) : null}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`text-sm font-semibold ${
                          reached ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {step}
                        {active ? (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[0.65rem] font-medium text-amber-800 ring-1 ring-amber-200">
                            <ClockIcon className="size-3" />
                            Current
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-slate-500">
                        {step === "Submitted"
                          ? "Request created and reference code issued."
                          : step === "In Review"
                            ? "An administrator checks the details."
                            : step === "Donors Contacted"
                              ? "Matching donors and volunteers are being reached."
                              : "The hospital confirms the arrangement."}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <DropletIcon className="size-3.5 text-rose-500" />
            Prototype tracking. For urgent needs, follow up directly with the
            hospital blood bank.
          </p>
        </article>
      ) : null}
    </div>
  );
}
