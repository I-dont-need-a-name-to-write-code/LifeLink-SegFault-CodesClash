import Link from "next/link";
import { AlertIcon, DropletIcon } from "./icons";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-rose-600 text-white">
              <DropletIcon className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              LifeLink
            </span>
          </div>
          <p className="muted mt-4 max-w-sm">
            A blood donor directory for finding matching profiles by group and
            area, sending requests and tracking them. Built for the CodesClash
            2026 preliminary round.
          </p>
          <p className="mt-4 text-xs font-medium text-slate-500">
            All profiles, names and locations shown are fictional sample data.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link className="hover:text-rose-700" href="/donors">
                Search the donor directory
              </Link>
            </li>
            <li>
              <Link className="hover:text-rose-700" href="/register">
                Register as a donor
              </Link>
            </li>
            <li>
              <Link className="hover:text-rose-700" href="/requests">
                Raise a blood request
              </Link>
            </li>
            <li>
              <Link className="hover:text-rose-700" href="/track">
                Track a request
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            In a real emergency
          </h3>
          <div className="mt-3 flex gap-3 rounded-xl bg-amber-50 p-3.5 ring-1 ring-amber-200">
            <AlertIcon className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <p className="text-xs leading-relaxed text-amber-900">
              Contact the nearest hospital or licensed blood bank first. This
              site does not confirm medical eligibility, availability or
              suitability of any donor.
            </p>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Emergency helpline in India: <strong>108</strong>
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © 2026 LifeLink · Team seg-fault · Prototype for academic
            demonstration
          </p>
          <p>Not a medical service · Data must be independently verified</p>
        </div>
      </div>
    </footer>
  );
}
