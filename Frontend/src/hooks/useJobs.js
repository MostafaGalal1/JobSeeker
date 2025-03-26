import { useState, useEffect } from "react";

export const useJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/jobs");
          
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          
          const data = await response.json();
          
          // Transform data to add incremental IDs
          const transformedJobs = data.map((job, index) => ({ 
            id: index + 1, 
            ...job 
          }));
          
          setJobs(transformedJobs);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setError(error instanceof Error ? error.message : "An unknown error occurred");
          setLoading(false);
        }
      };
  
      fetchJobs();
    }, []);
  
    return { jobs, loading, error };
  };