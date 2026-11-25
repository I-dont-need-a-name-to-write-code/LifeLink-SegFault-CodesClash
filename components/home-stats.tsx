"use client";

import { useEffect, useState } from "react";
import { computeStats, listDonors, listRequests } from "@/lib/store";
import type { DirectoryStats } from "@/lib/store";
import { PinIcon, UsersIcon, HeartPulseIcon, CheckIcon } from "./icons";

const initial: DirectoryStats = {
  approvedDonors: 0,
  pendingDonors: 0,
  cities: 0,
  openRequests: 0,
  fulfilledRequests: 0,
};

export default function HomeStats() {
  const [stats, setStats] = useState<DirectoryStats>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [donors, requests] = await Promise.all([listDonors(), listRequests()]);
      if (cancelled) return;
      setStats(computeStats(donors, requests));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    {
      label: "Sample donors listed",
      value: stats.approvedDonors,
      icon: UsersIcon,
    },
    { label: "Cities covered", value: stats.cities, icon: PinIcon },
    {
      label: "Open blood requests",
      value: stats.openRequests,
      icon: HeartPulseIcon,
    },
    {
      label: "Requests marked fulfilled",
      value: stats.fulfilledRequests,
      icon: CheckIcon,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="card p-4 sm:p-5">
            <item.icon className="size-5 text-rose-600" />
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {ready ? item.value : "–"}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>
      {ready ? (
        <p className="mt-3 text-xs text-slate-500">
          Counts reflect the profiles and requests currently in the directory.
        </p>
      ) : null}
    </div>
  );
}
