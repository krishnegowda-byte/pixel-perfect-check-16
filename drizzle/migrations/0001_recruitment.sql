
-- Recruitment system: job listings and applications

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  location text NOT NULL,
  employment_type text NOT NULL DEFAULT 'Full-time',
  experience text,
  education text,
  description text NOT NULL,
  requirements text,
  responsibilities text,
  is_open boolean NOT NULL DEFAULT true
);

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE RESTRICT,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  education text,
  experience text,
  resume_path text,
  status text NOT NULL DEFAULT 'New'
    CHECK (status IN (
      'New',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected'
    ))
);

-- Enable row-level security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Public visitors can view open jobs only
CREATE POLICY "Anyone can view open jobs"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (is_open = true);

-- Do not grant public access to applications.
-- Application submission and HR access policies will be
-- added after we configure secure submission and HR authentication.
REVOKE ALL ON public.job_applications FROM anon, authenticated;
REVOKE ALL ON public.jobs FROM anon, authenticated;

GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT ALL ON public.jobs TO service_role;
GRANT ALL ON public.job_applications TO service_role;
