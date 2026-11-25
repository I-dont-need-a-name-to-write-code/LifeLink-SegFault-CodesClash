import Link from "next/link";
import { ArrowRightIcon, DropletIcon, SearchIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
        <DropletIcon className="size-7" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-rose-600">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        This page is not in the directory
      </h1>
      <p className="muted mt-3 max-w-md">
        The link may be old or mistyped. You can go back to the home page or
        search the donor directory instead.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to home
          <ArrowRightIcon className="size-4" />
        </Link>
        <Link href="/donors" className="btn-secondary">
          <SearchIcon className="size-4" />
          Find donors
        </Link>
      </div>
    </div>
  );
}
