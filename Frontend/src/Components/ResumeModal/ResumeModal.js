import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Input,
  Box,
} from "@mui/material";
import { useResumeUpload } from "../../hooks/useResumeUpload";
import uploadIcon from "../../Assets/Logos/logo-dark.png"; // Adjust the path as necessary

const ResumeModal = ({ open, onClose }) => {
  const { uploadResume, uploading, error } = useResumeUpload();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      uploadResume(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Resume</DialogTitle>
      <DialogContent>
        <Input type="file" onChange={handleFileChange} disabled={uploading} />
        <label htmlFor="file-upload">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px dashed #aaa",
              padding: "20px",
              borderRadius: "8px",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <img src={uploadIcon} alt="Upload" width={50} />
          </Box>
        </label>
        {uploading && <CircularProgress size={24} />}
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          variant="contained"
          color="primary"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResumeModal;
