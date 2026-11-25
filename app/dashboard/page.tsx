import type { Metadata } from "next";
import DonorDashboard from "@/components/donor-dashboard";
import { ClockIcon, DropletIcon, ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Donor dashboard",
  description:
    "Sign in with your registered email to see blood requests that match your group and area.",
};

export default function DashboardPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
          Donor dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Requests waiting for you
        </h1>
        <p className="muted mt-3">
          Sign in with the email on your donor profile to see open requests near
          you, requests that picked your profile directly, and the requester&apos;s
          email address so you can reply if you choose.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <DonorDashboard />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <DropletIcon className="size-5 text-rose-600" />
              How requests reach you
            </h2>
            <ul className="mt-3 space-y-3">
              {[
                [
                  "Direct requests",
                  "A requester picked your profile and sent their details to you.",
                ],
                [
                  "Nearby matches",
                  "Open requests in your city where your group is compatible.",
                ],
                [
                  "Other matches",
                  "Compatible requests elsewhere, if you are able to travel.",
                ],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-rose-50 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <ClockIcon className="size-5 text-rose-600" />
              A quick reminder
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Only donate when it is safe for you. Eligibility is confirmed by a
              doctor or blood bank, never by this directory.
            </p>
          </div>

          <div className="card bg-amber-50 p-5 ring-amber-200">
            <h2 className="flex items-center gap-2 font-semibold text-amber-900">
              <ShieldIcon className="size-5 text-amber-700" />
              Privacy in this prototype
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
              Emails are visible only on this dashboard, not in the public
              directory. Sample data uses example.com addresses, so nothing is
              sent to a real person.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
