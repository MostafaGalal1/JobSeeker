import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {
  Box,
  Switch,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import lightLogo from "../Assets/Logos/logo-light.png";
import darkLogo from "../Assets/Logos/logo-dark.png";

const pages = ["Home", "Jobs", "About", "Contact"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Toolbar sx={{ display: "flex", flexGrow: 2 }}>
            <img
              src={darkMode ? darkLogo : lightLogo}
              alt="Logo"
              style={{ height: 40, width: 240 }}
            />
          </Toolbar>
          
          {/* Navbar Links (Hidden in Mobile) */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button key={page} color="inherit">
                {page}
              </Button>
            ))}
          </Box>

          {/* Dark Mode Toggle */}
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => setDarkMode(!darkMode)}
            color="inherit"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <List>
          {pages.map((page) => (
            <ListItem key={page} disablePadding>
              <ListItemButton onClick={handleDrawerToggle}>
                <ListItemText primary={page} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </ThemeProvider>
  );
}
