import Link from "next/link";
import HeroSearch from "@/components/hero-search";
import HomeStats from "@/components/home-stats";
import { OpenRequests } from "@/components/open-requests";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  DropletIcon,
  HeartPulseIcon,
  PinIcon,
  SearchIcon,
  ShieldIcon,
  SparkIcon,
  UsersIcon,
} from "@/components/icons";
import { canDonateTo } from "@/lib/blood";
import { BLOOD_GROUPS } from "@/lib/types";

const steps = [
  {
    title: "Search by group and area",
    body: "Pick the blood group the patient needs and add a city, locality or PIN code. LifeLink also shows compatible donor groups, not just exact matches.",
    icon: SearchIcon,
  },
  {
    title: "Send a request",
    body: "Choose a listing and submit a short request. A reference code is generated instantly, and no personal contact details are published.",
    icon: HeartPulseIcon,
  },
  {
    title: "Coordinate and track",
    body: "The admin team reviews the request, records donors who offer help and updates the status until the hospital confirms the arrangement.",
    icon: ClockIcon,
  },
];

const features = [
  {
    title: "Search by compatibility",
    body: "A patient with A+ can receive from A+, A−, O+ and O−. LifeLink checks the standard ABO/Rh chart instead of matching one group only.",
    icon: DropletIcon,
  },
  {
    title: "Every listing is reviewed",
    body: "New profiles start as pending. An administrator approves, deactivates or removes a listing before it appears in public search.",
    icon: ShieldIcon,
  },
  {
    title: "Only the details that matter",
    body: "Profiles show a display name, general area and availability preference. Conversations start with a request, not a published phone number.",
    icon: UsersIcon,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-page grid items-start gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="animate-rise">
            <span className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-200">
              <SparkIcon className="size-3.5" />
              CodesClash 2026 · Problem 02
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Find the right blood donor,{" "}
              <span className="text-rose-600">close to home.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Blood requests often start with a round of phone calls and
              outdated contact lists. LifeLink keeps reviewed donor profiles,
              requests and status updates in one searchable place.
            </p>

            <HeroSearch />

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-4 text-emerald-600" />
                Fictional sample data only
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-4 text-emerald-600" />
                No phone numbers published
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-4 text-emerald-600" />
                Works on mobile
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mt-6">
            <div className="absolute -left-8 top-4 size-32 rounded-full bg-rose-200/40 blur-3xl" />
            <div className="absolute -right-6 bottom-10 size-40 rounded-full bg-amber-200/40 blur-3xl" />

            <article className="card relative p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Open to contact
                </span>
                <span className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-400">
                  Sample profile
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 text-sm font-bold text-rose-700 ring-1 ring-rose-100">
                  AM
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    Aarav Mehta
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                    <PinIcon className="size-3.5" />
                    Andheri West, Mumbai · 400058
                  </p>
                </div>
                <span className="rounded-xl bg-rose-600 px-2.5 py-1.5 text-sm font-bold text-white">
                  O−
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
                    Last donation
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    5 months ago
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
                    Can donate to
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    All 8 groups
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-rose-50/80 px-3.5 py-3 text-xs leading-relaxed text-rose-900 ring-1 ring-rose-100">
                O− red cells are compatible with every blood group, which makes
                these donors important in emergencies.
              </p>
            </article>

            <article className="card relative mt-4 ml-auto w-full p-4 sm:w-[94%] sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Urgent request · 20 min ago
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    2 units of A+ · City General Hospital
                  </p>
                  <p className="text-xs text-slate-500">
                    Andheri East, Mumbai · Ref LL-7K2M4Q
                  </p>
                </div>
                <span className="badge bg-rose-600 text-white">Critical</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700">
                <CheckIcon className="size-3.5" />
                Status: donors contacted
              </div>
            </article>

            <p className="mt-4 text-center text-[0.7rem] text-slate-400">
              Illustration using fictional sample profiles
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pb-4">
        <HomeStats />
      </section>

      <section className="container-page py-14">
        <div className="max-w-2xl">
          <h2 className="section-title">How it works</h2>
          <p className="muted mt-2">
            A requester searches, sends a request, and the review team follows
            up. Donors can register or offer help at any point.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                  <step.icon className="size-5" />
                </span>
                <span className="text-3xl font-bold text-slate-200">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="muted mt-2">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-6">
        <OpenRequests limit={2} />
      </section>

      <section className="container-page py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-slate-900 text-white">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="muted mt-2">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-6">
        <div className="card grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="section-title">Who can donate to whom?</h2>
            <p className="muted mt-2">
              LifeLink uses the standard ABO and Rh compatibility chart. Search
              results include compatible groups by default, and you can switch
              to exact matches only.
            </p>
            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
              <strong>Safety note:</strong> compatibility is a guide, not a
              medical decision. Cross-matching and eligibility checks are done
              by a hospital or licensed blood bank.
            </div>
            <Link href="/donors" className="btn-primary mt-5">
              Open the directory
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Donor group</th>
                  <th className="px-4 py-3 font-semibold">Can donate to</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BLOOD_GROUPS.map((group) => (
                  <tr key={group} className="bg-white">
                    <td className="px-4 py-2.5">
                      <span className="inline-flex min-w-10 justify-center rounded-lg bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                        {group}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {canDonateTo(group).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Add your profile to the directory
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Registration takes under a minute. The review team checks each
                listing, and you only share a general area. Your phone number is
                never published, and you can set how you want to be approached.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="btn bg-white text-slate-900 hover:bg-slate-100"
                >
                  Register as a donor
                  <ArrowRightIcon className="size-4" />
                </Link>
                <Link
                  href="/safety"
                  className="btn border border-white/25 text-white hover:bg-white/10"
                >
                  Read the safety rules
                </Link>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                "Fictional or sample data only",
                "Admin approval before a listing goes live",
                "Requests tracked with a reference code",
                "No claim of medical eligibility",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
