CREATE TABLE IF NOT EXISTS jobs (
    job_id TEXT PRIMARY KEY,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_type TEXT NOT NULL,
    experience_years TEXT,
    experience_level TEXT,
    salary TEXT,
    city TEXT,
    country TEXT,
    job_url TEXT UNIQUE NOT NULL
);