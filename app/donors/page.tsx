import type { Metadata } from "next";
import Link from "next/link";
import DonorDirectory from "@/components/donor-directory";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Find donors",
  description:
    "Search fictional donor profiles by blood group, city, locality or PIN code.",
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

function first(value?: string | string[]): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
            Donor directory
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find a donor by group and area
          </h1>
          <p className="muted mt-3">
            Filter approved sample profiles by blood group, city, locality or PIN
            code. Compatible groups are included by default, so an O− donor can
            appear for a patient who needs A+.
          </p>
        </div>
        <Link href="/register" className="btn-secondary">
          Add your profile
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="mt-8">
        <DonorDirectory
          initialGroup={first(params.group)}
          initialCity={first(params.city)}
          initialPincode={first(params.pincode)}
        />
      </div>
    </div>
  );
}
