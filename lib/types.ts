export const BLOOD_GROUPS = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export type Availability = "available" | "unavailable" | "unknown";

export type DonorStatus = "pending" | "approved" | "deactivated";

export type RequestStatus =
  | "Submitted"
  | "In Review"
  | "Donors Contacted"
  | "Fulfilled"
  | "Closed";

export const REQUEST_STATUSES: RequestStatus[] = [
  "Submitted",
  "In Review",
  "Donors Contacted",
  "Fulfilled",
  "Closed",
];

export type Urgency = "Routine" | "Urgent" | "Critical";

export interface Donor {
  id: string;
  display_name: string;
  email: string;
  blood_group: BloodGroup;
  city: string;
  area: string;
  pincode: string;
  availability: Availability;
  last_donation_date: string | null;
  contact_preference: string;
  note: string | null;
  status: DonorStatus;
  created_at: string;
}

export interface BloodRequest {
  id: string;
  reference_code: string;
  requester_name: string;
  requester_email: string;
  patient_name: string | null;
  blood_group: BloodGroup;
  units: number;
  hospital: string;
  city: string;
  area: string;
  pincode: string;
  urgency: Urgency;
  contact_note: string | null;
  message: string | null;
  status: RequestStatus;
  donor_id: string | null;
  created_at: string;
}

export interface DonorInput {
  display_name: string;
  email: string;
  blood_group: BloodGroup;
  city: string;
  area: string;
  pincode: string;
  availability: Availability;
  last_donation_date: string | null;
  contact_preference: string;
  note: string | null;
}

export interface RequestInput {
  requester_name: string;
  requester_email: string;
  patient_name: string | null;
  blood_group: BloodGroup;
  units: number;
  hospital: string;
  city: string;
  area: string;
  pincode: string;
  urgency: Urgency;
  contact_note: string | null;
  message: string | null;
  donor_id: string | null;
}

export interface InterestInput {
  request_id: string;
  helper_name: string;
  area: string;
  note: string | null;
}

export interface DonorInterest extends InterestInput {
  id: string;
  created_at: string;
}

export type DataSource = "supabase" | "demo";
