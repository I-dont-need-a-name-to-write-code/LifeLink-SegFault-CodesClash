"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/types";
import { DropletIcon, SearchIcon } from "./icons";

export default function HeroSearch() {
  const router = useRouter();
  const [group, setGroup] = useState<BloodGroup | "">("O+");
  const [city, setCity] = useState("");

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (group) params.set("group", group);
    if (city.trim()) params.set("city", city.trim());
    const query = params.toString();
    router.push(query ? `/donors?${query}` : "/donors");
  }

  return (
    <form onSubmit={search} className="card mt-7 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[0.85fr_1.3fr_auto] sm:items-end">
        <div>
          <label className="label" htmlFor="hero-group">
            Blood group needed
          </label>
          <select
            id="hero-group"
            className="input"
            value={group}
            onChange={(event) => setGroup(event.target.value as BloodGroup | "")}
          >
            <option value="">Any group</option>
            {BLOOD_GROUPS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="hero-city">
            City, area or PIN code
          </label>
          <input
            id="hero-city"
            className="input"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Mumbai or 400058"
          />
        </div>
        <button type="submit" className="btn-primary h-[42px] sm:min-w-32">
          <SearchIcon className="size-4" />
          Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-slate-500">
          Quick pick:
        </span>
        {(["O-", "O+", "A+", "B+", "AB-"] as BloodGroup[]).map((item) => (
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
            <DropletIcon className="size-3" />
            {item}
          </button>
        ))}
      </div>
    </form>
  );
}
