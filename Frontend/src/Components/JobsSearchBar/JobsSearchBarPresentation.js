import React from "react";
import { TextField, Button, InputAdornment, Stack, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RoomIcon from "@mui/icons-material/Room";

const JobsSearchBarPresentation = ({ keyword, setKeyword, location, setLocation, onSearch }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        width: "100%",
        height: "320px",
        maxWidth: "800px",
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Job title, level, or keyword"
        fullWidth
        autoComplete="off"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 0,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: 2,
            },
          },
        }}
        sx={{ flex: 1 }}
      />

      <Divider orientation="vertical" flexItem sx={{ height: "inherit", alignSelf: "center" }} />

      <TextField
        variant="outlined"
        placeholder="City, state, or country"
        fullWidth
        autoComplete="off"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RoomIcon color="action" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 0,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: 2,
            },
          },
        }}
        sx={{ flex: 1 }}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ height: "56px", borderRadius: 0, px: 3 }}
        onClick={onSearch}
      >
        Find jobs
      </Button>
    </Stack>
  );
};

export default JobsSearchBarPresentation;
