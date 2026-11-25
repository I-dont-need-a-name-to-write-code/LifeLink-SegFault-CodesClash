-- =====================================================================
-- LifeLink — Blood Donor Network
-- Supabase schema for the CodesClash 2026 preliminary prototype.
--
-- Paste this whole file into Supabase → SQL Editor → Run.
-- It creates the three tables used by the app, adds indexes and demo rows.
--
-- Row Level Security note:
--   The prototype uses the public anon key from the browser, including for
--   the demo admin screen. The policies below therefore allow anonymous
--   read/write access. This is fine for fictional sample data in a
--   hackathon demo, but is NOT safe for real personal data. A production
--   build should move moderation behind authenticated server routes (or a
--   service-role key kept on the server).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. Donors
-- ---------------------------------------------------------------------
create table if not exists public.donors (
  id                 uuid primary key default gen_random_uuid(),
  display_name       text        not null,
  email              text        not null default '',
  blood_group        text        not null
                       check (blood_group in ('O-','O+','A-','A+','B-','B+','AB-','AB+')),
  city               text        not null,
  area               text        not null default '',
  pincode            text        not null default '',
  availability       text        not null default 'unknown'
                       check (availability in ('available','unavailable','unknown')),
  last_donation_date date,
  contact_preference text        not null default 'Request form only',
  note               text,
  status             text        not null default 'pending'
                       check (status in ('pending','approved','deactivated')),
  created_at         timestamptz not null default now()
);

create index if not exists donors_status_idx on public.donors (status);
create index if not exists donors_group_city_idx on public.donors (blood_group, city);
create index if not exists donors_email_idx on public.donors (lower(email));

