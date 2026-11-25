import type { Metadata } from "next";
import Link from "next/link";
import { AlertIcon, CheckIcon, ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Safety and privacy",
  description:
    "How LifeLink handles sample data, privacy, verification and medical safety.",
};

const rules = [
  {
    title: "Sample data only",
    body: "Every profile in this prototype is fictional. Names, areas and PIN codes are invented, and no real person is represented. Do not add real phone numbers, addresses or medical information.",
  },
  {
    title: "No medical claims",
    body: "A listing does not mean the person is medically eligible, available right now or a confirmed match. Eligibility is decided by a qualified medical professional at the time of donation.",
  },
  {
    title: "Hospitals lead the process",
    body: "LifeLink does not replace hospitals, licensed blood banks or medical professionals. Any real donor contact, screening and transfusion must be arranged and verified through appropriate channels.",
  },
  {
    title: "Limited profile visibility",
    body: "Public search shows a display name, blood group, general area, PIN code and an availability preference. Contact happens through a request, not by publishing personal contact details.",
  },
  {
    title: "Admin moderation",
    body: "New listings start as pending and only appear after an administrator approves them. Listings can be deactivated or removed if they break the sample-data rules.",
  },
  {
    title: "Verify independently",
    body: "Requesters should confirm every detail with the hospital or blood bank. A reference code tracks a request; it does not certify a donor or a match.",
  },
];

export default function SafetyPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
          Trust and safety
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Safety and privacy rules
        </h1>
        <p className="muted mt-3">
          A donor directory is useful only if people trust it. These are the rules
          this prototype is built around, and the limits you should keep in mind
          while using it.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {rules.map((rule) => (
          <section key={rule.title} className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <ShieldIcon className="size-5 text-rose-600" />
              {rule.title}
            </h2>
            <p className="muted mt-2">{rule.body}</p>
          </section>
        ))}
      </div>

      <section className="card mt-6 border-rose-200 bg-rose-50/60 p-5 sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-bold text-rose-900">
          <AlertIcon className="size-5 text-rose-600" />
          In a real emergency
        </h2>
        <div className="mt-3 grid gap-4 text-sm leading-relaxed text-rose-900/85 sm:grid-cols-2">
          <p>
            Contact the nearest hospital or licensed blood bank first. They can
            cross-match blood, check eligibility and arrange a safe transfusion.
            Do not delay medical care to wait for a reply through this site.
          </p>
          <div>
            <p className="font-semibold text-rose-900">Emergency helpline in India</p>
            <p className="mt-1 text-2xl font-bold text-rose-700">108</p>
            <p className="mt-2 text-xs">
              Numbers vary by region and country. Use the official emergency
              number where you are.
            </p>
          </div>
        </div>
      </section>

      <section className="card mt-6 p-5 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">
          What is simulated in this prototype
        </h2>
        <ul className="mt-3 grid gap-2.5 text-sm text-slate-600 sm:grid-cols-2">
          {[
            "All donor profiles and requests are sample data.",
            "The admin passcode is a shared demo gate, not real authentication.",
            "No SMS, email or push notifications are sent.",
            "Request statuses are updated manually by the admin team.",
            "Requests can be tracked with a reference code, but no alert is sent to a real blood bank.",
            "Donor eligibility, identity and availability are never verified.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/donors" className="btn-primary">
            Search the directory
          </Link>
          <Link href="/requests" className="btn-secondary">
            Raise a request
          </Link>
        </div>
      </section>
    </div>
  );
}
