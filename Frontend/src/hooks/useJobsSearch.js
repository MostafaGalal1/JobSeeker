import { useState } from "react";

const useJobsSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobs = async (keyword, location) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/search?keyword=${keyword}&location=${location}`
      );
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, searchJobs, loading, error };
};

export default useJobsSearch;
