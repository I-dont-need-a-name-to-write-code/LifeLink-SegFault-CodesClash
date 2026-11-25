"use client";

import { SEED_DONORS, SEED_REQUESTS } from "./seed";
import { supabase, isSupabaseConfigured } from "./supabase";
import type {
  BloodRequest,
  DataSource,
  Donor,
  DonorInput,
  DonorInterest,
  DonorStatus,
  InterestInput,
  RequestInput,
  RequestStatus,
} from "./types";

/**
 * Data layer.
 *
 * Primary backend: Supabase (tables created by `supabase/schema.sql`).
 * Fallback: browser-local demo store, so the prototype still works when the
 * backend is not configured or the tables have not been created yet.
 */

const DONORS_KEY = "lifelink.donors.v1";
const REQUESTS_KEY = "lifelink.requests.v1";
const INTERESTS_KEY = "lifelink.interests.v1";

let lastSource: DataSource = isSupabaseConfigured ? "supabase" : "demo";
let supabaseDisabled = false;

export function currentSource(): DataSource {
  return lastSource;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readLocal<T>(key: string, seed: T[]): T[] {
  if (!isBrowser()) return [...seed];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(seed));
      return [...seed];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [...seed];
  } catch {
    return [...seed];
  }
}

function writeLocal<T>(key: string, value: T[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private mode; the UI still works in memory.
  }
}

