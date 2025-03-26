import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import lightLogo from "../Assets/Logos/logo-light.png";
import darkLogo from "../Assets/Logos/logo-dark.png";
import { useThemeContext } from "../context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const pages = ["Home", "About"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeContext();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
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
            <Button
              key={page}
              sx={{
                color: darkMode ? theme.palette.primary.dark : "inherit",
              }}
            >
              {page}
            </Button>
          ))}
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                color="primary"
                sx={{
                  color: darkMode ? theme.palette.primary.dark : "inherit",
                  fontSize: "16px",
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>

        {/* Dark Mode Toggle */}
        <IconButton
          sx={{
            ml: 1,
            color: darkMode ? theme.palette.primary.dark : "inherit",
          }}
          onClick={toggleDarkMode}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          color: darkMode ? theme.palette.primary.dark : "inherit",
        }}
      >
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
    </AppBar>
  );
}

export default Navbar;