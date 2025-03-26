import React, { useState } from "react";
import JobsSearchBarPresentation from "./JobsSearchBarPresentation";
import useJobsSearch from "../../hooks/useJobsSearch";

const JobsSearchBar = () => {
  const { searchJobs } = useJobsSearch();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    searchJobs(keyword, location);
  };

  return (
    <JobsSearchBarPresentation
      keyword={keyword}
      setKeyword={setKeyword}
      location={location}
      setLocation={setLocation}
      onSearch={handleSearch}
    />
  );
};

export default JobsSearchBar;
