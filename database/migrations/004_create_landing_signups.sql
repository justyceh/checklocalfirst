CREATE TABLE landing_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    source text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);