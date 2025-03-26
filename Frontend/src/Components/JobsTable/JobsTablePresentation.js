
import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";

const JobsTablePresentation = () => {
  const jobs = useState([]);
  const loading = useState(true);
  const theme = useTheme();
  
  const columns = useMemo(() => [
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
            color: theme.palette.mode === 'dark' 
              ? theme.palette.primary.dark 
              : theme.palette.primary.main, 
            textDecoration: "underline" 
          }}
        >
          {params.value}
        </a>
      ),
    },
  ], [theme]);


  return (
    <Paper 
      sx={{ 
        height: "100%", 
        width: "100%",
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

export default JobsTablePresentation;