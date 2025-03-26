import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";

const JobsTable = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();
  
  // Now defining columns inside the component to access the theme
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
          style={{ 
            color: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main, 
            textDecoration: "underline" 
          }}
        >
          {params.value}
        </a>
      ),
    },
  ];

  React.useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
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
    <Paper 
      sx={{ 
        height: "100%", 
        width: "100%",
        bgcolor: "background.default" // Make sure paper uses theme background
      }}
    >
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
        sx={{ 
          border: 0,
          '& .MuiDataGrid-cell': {
            color: 'text.primary'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.paper',
            color: 'text.primary'
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'background.paper',
            color: 'text.primary'
          }
        }}
      />
    </Paper>
  );
}

export default JobsTable;