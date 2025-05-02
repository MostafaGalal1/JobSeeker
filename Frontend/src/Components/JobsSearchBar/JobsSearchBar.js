import React, { useState } from "react";
import JobsSearchBarPresentation from "./JobsSearchBarPresentation";

const JobsSearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(keyword, location);
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
