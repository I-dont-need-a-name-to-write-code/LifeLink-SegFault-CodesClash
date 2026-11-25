"use client";

import { AVAILABILITY_LABEL, initials, monthsSince } from "@/lib/blood";
import type { Donor } from "@/lib/types";
import { ClockIcon, DropletIcon, PinIcon } from "./icons";

const AVAILABILITY_STYLE: Record<Donor["availability"], string> = {
  available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  unavailable: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  unknown: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
};

export default function DonorCard({
  donor,
  highlightGroup,
  onRequest,
}: {
  donor: Donor;
  highlightGroup?: string;
  onRequest: (donor: Donor) => void;
}) {
  const months = monthsSince(donor.last_donation_date);
  const exactMatch = highlightGroup && donor.blood_group === highlightGroup;

  return (
    <article className="card flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_18px_36px_-22px_rgba(15,23,42,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 text-sm font-bold text-rose-700 ring-1 ring-rose-100">
            {initials(donor.display_name)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {donor.display_name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
              <PinIcon className="size-3.5 shrink-0" />
              {donor.area ? `${donor.area}, ` : ""}
              {donor.city}
              {donor.pincode ? ` · ${donor.pincode}` : ""}
            </p>
          </div>
        </div>
        <span className="grid shrink-0 place-items-center rounded-xl bg-rose-600 px-2.5 py-1.5 text-sm font-bold text-white shadow-sm shadow-rose-600/20">
          {donor.blood_group}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className={`badge ${AVAILABILITY_STYLE[donor.availability]}`}>
          <DropletIcon className="size-3" />
          {AVAILABILITY_LABEL[donor.availability]}
        </span>
        {exactMatch ? (
          <span className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-200">
            Exact match
          </span>
        ) : highlightGroup ? (
          <span className="badge bg-slate-50 text-slate-600 ring-1 ring-slate-200">
            Compatible with {highlightGroup}
          </span>
        ) : null}
        <span className="badge bg-slate-50 text-slate-600 ring-1 ring-slate-200">
          <ClockIcon className="size-3" />
          {months === null
            ? "Donation history not stated"
            : months >= 6
              ? `Last donated ${months} months ago`
              : `Last donated ${months} month${months === 1 ? "" : "s"} ago`}
        </span>
      </div>

      {donor.note ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {donor.note}
        </p>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          No extra notes from this donor.
        </p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <p className="text-[0.7rem] leading-snug text-slate-400">
          Sample profile · eligibility not verified
        </p>
        <button
          type="button"
          onClick={() => onRequest(donor)}
          className="btn-primary btn-sm shrink-0"
        >
          Send request
        </button>
      </div>
    </article>
  );
}
