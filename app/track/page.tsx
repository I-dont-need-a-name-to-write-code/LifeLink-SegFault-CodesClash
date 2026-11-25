import type { Metadata } from "next";
import TrackLookup from "@/components/track-lookup";
import { ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Track a request",
  description: "Check the status of a blood request using its reference code.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value?: string | string[]): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
          Request tracking
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Where is my request?
        </h1>
        <p className="muted mt-3">
          Enter the reference code you received after submitting a request. Try{" "}
          <span className="font-mono font-semibold text-slate-700">LL-7K2M4Q</span>{" "}
          to see a sample in progress.
        </p>
      </div>

      <div className="mt-8 max-w-2xl">
        <TrackLookup initialCode={first(params.code)} />

        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
          <ShieldIcon className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <p>
            Status labels are part of the prototype workflow. They are updated by
            the admin team and do not represent a clinical confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
