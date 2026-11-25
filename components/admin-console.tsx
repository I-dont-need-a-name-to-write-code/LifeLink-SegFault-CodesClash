"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  deleteDonor,
  listDonors,
  listInterests,
  listRequests,
  setDonorStatus,
  setRequestStatus,
  updateRequestFields,
} from "@/lib/store";
import { timeAgo, URGENCY_STYLE } from "@/lib/blood";
import { sampleEmail } from "@/lib/seed";
import {
  REQUEST_STATUSES,
  type BloodRequest,
  type Donor,
  type DonorInterest,
  type DonorStatus,
  type RequestStatus,
} from "@/lib/types";
import {
  AlertIcon,
  CheckIcon,
  ClockIcon,
  DropletIcon,
  LockIcon,
  ShieldIcon,
} from "./icons";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE ?? "codesclash";
const SESSION_KEY = "lifelink.admin.unlocked";

const DONOR_STATUS_STYLE: Record<DonorStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  deactivated: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const REQUEST_STATUS_STYLE: Record<RequestStatus, string> = {
  Submitted: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  "In Review": "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  "Donors Contacted": "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
  Fulfilled: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Closed: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

export default function AdminConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [gateError, setGateError] = useState("");

  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [interests, setInterests] = useState<DonorInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"donors" | "requests">("donors");
  const [donorFilter, setDonorFilter] = useState<"pending" | "all">("pending");
  const [requestFilter, setRequestFilter] = useState<
    "all" | "open" | "fulfilled"
  >("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);
    } catch {
      // ignore storage errors
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [donorRows, requestRows, interestRows] = await Promise.all([
        listDonors(),
        listRequests(),
        listInterests(),
      ]);
      setDonors(donorRows);
      setRequests(requestRows);
      setInterests(interestRows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    void refresh();
  }, [unlocked, refresh]);

  async function changeDonorStatus(id: string, status: DonorStatus) {
    setBusy(id);
    try {
      await setDonorStatus(id, status);
      setDonors((current) =>
        current.map((donor) => (donor.id === id ? { ...donor, status } : donor)),
      );
    } finally {
      setBusy(null);
    }
  }

  async function removeDonor(id: string, name: string) {
    if (!window.confirm(`Remove ${name} from the directory permanently?`)) return;
    setBusy(id);
    try {
      await deleteDonor(id);
      setDonors((current) => current.filter((donor) => donor.id !== id));
    } finally {
      setBusy(null);
    }
  }

  async function changeRequestStatus(id: string, status: RequestStatus) {
    setBusy(id);
    try {
      await setRequestStatus(id, status);
      setRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, status } : request,
        ),
      );
    } finally {
      setBusy(null);
    }
  }

  async function assignDonor(id: string, donor_id: string | null) {
    setBusy(id);
    try {
      await updateRequestFields(id, { donor_id });
      setRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, donor_id } : request,
        ),
      );
    } finally {
      setBusy(null);
    }
  }

  const stats = useMemo(
    () => ({
      pending: donors.filter((donor) => donor.status === "pending").length,
      approved: donors.filter((donor) => donor.status === "approved").length,
      open: requests.filter(
        (request) =>
          request.status !== "Fulfilled" && request.status !== "Closed",
      ).length,
      interests: interests.length,
    }),
    [donors, requests, interests],
  );

  const visibleDonors = useMemo(
    () =>
      donorFilter === "pending"
        ? donors.filter((donor) => donor.status === "pending")
        : donors,
    [donors, donorFilter],
  );

  const visibleRequests = useMemo(() => {
    if (requestFilter === "open") {
      return requests.filter(
        (request) =>
          request.status !== "Fulfilled" && request.status !== "Closed",
      );
    }
    if (requestFilter === "fulfilled") {
      return requests.filter(
        (request) =>
          request.status === "Fulfilled" || request.status === "Closed",
      );
    }
    return requests;
  }, [requests, requestFilter]);

  if (!unlocked) {
    return (
      <div className="card mx-auto max-w-md p-7">
        <span className="grid size-12 place-items-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
          <LockIcon className="size-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Admin review
        </h1>
        <p className="muted mt-2">
          This area is for directory reviewers. Enter the reviewer passcode to
          approve listings and manage requests. For this prototype the passcode
          is{" "}
          <span className="font-mono font-semibold text-slate-700">
            codesclash
          </span>
          .
        </p>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (passcode.trim().toLowerCase() === ADMIN_PASSCODE.toLowerCase()) {
              setUnlocked(true);
              setGateError("");
              try {
                window.sessionStorage.setItem(SESSION_KEY, "1");
              } catch {
                // ignore
              }
            } else {
              setGateError("That passcode does not match.");
            }
          }}
        >
          <div>
            <label className="label" htmlFor="passcode">
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              className="input"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              placeholder="Enter passcode"
              autoFocus
            />
          </div>
          {gateError ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
              {gateError}
            </p>
          ) : null}
          <button type="submit" className="btn-primary w-full">
            Unlock dashboard
          </button>
        </form>

        <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          Every reviewer uses the same passcode in this prototype. Separate
          reviewer accounts would come with a full release.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
            Administrator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Review dashboard
          </h1>
          <p className="muted mt-2">
            Review new listings, manage the donor directory and update request
            statuses. This is a prototype: real arrangements stay with hospitals
            and licensed blood banks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => void refresh()}
          >
            Refresh
          </button>
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={() => {
              setUnlocked(false);
              try {
                window.sessionStorage.removeItem(SESSION_KEY);
              } catch {
                // ignore
              }
            }}
          >
            Lock
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Pending listings", value: stats.pending, icon: ClockIcon },
          { label: "Approved donors", value: stats.approved, icon: DropletIcon },
          { label: "Open requests", value: stats.open, icon: ShieldIcon },
          { label: "Offers to help", value: stats.interests, icon: CheckIcon },
        ].map((item) => (
          <div key={item.label} className="card flex items-center gap-3 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <item.icon className="size-5" />
            </span>
            <div>
              <p className="text-xl font-bold leading-none text-slate-900">
                {loading ? "–" : item.value}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {(
          [
            ["donors", `Donor listings (${donors.length})`],
            ["requests", `Blood requests (${requests.length})`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "donors" ? (
        <section className="card mt-4 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Donor listings</h2>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {(["pending", "all"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDonorFilter(value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    donorFilter === value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {value === "pending" ? "Needs review" : "All listings"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Loading listings...
            </p>
          ) : visibleDonors.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              {donorFilter === "pending"
                ? "Nothing waiting for review. Register a donor profile to see the approval flow."
                : "No donor listings yet."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleDonors.map((donor) => (
                <li key={donor.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {donor.display_name}
                        </span>
                        <span className="rounded-md bg-rose-600 px-1.5 py-0.5 text-[0.7rem] font-bold text-white">
                          {donor.blood_group}
                        </span>
                        <span className={`badge ${DONOR_STATUS_STYLE[donor.status]}`}>
                          {donor.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {donor.area ? `${donor.area}, ` : ""}
                        {donor.city}
                        {donor.pincode ? ` · ${donor.pincode}` : ""} ·{" "}
                        {donor.availability === "available"
                          ? "open to contact"
                          : donor.availability === "unavailable"
                            ? "not available now"
                            : "availability not stated"}{" "}
                        · joined {timeAgo(donor.created_at)}
                      </p>
                      {donor.note ? (
                        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
                          {donor.note}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {donor.status !== "approved" ? (
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          disabled={busy === donor.id}
                          onClick={() => void changeDonorStatus(donor.id, "approved")}
                        >
                          Approve
                        </button>
                      ) : null}
                      {donor.status !== "deactivated" ? (
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          disabled={busy === donor.id}
                          onClick={() =>
                            void changeDonorStatus(donor.id, "deactivated")
                          }
                        >
                          Deactivate
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn-ghost btn-sm text-rose-700 hover:bg-rose-50"
                        disabled={busy === donor.id}
                        onClick={() => void removeDonor(donor.id, donor.display_name)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="mt-4 space-y-3">
          <div className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Blood requests</h2>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {(
                [
                  ["all", "All"],
                  ["open", "Open"],
                  ["fulfilled", "Completed"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRequestFilter(value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    requestFilter === value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="card px-5 py-10 text-center text-sm text-slate-500">
              Loading requests...
            </p>
          ) : visibleRequests.length === 0 ? (
            <p className="card px-5 py-10 text-center text-sm text-slate-500">
              {requestFilter === "all"
                ? "No blood requests have been submitted yet."
                : requestFilter === "open"
                  ? "No open requests right now."
                  : "No completed requests yet."}
            </p>
          ) : (
            visibleRequests.map((request) => {
              const related = interests.filter(
                (interest) => interest.request_id === request.id,
              );
              const isOpen = expanded === request.id;
              const assigned = donors.find(
                (donor) => donor.id === request.donor_id,
              );
              const requesterEmail =
                request.requester_email || sampleEmail(request.requester_name);
              return (
                <article key={request.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-rose-600 px-1.5 py-0.5 text-xs font-bold text-white">
                          {request.blood_group}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {request.units} unit
                          {request.units === 1 ? "" : "s"} · {request.hospital}
                        </span>
                        <span className={`badge ${URGENCY_STYLE[request.urgency]}`}>
                          {request.urgency}
                        </span>
                        <span className={`badge ${REQUEST_STATUS_STYLE[request.status]}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-700">
                          {request.reference_code}
                        </span>{" "}
                        · {request.area ? `${request.area}, ` : ""}
                        {request.city} · by {request.requester_name} ·{" "}
                        {timeAgo(request.created_at)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Requester email:{" "}
                        <a
                          href={`mailto:${requesterEmail}`}
                          className="font-medium text-rose-700 hover:underline"
                        >
                          {requesterEmail}
                        </a>
                      </p>
                      {request.message ? (
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                          {request.message}
                        </p>
                      ) : null}
                      {request.contact_note ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Contact note: {request.contact_note}
                        </p>
                      ) : null}
                    </div>
                    <div className="w-full max-w-[15rem] space-y-3">
                       <div>
                         <label
                           className="label !mb-1 text-xs"
                           htmlFor={`donor-${request.id}`}
                         >
                           Assigned donor
                         </label>
                         <select
                           id={`donor-${request.id}`}
                           className="input !py-2 text-sm"
                           value={request.donor_id ?? ""}
                           disabled={busy === request.id}
                           onChange={(event) =>
                             void assignDonor(
                               request.id,
                               event.target.value || null,
                             )
                           }
                         >
                           <option value="">Unassigned</option>
                           {donors
                             .filter((donor) => donor.status === "approved")
                             .map((donor) => (
                               <option key={donor.id} value={donor.id}>
                                 {donor.display_name} · {donor.blood_group} ·{" "}
                                 {donor.city}
                               </option>
                             ))}
                         </select>
                         {assigned ? (
                           <p className="mt-1 text-xs text-slate-500">
                             Visible on this donor&apos;s dashboard.
                           </p>
                         ) : null}
                       </div>
                       <div>
                      <label
                        className="label !mb-1 text-xs"
                        htmlFor={`status-${request.id}`}
                      >
                        Update status
                      </label>
                      <select
                        id={`status-${request.id}`}
                        className="input !py-2 text-sm"
                        value={request.status}
                        disabled={busy === request.id}
                        onChange={(event) =>
                          void changeRequestStatus(
                            request.id,
                            event.target.value as RequestStatus,
                          )
                        }
                      >
                        {REQUEST_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                       </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={() =>
                        setExpanded(isOpen ? null : request.id)
                      }
                    >
                      {isOpen ? "Hide" : "Show"} offers to help ({related.length})
                    </button>
                    <Link
                      href={`/track?code=${request.reference_code}`}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Open tracking view
                    </Link>
                  </div>

                  {isOpen ? (
                    related.length === 0 ? (
                      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                        No volunteer has offered to help with this request yet.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {related.map((interest) => (
                          <li
                            key={interest.id}
                            className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
                          >
                            <p className="font-semibold text-slate-900">
                              {interest.helper_name}
                              {interest.area ? (
                                <span className="font-normal text-slate-500">
                                  {" "}
                                  · {interest.area}
                                </span>
                              ) : null}
                            </p>
                            {interest.note ? (
                              <p className="text-slate-600">{interest.note}</p>
                            ) : null}
                            <p className="text-xs text-slate-400">
                              {timeAgo(interest.created_at)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )
                  ) : null}
                </article>
              );
            })
          )}
        </section>
      )}

      <p className="mt-6 text-xs text-slate-500">
        Moderation changes apply immediately. A full release would keep an audit
        log of each reviewer&apos;s changes.
      </p>
    </div>
  );
}
