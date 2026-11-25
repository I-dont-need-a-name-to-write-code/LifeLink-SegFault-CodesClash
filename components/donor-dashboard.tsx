"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AVAILABILITY_LABEL,
  URGENCY_STYLE,
  compatibleDonorGroups,
  initials,
  timeAgo,
} from "@/lib/blood";
import { listDonors, listRequests } from "@/lib/store";
import { sampleEmail } from "@/lib/seed";
import type { BloodRequest, Donor } from "@/lib/types";
import {
  AlertIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  DropletIcon,
  PinIcon,
  SearchIcon,
  ShieldIcon,
} from "./icons";

const STATUS_STYLE: Record<Donor["status"], string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  deactivated: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

function isOpen(request: BloodRequest): boolean {
  return request.status !== "Fulfilled" && request.status !== "Closed";
}

export default function DonorDashboard() {
  const [email, setEmail] = useState("");
  const [donor, setDonor] = useState<Donor | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [looked, setLooked] = useState(false);

  async function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const needle = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(needle)) {
      setError("Enter the email address you used when registering.");
      return;
    }

    setBusy(true);
    try {
      const [donors, allRequests] = await Promise.all([
        listDonors(),
        listRequests(),
      ]);
      const match =
        donors.find(
          (item) =>
            (item.email || sampleEmail(item.display_name)).toLowerCase() ===
            needle,
        ) ?? null;
      setDonor(match);
      setRequests(allRequests);
      setLooked(true);
      if (!match) {
        setError(
          "No donor profile uses that email. Check the spelling, or register a profile first.",
        );
      }
    } catch {
      setError("Could not load the dashboard. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setDonor(null);
    setRequests([]);
    setLooked(false);
    setError("");
    setEmail("");
  }

  const sentToMe = donor
    ? requests.filter((request) => request.donor_id === donor.id)
    : [];
  const suggested = donor
    ? requests.filter(
        (request) =>
          isOpen(request) &&
          !request.donor_id &&
          compatibleDonorGroups(request.blood_group).includes(donor.blood_group),
      )
    : [];
  const nearby = donor
    ? suggested.filter(
        (request) =>
          request.city.toLowerCase() === donor.city.toLowerCase() ||
          request.pincode.startsWith(donor.pincode || "\u0000"),
      )
    : [];
  const other = suggested.filter((request) => !nearby.includes(request));

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-7">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ShieldIcon className="size-4 text-rose-600" />
          Donor sign in
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the email you registered with to see requests that match your
          blood group and area.
        </p>
      </div>

      {!donor ? (
        <form onSubmit={lookup} className="px-5 py-6 sm:px-7">
          <label className="label" htmlFor="donor_email">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="donor_email"
              type="email"
              className="input sm:flex-1"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="e.g. aarav.mehta@example.com"
              autoComplete="email"
            />
            <button type="submit" className="btn-primary" disabled={busy}>
              <SearchIcon className="size-4" />
              {busy ? "Checking..." : "Open dashboard"}
            </button>
          </div>

          {error ? (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <p className="mt-4 text-xs text-slate-500">
            Try a sample profile:{" "}
            <span className="font-mono text-slate-600">
              aarav.mehta@example.com
            </span>{" "}
            (O−, Mumbai). No password is needed in this prototype.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Not listed yet?{" "}
            <Link href="/register" className="font-semibold text-rose-600">
              Register as a donor
            </Link>
            .
          </p>
        </form>
      ) : (
        <div className="px-5 py-6 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 text-sm font-bold text-rose-700 ring-1 ring-rose-100">
                {initials(donor.display_name)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-slate-900">
                    {donor.display_name}
                  </h3>
                  <span
                    className={`badge bg-white ${STATUS_STYLE[donor.status]}`}
                  >
                    {donor.status === "approved"
                      ? "Listed"
                      : donor.status === "pending"
                        ? "Pending review"
                        : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <PinIcon className="size-4 shrink-0" />
                  {donor.area ? `${donor.area}, ` : ""}
                  {donor.city}
                  {donor.pincode ? ` · ${donor.pincode}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid place-items-center rounded-xl bg-rose-600 px-3 py-1.5 text-base font-bold text-white shadow-sm shadow-rose-600/20">
                {donor.blood_group}
              </span>
              <button type="button" onClick={reset} className="btn-ghost btn-sm">
                Switch profile
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge bg-slate-50 text-slate-600 ring-1 ring-slate-200">
              <DropletIcon className="size-3" />
              {AVAILABILITY_LABEL[donor.availability]}
            </span>
            <span className="badge bg-slate-50 text-slate-600 ring-1 ring-slate-200">
              <ClockIcon className="size-3" />
              {donor.last_donation_date
                ? `Last donated ${donor.last_donation_date}`
                : "Donation history not stated"}
            </span>
          </div>

          {donor.status === "pending" ? (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900 ring-1 ring-amber-200">
              <ClockIcon className="mt-0.5 size-4 shrink-0" />
              Your listing is waiting for review. You can still see open
              requests below while an administrator checks the profile.
            </p>
          ) : null}
          {donor.status === "deactivated" ? (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-600 ring-1 ring-slate-200">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              This listing is currently inactive and hidden from public search.
              Ask an administrator to reactivate it.
            </p>
          ) : null}

          <RequestGroup
            title="Sent to you"
            hint="Requests that selected your profile directly."
            requests={sentToMe}
            empty="No one has sent you a direct request yet."
          />

          <RequestGroup
            title="Nearby matches"
            hint="Open requests in your city that your blood group can support."
            requests={nearby}
            empty="No open requests in your city match your group right now."
          />

          <RequestGroup
            title="Other matches"
            hint="Open requests elsewhere that your blood group can support."
            requests={other}
            empty="Nothing else is waiting in the network today."
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              Contacting a requester is your choice. LifeLink does not confirm
              eligibility, availability or suitability. Final checks belong with
              the hospital or licensed blood bank.
            </p>
            <Link href="/safety" className="btn-secondary btn-sm">
              Safety notes
            </Link>
          </div>
        </div>
      )}

      {looked && !donor ? (
        <div className="border-t border-slate-200 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:px-7">
          Tip: sample profiles use addresses like{" "}
          <span className="font-mono">priya.nair@example.com</span>. Every donor
          in the demo directory follows the same pattern.
        </div>
      ) : null}
    </div>
  );
}

function RequestGroup({
  title,
  hint,
  requests,
  empty,
}: {
  title: string;
  hint: string;
  requests: BloodRequest[];
  empty: string;
}) {
  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <span className="text-xs text-slate-500">{requests.length}</span>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>

      {requests.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500">
          {empty}
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {requests.map((request) => {
            const email =
              request.requester_email || sampleEmail(request.requester_name);
            const subject = encodeURIComponent(
              `LifeLink request ${request.reference_code}`,
            );
            const body = encodeURIComponent(
              `Hello ${request.requester_name},\n\nI saw your request for ${request.blood_group} at ${request.hospital} on LifeLink. I would like to help. Please let me know the next step.\n\nReference: ${request.reference_code}\n`,
            );
            return (
              <li key={request.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid place-items-center rounded-lg bg-rose-600 px-2 py-1 text-sm font-bold text-white">
                        {request.blood_group}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {request.units} unit{request.units === 1 ? "" : "s"} ·{" "}
                        {request.hospital}
                      </span>
                      <span className={`badge ${URGENCY_STYLE[request.urgency]}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="font-mono text-slate-600">
                        {request.reference_code}
                      </span>
                      <span>·</span>
                      <span>
                        {request.area ? `${request.area}, ` : ""}
                        {request.city}
                      </span>
                      <span>·</span>
                      <span>{request.status}</span>
                      <span>·</span>
                      <span>{timeAgo(request.created_at)}</span>
                    </p>
                  </div>
                  <a
                    href={`mailto:${email}?subject=${subject}&body=${body}`}
                    className="btn-secondary btn-sm shrink-0"
                  >
                    Open email app
                  </a>
                </div>
                <RequesterContact
                  name={request.requester_name}
                  email={email}
                />
                {request.message ? (
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
                    {request.message}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function RequesterContact({ name, email }: { name: string; email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    let ok = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        ok = true;
      }
    } catch {
      // Clipboard API can be blocked; fall back to the older selection method.
    }

    if (!ok) {
      try {
        const input = document.createElement("textarea");
        input.value = email;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.top = "0";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, email.length);
        ok = document.execCommand("copy");
        input.remove();
      } catch {
        ok = false;
      }
    }

    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-rose-50/70 px-3 py-2.5 ring-1 ring-rose-100">
      <div className="min-w-0">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-rose-700/80">
          Requester email · {name}
        </p>
        <p className="mt-0.5 select-all break-all font-mono text-sm font-semibold text-rose-900">
          {email}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="btn-secondary btn-sm shrink-0"
      >
        {copied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
        {copied ? "Copied" : "Copy email"}
      </button>
    </div>
  );
}
