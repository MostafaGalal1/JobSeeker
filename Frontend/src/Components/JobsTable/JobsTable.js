import * as React from "react";
import JobsTablePresentation from "./JobsTablePresentation";

const JobsTable = ({ jobs, loading }) => {
  return (
    <JobsTablePresentation jobs={jobs} loading={loading} />
  );
};

export default JobsTable;