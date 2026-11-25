"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { compatibleDonorGroups, donorMatches } from "@/lib/blood";
import { listDonors } from "@/lib/store";
import { BLOOD_GROUPS, type BloodGroup, type Donor } from "@/lib/types";
import DonorCard from "./donor-card";
import { RequestDialog } from "./request-form";
import { DropletIcon, SearchIcon } from "./icons";

export default function DonorDirectory({
  initialGroup = "",
  initialCity = "",
  initialPincode = "",
}: {
  initialGroup?: string;
  initialCity?: string;
  initialPincode?: string;
}) {
  const router = useRouter();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<BloodGroup | "">(
    (BLOOD_GROUPS as readonly string[]).includes(initialGroup)
      ? (initialGroup as BloodGroup)
      : "",
  );
  const [city, setCity] = useState(initialCity);
  const [pincode, setPincode] = useState(initialPincode);
  const [compatible, setCompatible] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selected, setSelected] = useState<Donor | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listDonors({ status: "approved" });
        if (cancelled) return;
        setDonors(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (group) params.set("group", group);
    if (city.trim()) params.set("city", city.trim());
    if (pincode.trim()) params.set("pincode", pincode.trim());
    const query = params.toString();
    router.replace(query ? `/donors?${query}` : "/donors", { scroll: false });
  }, [group, city, pincode, router]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    donors.forEach((donor) => {
      map.set(donor.blood_group, (map.get(donor.blood_group) ?? 0) + 1);
    });
    return map;
  }, [donors]);

  const results = useMemo(() => {
    const filtered = donors.filter((donor) =>
      donorMatches(donor, {
        group,
        includeCompatible: compatible,
        city,
        pincode,
        availableOnly,
      }),
    );

    return filtered.sort((a, b) => {
      if (group) {
        const aExact = a.blood_group === group ? 0 : 1;
        const bExact = b.blood_group === group ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
      }
      const aAvailable = a.availability === "available" ? 0 : 1;
      const bAvailable = b.availability === "available" ? 0 : 1;
      if (aAvailable !== bAvailable) return aAvailable - bAvailable;
      return a.city.localeCompare(b.city);
    });
  }, [donors, group, compatible, city, pincode, availableOnly]);

  const compatibleGroups = group ? compatibleDonorGroups(group) : [];

  return (
    <div>
      <div className="card p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGroup("")}
            className={`badge cursor-pointer transition ${
              group === ""
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All groups · {donors.length}
          </button>
          {BLOOD_GROUPS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setGroup(item)}
              className={`badge cursor-pointer transition ${
                group === item
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item} · {counts.get(item) ?? 0}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.9fr_auto]">
          <div>
            <label className="label" htmlFor="search-city">
              City or locality
            </label>
            <input
              id="search-city"
              className="input"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="e.g. Mumbai, Andheri"
            />
          </div>
          <div>
            <label className="label" htmlFor="search-pincode">
              PIN code
            </label>
            <input
              id="search-pincode"
              className="input"
              value={pincode}
              onChange={(event) =>
                setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Starts with..."
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="label" htmlFor="search-group">
              Blood group
            </label>
            <select
              id="search-group"
              className="input"
              value={group}
              onChange={(event) =>
                setGroup(event.target.value as BloodGroup | "")
              }
            >
              <option value="">Any group</option>
              {BLOOD_GROUPS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 pb-0.5">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="size-4 accent-rose-600"
                checked={compatible}
                onChange={(event) => setCompatible(event.target.checked)}
              />
              Include compatible groups
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="size-4 accent-rose-600"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
              />
              Open to contact only
            </label>
          </div>
        </div>

        {group ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-rose-50/70 px-3.5 py-2.5 text-xs text-rose-900 ring-1 ring-rose-100">
            <DropletIcon className="size-4 text-rose-600" />
            <span className="font-semibold">
              A patient with {group} can receive from:
            </span>
            {compatibleGroups.map((item) => (
              <span
                key={item}
                className="rounded-md bg-white px-1.5 py-0.5 font-mono font-semibold text-rose-700 ring-1 ring-rose-200"
              >
                {item}
              </span>
            ))}
            <span className="text-rose-700/70">
              {compatible
                ? "Compatible donors are included below."
                : "Untick the filter to see only exact matches."}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {loading
              ? "Searching the directory..."
              : `${results.length} donor${results.length === 1 ? "" : "s"} found`}
          </h2>
          <p className="text-sm text-slate-500">
            {group ? `For ${group} blood` : "All approved listings"}
            {city.trim() ? ` · near ${city.trim()}` : ""}
            {pincode.trim() ? ` · PIN ${pincode.trim()}...` : ""}
          </p>
        </div>
        {(group || city.trim() || pincode.trim() || availableOnly) && (
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => {
              setGroup("");
              setCity("");
              setPincode("");
              setAvailableOnly(false);
              setCompatible(true);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="card h-48 animate-pulse bg-slate-100/70" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="card mt-5 flex flex-col items-center px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-slate-100 text-slate-500">
            <SearchIcon className="size-7" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No donors match these filters
          </h3>
          <p className="muted mt-1.5 max-w-md">
            Try a nearby city, a compatible blood group, or clear the filters. In
            a real emergency, contact the hospital blood bank directly.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setGroup("");
                setCity("");
                setPincode("");
                setAvailableOnly(false);
              }}
            >
              Clear filters
            </button>
            <a href="/requests" className="btn-primary">
              Raise a request
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((donor) => (
            <DonorCard
              key={donor.id}
              donor={donor}
              highlightGroup={group || undefined}
              onRequest={setSelected}
            />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-slate-500">
        Listings are self-declared sample profiles. LifeLink does not verify
        identity, medical eligibility or current availability. Always confirm
        through appropriate channels and let a hospital or licensed blood bank
        guide the actual arrangement.
      </p>

      <RequestDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `Request to ${selected.display_name}` : "Request blood"}
        defaults={
          selected
            ? {
                blood_group: selected.blood_group,
                city: selected.city,
                area: selected.area,
                pincode: selected.pincode,
                donorName: selected.display_name,
                donorId: selected.id,
              }
            : undefined
        }
      />
    </div>
  );
}
