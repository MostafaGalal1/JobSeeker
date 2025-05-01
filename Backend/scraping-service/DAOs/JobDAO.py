import requests

class JobDAO:
    BASE_URL = "http://jobs-service:5000/api/jobs"

    def __init__(self):
        pass

    def get_jobs_hashes(self):
        """Fetch all jobs and return a set of job hashes (unique IDs)."""
        jobs = self.get_all_jobs()
        return {job['job_id'] for job in jobs}

    def insert_jobs(self, jobs):
        """Send job data to the backend API for insertion."""
        job_data = [
            {
                "job_id": job.job_id,
                "job_title": job.job_title,
                "company_name": job.company_name,
                "job_type": job.job_type,
                "experience_years": job.experience_years,
                "experience_level": job.experience_level,
                "salary": job.salary,
                "city": job.city,
                "country": job.country,
                "job_url": job.job_url
            }
            for job in jobs
        ]

        response = requests.post(f"{self.BASE_URL}/bulk", json=job_data)
        
        if response.status_code == 201:
            print("Jobs inserted successfully")
        else:
            print(f"Failed to insert jobs: {response.status_code}, {response.text}")

    def get_all_jobs(self):
        """Fetch all jobs from the backend API."""
        response = requests.get(f"{self.BASE_URL}")
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch jobs: {response.status_code}, {response.text}")
            return []