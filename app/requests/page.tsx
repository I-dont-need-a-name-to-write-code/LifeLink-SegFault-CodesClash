import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";
import { OpenRequests } from "@/components/open-requests";
import { CheckIcon, ClockIcon, ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Request blood",
  description:
    "Raise a blood request against the sample directory and track it with a reference code.",
};

export default function RequestsPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
          Request desk
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Raise a blood request
        </h1>
        <p className="muted mt-3">
          Share the basics and LifeLink creates a reference code you can track.
          The admin team reviews requests and records donors who offer to help.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="card p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-slate-900">Request details</h2>
          <p className="muted mt-1 mb-5">
            Fields marked with an asterisk are required. Nothing here is sent to
            a real hospital in the prototype.
          </p>
          <RequestForm />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <ClockIcon className="size-5 text-rose-600" />
              What happens after submitting
            </h2>
            <ol className="mt-3 space-y-3">
              {[
                ["Submitted", "A reference code is created instantly."],
                ["In review", "An administrator checks the request details."],
                ["Donors contacted", "Matching donors and volunteers are reached."],
                ["Fulfilled", "The hospital confirms the arrangement."],
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
            </ol>
          </div>

          <div className="card bg-amber-50 p-5 ring-amber-200">
            <h2 className="flex items-center gap-2 font-semibold text-amber-900">
              <ShieldIcon className="size-5 text-amber-700" />
              Emergency reminder
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
              For an urgent transfusion, contact the hospital blood bank first.
              LifeLink lists sample profiles and cannot guarantee a donor, a
              match or a timeframe.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <CheckIcon className="size-3.5" />
              Emergency helpline in India: 108
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-14 border-t border-slate-200 pt-10">
        <OpenRequests showIntro showAllLink={false} />
      </div>
    </div>
  );
}
