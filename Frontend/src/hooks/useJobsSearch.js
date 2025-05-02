import { useCallback, useState } from "react";

const useJobsSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobs = useCallback(async (keyword, location, setJobs) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/jobs/search?keyword=${keyword}&location=${location}`
      );
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      const jobs = data.map((job, index) => ({ 
        id: index + 1, 
        ...job 
      }));

      setJobs(jobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchJobs, loading, error };
};

export default useJobsSearch;
