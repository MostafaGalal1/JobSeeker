import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

export function useResumeUpload() {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadResume = async (file) => {
    console.log("Uploading resume:", file.name);
    if (!file) return;
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/resumes/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (response.ok) {
        return "Resume uploaded successfully";
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return { uploadResume, uploading, error };
}