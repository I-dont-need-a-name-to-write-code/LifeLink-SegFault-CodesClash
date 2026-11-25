import type { Metadata } from "next";
import RegisterForm from "@/components/register-form";
import { CheckIcon, ShieldIcon, UsersIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Become a donor",
  description:
    "Register a fictional donor profile with your blood group, general area and availability preference.",
};

export default function RegisterPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
          Donor registration
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Add your sample profile
        </h1>
        <p className="muted mt-3">
          Registration takes about a minute. Only a display name, blood group and
          general area are needed. No phone numbers or medical details.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <RegisterForm />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <UsersIcon className="size-5 text-rose-600" />
              Why join the directory?
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              {[
                "Requesters can find you by group and nearby area.",
                "You set an availability preference, so interest is not assumed.",
                "Profile details stay limited to what you choose to share.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-rose-50/60 p-5 ring-rose-100">
            <h2 className="flex items-center gap-2 font-semibold text-rose-900">
              <ShieldIcon className="size-5 text-rose-600" />
              Before you submit
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-rose-900/80">
              <li>Use fictional or sample data in this prototype.</li>
              <li>Never publish phone numbers, addresses or reports.</li>
              <li>
                A listing is not a claim that you are medically eligible or
                available right now.
              </li>
              <li>
                Real donations are arranged and screened by hospitals and
                licensed blood banks.
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-900">Review process</h2>
            <p className="muted mt-2">
              Every submission starts as <strong>pending</strong>. An
              administrator approves it, keeps it back for correction or
              deactivates it later. You can see the public directory at any time.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
