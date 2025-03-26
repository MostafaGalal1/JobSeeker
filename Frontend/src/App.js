import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import JobsTable from "./components/JobsTable/JobsTable";
import JobsSearchBar from "./components/JobsSearchBar/JobsSearchBar";
import Box from "@mui/material/Box"; // Import Box from MUI
import AuthProvider from "./components/AuthProvider";


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: theme.palette.background.default, // Dynamically update bg color
            color: theme.palette.text.primary, // Ensure text color adapts
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Navbar />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                overflow: "hidden",
                padding: 10,
              }}
            >
              <JobsSearchBar />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
              }}
            >
              <JobsTable />
            </Box>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
