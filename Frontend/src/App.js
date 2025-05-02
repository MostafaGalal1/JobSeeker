import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import JobsPage from "./pages/JobsPage";
import Box from "@mui/material/Box";
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
            <JobsPage />
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