function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function makeReferenceCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LL-${code}`;
}

function isMissingBackend(error: { code?: string; message?: string }): boolean {
  const message = (error.message ?? "").toLowerCase();
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("failed to fetch") ||
    message.includes("invalid api key")
  );
}

function markDemo(): void {
  supabaseDisabled = true;
  lastSource = "demo";
}

/* ------------------------------- donors --------------------------------- */

export async function listDonors(options?: {
  status?: DonorStatus;
}): Promise<Donor[]> {
  const status = options?.status;

  if (supabase && !supabaseDisabled) {
    try {
      let query = supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false });
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return (data ?? []) as Donor[];
      }
    } catch {
      markDemo();
    }
  }

  const all = readLocal<Donor>(DONORS_KEY, SEED_DONORS);
  return status ? all.filter((donor) => donor.status === status) : all;
}

export async function createDonor(input: DonorInput): Promise<Donor> {
  const payload = { ...input, status: "pending" as DonorStatus };

  if (supabase && !supabaseDisabled) {
    try {
      const { data, error } = await supabase
        .from("donors")
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return data as Donor;
      }
    } catch {
      markDemo();
    }
  }

  const donor: Donor = {
    ...payload,
    id: localId("donor"),
    created_at: new Date().toISOString(),
  };
  const all = readLocal<Donor>(DONORS_KEY, SEED_DONORS);
  writeLocal(DONORS_KEY, [donor, ...all]);
  return donor;
}

export async function setDonorStatus(
  id: string,
  status: DonorStatus,
): Promise<void> {
  if (supabase && !supabaseDisabled) {
    try {
      const { error } = await supabase
        .from("donors")
        .update({ status })
        .eq("id", id);

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return;
      }
    } catch {
      markDemo();
    }
  }

  const all = readLocal<Donor>(DONORS_KEY, SEED_DONORS);
  writeLocal(
    DONORS_KEY,
    all.map((donor) => (donor.id === id ? { ...donor, status } : donor)),
  );
}

export async function deleteDonor(id: string): Promise<void> {
  if (supabase && !supabaseDisabled) {
    try {
      const { error } = await supabase.from("donors").delete().eq("id", id);
      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return;
      }
    } catch {
      markDemo();
    }
  }

  const all = readLocal<Donor>(DONORS_KEY, SEED_DONORS);
  writeLocal(
    DONORS_KEY,
    all.filter((donor) => donor.id !== id),
  );
}

/* ------------------------------ requests -------------------------------- */

export async function listRequests(): Promise<BloodRequest[]> {
  if (supabase && !supabaseDisabled) {
    try {
      const { data, error } = await supabase
        .from("blood_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return (data ?? []) as BloodRequest[];
      }
    } catch {
      markDemo();
    }
  }

  return readLocal<BloodRequest>(REQUESTS_KEY, SEED_REQUESTS);
}

export async function createRequest(
  input: RequestInput,
): Promise<BloodRequest> {
  const payload = {
    ...input,
    reference_code: makeReferenceCode(),
    status: "Submitted" as RequestStatus,
  };

  if (supabase && !supabaseDisabled) {
    try {
      const { data, error } = await supabase
        .from("blood_requests")
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return data as BloodRequest;
      }
    } catch {
      markDemo();
    }
  }

  const request: BloodRequest = {
    ...payload,
    id: localId("request"),
    created_at: new Date().toISOString(),
  };
  const all = readLocal<BloodRequest>(REQUESTS_KEY, SEED_REQUESTS);
  writeLocal(REQUESTS_KEY, [request, ...all]);
  return request;
}

export async function findRequestByCode(
  code: string,
): Promise<BloodRequest | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;

  if (supabase && !supabaseDisabled) {
    try {
      const { data, error } = await supabase
        .from("blood_requests")
        .select("*")
        .eq("reference_code", normalized)
        .maybeSingle();

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return (data as BloodRequest | null) ?? null;
      }
    } catch {
      markDemo();
    }
  }

  const all = readLocal<BloodRequest>(REQUESTS_KEY, SEED_REQUESTS);
  return all.find((request) => request.reference_code === normalized) ?? null;
}

export async function setRequestStatus(
  id: string,
  status: RequestStatus,
): Promise<void> {
  if (supabase && !supabaseDisabled) {
    try {
      const { error } = await supabase
        .from("blood_requests")
        .update({ status })
        .eq("id", id);

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return;
      }
    } catch {
      markDemo();
    }
  }

  const all = readLocal<BloodRequest>(REQUESTS_KEY, SEED_REQUESTS);
  writeLocal(
    REQUESTS_KEY,
    all.map((request) =>
      request.id === id ? { ...request, status } : request,
    ),
  );
}

export async function updateRequestFields(
  id: string,
  patch: Partial<Pick<BloodRequest, "donor_id" | "contact_note" | "status">>,
): Promise<void> {
  if (supabase && !supabaseDisabled) {
    try {
      const { error } = await supabase
        .from("blood_requests")
        .update(patch)
        .eq("id", id);

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return;
      }
    } catch {
      markDemo();
    }
  }

  const all = readLocal<BloodRequest>(REQUESTS_KEY, SEED_REQUESTS);
  writeLocal(
    REQUESTS_KEY,
    all.map((request) =>
      request.id === id ? { ...request, ...patch } : request,
    ),
  );
}

/* ------------------------------- interests ------------------------------- */

export async function createInterest(
  input: InterestInput,
): Promise<DonorInterest> {
  if (supabase && !supabaseDisabled) {
    try {
      const { data, error } = await supabase
        .from("request_interests")
        .insert(input)
        .select()
        .single();

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return data as DonorInterest;
      }
    } catch {
      markDemo();
    }
  }

  const interest: DonorInterest = {
    ...input,
    id: localId("interest"),
    created_at: new Date().toISOString(),
  };
  const all = readLocal<DonorInterest>(INTERESTS_KEY, []);
  writeLocal(INTERESTS_KEY, [interest, ...all]);
  return interest;
}

export async function listInterests(): Promise<DonorInterest[]> {
  if (supabase && !supabaseDisabled) {
    try {
      const { data, error } = await supabase
        .from("request_interests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (isMissingBackend(error)) markDemo();
        else throw new Error(error.message);
      } else {
        lastSource = "supabase";
        return (data ?? []) as DonorInterest[];
      }
    } catch {
      markDemo();
    }
  }

  return readLocal<DonorInterest>(INTERESTS_KEY, []);
}

/* -------------------------------- stats --------------------------------- */

export interface DirectoryStats {
  approvedDonors: number;
  pendingDonors: number;
  cities: number;
  openRequests: number;
  fulfilledRequests: number;
}

export function computeStats(
  donors: Donor[],
  requests: BloodRequest[],
): DirectoryStats {
  const approved = donors.filter((donor) => donor.status === "approved");
  const cities = new Set(approved.map((donor) => donor.city.toLowerCase()));
  const open = requests.filter(
    (request) =>
      request.status !== "Fulfilled" && request.status !== "Closed",
  );

  return {
    approvedDonors: approved.length,
    pendingDonors: donors.filter((donor) => donor.status === "pending").length,
    cities: cities.size,
    openRequests: open.length,
    fulfilledRequests: requests.filter(
      (request) => request.status === "Fulfilled",
    ).length,
  };
}