-- ---------------------------------------------------------------------
-- 2. Blood requests
-- ---------------------------------------------------------------------
create table if not exists public.blood_requests (
  id              uuid primary key default gen_random_uuid(),
  reference_code  text        not null unique,
  requester_name  text        not null,
  requester_email text        not null default '',
  patient_name    text,
  blood_group     text        not null
                    check (blood_group in ('O-','O+','A-','A+','B-','B+','AB-','AB+')),
  units           integer     not null default 1 check (units between 1 and 10),
  hospital        text        not null,
  city            text        not null,
  area            text        not null default '',
  pincode         text        not null default '',
  urgency         text        not null default 'Routine'
                    check (urgency in ('Routine','Urgent','Critical')),
  contact_note    text,
  message         text,
  status          text        not null default 'Submitted'
                    check (status in ('Submitted','In Review','Donors Contacted','Fulfilled','Closed')),
  donor_id        uuid        references public.donors (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists blood_requests_status_idx on public.blood_requests (status);
create index if not exists blood_requests_created_idx on public.blood_requests (created_at desc);
create index if not exists blood_requests_donor_idx on public.blood_requests (donor_id);

-- ---------------------------------------------------------------------
-- 3. Offers to help ("I can help" on a request)
-- ---------------------------------------------------------------------
create table if not exists public.request_interests (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid        not null references public.blood_requests (id) on delete cascade,
  helper_name text        not null,
  area        text        not null default '',
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists request_interests_request_idx
  on public.request_interests (request_id);

-- ---------------------------------------------------------------------
-- 4. Row Level Security (prototype policies)
-- ---------------------------------------------------------------------
alter table public.donors            enable row level security;
alter table public.blood_requests    enable row level security;
alter table public.request_interests enable row level security;

drop policy if exists "proto donors read"   on public.donors;
drop policy if exists "proto donors write"  on public.donors;
drop policy if exists "proto requests read" on public.blood_requests;
drop policy if exists "proto requests write" on public.blood_requests;
drop policy if exists "proto interests read"  on public.request_interests;
drop policy if exists "proto interests write" on public.request_interests;

create policy "proto donors read"
  on public.donors for select
  to anon, authenticated
  using (true);

create policy "proto donors write"
  on public.donors for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "proto requests read"
  on public.blood_requests for select
  to anon, authenticated
  using (true);

create policy "proto requests write"
  on public.blood_requests for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "proto interests read"
  on public.request_interests for select
  to anon, authenticated
  using (true);

create policy "proto interests write"
  on public.request_interests for all
  to anon, authenticated
  using (true)
  with check (true);

-- Explicit table grants (Supabase usually sets these by default).
grant select, insert, update, delete on public.donors            to anon, authenticated;
grant select, insert, update, delete on public.blood_requests    to anon, authenticated;
grant select, insert, update, delete on public.request_interests to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Demo data (all fictional — safe to delete)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from public.donors) then
    insert into public.donors
      (display_name, blood_group, city, area, pincode, availability,
       last_donation_date, contact_preference, note, status)
    values
  ('Aarav Mehta',      'O-',  'Mumbai',    'Andheri West',      '400058', 'available',   '2026-06-14', 'Request form only', 'Can travel within western suburbs on weekends.', 'approved'),
  ('Priya Nair',       'A+',  'Mumbai',    'Powai',             '400076', 'available',   '2026-08-02', 'Request form only', 'Prefers nearby hospitals in the eastern suburbs.', 'approved'),
  ('Rohan Kulkarni',   'B+',  'Pune',      'Kothrud',           '411038', 'available',   '2026-05-21', 'Request form only', null, 'approved'),
  ('Sana Shaikh',      'AB+', 'Mumbai',    'Bandra East',       '400051', 'unknown',      null,         'Request form only', 'First-time donor, availability to be confirmed.', 'approved'),
  ('Vikram Rathore',   'O+',  'Nagpur',    'Dharampeth',        '440010', 'available',   '2026-09-11', 'Request form only', null, 'approved'),
  ('Meera Iyer',       'A-',  'Bengaluru', 'Indiranagar',       '560038', 'available',   '2026-07-19', 'Request form only', 'Works near MG Road, can reach city hospitals quickly.', 'approved'),
  ('Aditya Verma',     'B-',  'Delhi',     'Dwarka Sector 12',  '110078', 'unavailable', '2026-10-05', 'Request form only', 'Travelling until end of November.', 'approved'),
  ('Ananya Deshpande', 'O+',  'Pune',      'Baner',             '411045', 'available',   '2026-04-30', 'Request form only', null, 'approved'),
  ('Imran Qureshi',    'AB-', 'Hyderabad', 'Banjara Hills',     '500034', 'available',   '2026-08-25', 'Request form only', 'Rare group. Please contact through the request form.', 'approved'),
  ('Neha Joshi',       'A+',  'Pune',      'Hadapsar',          '411028', 'available',   '2026-03-17', 'Request form only', null, 'approved'),
  ('Karthik Reddy',    'B+',  'Hyderabad', 'Gachibowli',        '500032', 'available',   '2026-06-08', 'Request form only', 'Available on weekday evenings.', 'approved'),
  ('Riya Banerjee',    'O+',  'Kolkata',   'Salt Lake Sector 2','700091', 'unknown',      null,         'Request form only', null, 'approved'),
  ('Arjun Menon',      'AB+', 'Bengaluru', 'Whitefield',        '560066', 'available',   '2026-07-01', 'Request form only', null, 'approved'),
  ('Pooja Patil',      'A-',  'Nagpur',    'Sadar',             '440001', 'available',   '2026-09-28', 'Request form only', null, 'approved'),
  ('Sahil Kapoor',     'O-',  'Delhi',     'Rohini Sector 9',   '110085', 'available',   '2026-02-12', 'Request form only', 'Universal donor. Can be reached for emergencies in north Delhi.', 'approved'),
  ('Tanvi Shah',       'B+',  'Mumbai',    'Dadar West',        '400028', 'available',   '2026-05-06', 'Request form only', null, 'approved'),
  ('Mohit Agarwal',    'AB+', 'Pune',      'Viman Nagar',       '411014', 'unavailable', '2026-11-02', 'Request form only', 'Recently donated, advised rest by doctor.', 'approved'),
  ('Ishita Ghosh',     'O+',  'Kolkata',   'Ballygunge',        '700019', 'available',   '2026-08-14', 'Request form only', null, 'approved'),
  ('Nikhil Bhat',      'A+',  'Bengaluru', 'Jayanagar',         '560041', 'available',   '2026-10-20', 'Request form only', null, 'approved'),
  ('Divya Saxena',     'B-',  'Delhi',     'Lajpat Nagar',      '110024', 'available',   '2026-06-23', 'Request form only', null, 'approved'),
  ('Harsh Vardhan',    'O+',  'Nagpur',    'Manish Nagar',      '440015', 'available',   '2026-04-09', 'Request form only', null, 'approved'),
  ('Farah Khan',       'AB-', 'Mumbai',    'Kurla West',        '400070', 'available',   '2026-09-03', 'Request form only', null, 'approved'),
  ('Siddharth Rao',    'A+',  'Hyderabad', 'Kukatpally',        '500072', 'available',   '2026-07-27', 'Request form only', null, 'approved'),
  ('Sneha Pawar',      'B+',  'Pune',      'Kharadi',           '411014', 'available',   '2026-08-31', 'Request form only', null, 'approved'),
  ('Kunal Bansal',     'O+',  'Jaipur',    'Malviya Nagar',     '302017', 'available',   '2026-01-30', 'Request form only', 'New listing, waiting for review.', 'pending'),
  ('Aisha Rahman',     'A+',  'Lucknow',   'Gomti Nagar',       '226010', 'unknown',      null,         'Request form only', 'New listing, waiting for review.', 'pending'),
  ('Ravi Chauhan',     'AB+', 'Delhi',     'Karol Bagh',        '110005', 'available',   null,         'Request form only', 'Listing could not be verified.', 'deactivated');
  end if;
end
$$;

-- Every sample donor gets a fictional example.com email (no real addresses).
update public.donors
set email = regexp_replace(lower(display_name), '[^a-z0-9]+', '.', 'g')
            || '@example.com'
where email = '';

insert into public.blood_requests
  (reference_code, requester_name, patient_name, blood_group, units, hospital,
   city, area, pincode, urgency, contact_note, message, status, created_at)
values
  ('LL-7K2M4Q', 'Sunita Rao',      'Ramesh Rao',   'O-',  2, 'City General Hospital',      'Mumbai',    'Andheri East', '400069', 'Critical', 'Coordinator will call back through the hospital desk.', 'Surgery scheduled tomorrow morning. Hospital blood bank has limited O- units.', 'Donors Contacted', now() - interval '18 hours'),
  ('LL-9B1XCD', 'Prakash Jadhav',  null,           'B+',  1, 'Sunrise Multispeciality',    'Pune',      'Kothrud',      '411038', 'Urgent',   'Reception desk, ask for the attending physician.',      'Post-operative topping up requested by the treating doctor.', 'In Review', now() - interval '6 hours'),
  ('LL-3F8TRW', 'Neelam Gupta',    'Anil Gupta',   'A+',  1, 'LifeCare Blood Centre',      'Delhi',     'Saket',        '110017', 'Routine',  'Contact through the request form only.',                'Planned transfusion next week. Looking for nearby listed donors.', 'Submitted', now() - interval '3 hours'),
  ('LL-5H6NYP', 'Meghana Shetty',  'Lakshmi Shetty','AB-', 3, 'Nightingale Medical Centre', 'Bengaluru', 'Shivajinagar', '560051', 'Critical', 'Hospital coordinator available at the front desk.',     'Rare group shortage. Samples cross-matched at the hospital.', 'Fulfilled', now() - interval '4 days')
on conflict (reference_code) do nothing;

-- Every sample requester gets a fictional example.com email.
update public.blood_requests
set requester_email = regexp_replace(lower(requester_name), '[^a-z0-9]+', '.', 'g')
                     || '@example.com'
where requester_email = '';

-- ---------------------------------------------------------------------
-- Done. Open the app, then use /admin (default passcode: codesclash)
-- to approve the two pending demo listings.
-- ---------------------------------------------------------------------
