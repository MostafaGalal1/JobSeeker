import React from "react";
import { useState, useEffect } from "react";
import JobsSearchBar from "../components/JobsSearchBar/JobsSearchBar";
import JobsTable from "../components/JobsTable/JobsTable";
import useJobsSearch from "../hooks/useJobsSearch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ResumeModal from "../components/ResumeModal/ResumeModal";

const JobsPage = () => {
  const { searchJobs, loading } = useJobsSearch();
  const [modalOpen, setModalOpen] = useState(false);

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    searchJobs("", "", setJobs);
  }, [searchJobs]);

  const handleSearch = (keyword, location) => {
    searchJobs(keyword, location, setJobs);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
          padding: 10,
        }}
      >
        <JobsSearchBar onSearch={handleSearch} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Upload Resume
        </Button>

        <ResumeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <JobsTable jobs={jobs} loading={loading} />
      </Box>
    </>
  );
};

export default JobsPage;
