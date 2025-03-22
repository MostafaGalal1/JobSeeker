import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "ID", width: 40 },
  { field: "job_title", headerName: "Title", width: 180 },
  { field: "company_name", headerName: "Company", width: 140 },
  { field: "experience_years", headerName: "Experience Years", width: 140 },
  { field: "experience_level", headerName: "Experience Level", width: 140 },
  { field: "salary", headerName: "Salary", width: 140 },
  { field: "city", headerName: "City", width: 140 },
  { field: "country", headerName: "Country", width: 140 },
  {
    field: "job_url",
    headerName: "Job Link",
    width: 400,
    renderCell: (params) => (
      <a
        href={params.value}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        {params.value}
      </a>
    ),
  },
];

export default function JobTable() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("https://alex.hosting.acm.org/JobSeeker/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data.map((job, index) => ({ id: index + 1, ...job })));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Paper sx={{ height: "92vh", width: "100%" }}>
      <DataGrid
        rows={jobs}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 50, page: 0 },
          },
        }}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
