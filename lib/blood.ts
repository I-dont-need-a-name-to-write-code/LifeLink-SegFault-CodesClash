import type { Availability, BloodGroup, Donor, Urgency } from "./types";

/**
 * Who can receive blood from a given donor group.
 * Source: standard ABO/Rh compatibility chart.
 */
const DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

export function canDonateTo(donor: BloodGroup): BloodGroup[] {
  return DONATE_TO[donor];
}

/** Donor groups that are safe for a patient who needs `patient`. */
export function compatibleDonorGroups(patient: BloodGroup): BloodGroup[] {
  return (Object.keys(DONATE_TO) as BloodGroup[]).filter((group) =>
    DONATE_TO[group].includes(patient),
  );
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Open to contact",
  unavailable: "Not available now",
  unknown: "Availability not stated",
};

export const URGENCY_STYLE: Record<Urgency, string> = {
  Critical: "bg-rose-600 text-white",
  Urgent: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  Routine: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export function donorMatches(
  donor: Donor,
  options: {
    group?: BloodGroup | "";
    includeCompatible?: boolean;
    city?: string;
    pincode?: string;
    availableOnly?: boolean;
  },
): boolean {
  const { group, includeCompatible, city, pincode, availableOnly } = options;

  if (group) {
    const allowed = includeCompatible
      ? compatibleDonorGroups(group)
      : [group];
    if (!allowed.includes(donor.blood_group)) return false;
  }

  if (city && city.trim()) {
    const needle = city.trim().toLowerCase();
    const haystack = `${donor.city} ${donor.area}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  if (pincode && pincode.trim()) {
    if (!donor.pincode.startsWith(pincode.trim())) return false;
  }

  if (availableOnly && donor.availability !== "available") return false;

  return true;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export function monthsSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return Math.max(0, Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44)));
}
