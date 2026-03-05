// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Typography,
//   Paper,
// } from "@mui/material";
// import { toast } from "react-hot-toast";
// import { cmnApi } from "@/utils/cmnapi";

// const AdsPanel = () => {
//   const [title, setTitle] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("");
//   const [position, setPosition] = useState("TOP_BANNER");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const resetForm = () => {
//     setTitle("");
//     setRedirectUrl("");
//     setPosition("TOP_BANNER");
//     setStartDate("");
//     setEndDate("");
//     setImageFile(null);
//     setPreview(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!imageFile) {
//       toast.error("Please select image");
//       return;
//     }

//     if (new Date(startDate) >= new Date(endDate)) {
//       toast.error("End date must be after start date");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("redirectUrl", redirectUrl);
//     formData.append("position", position);
//     formData.append("startDate", startDate);
//     formData.append("endDate", endDate);
//     formData.append("imageFile", imageFile);

//     try {
//       setLoading(true);

//       await cmnApi.post("/api/admin/ads/create", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Ad uploaded successfully ✅");
//       resetForm();
//     } catch (error) {
//       // Error handled in interceptor
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #eef2f7, #f8fafc)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         p: 3,
//       }}
//     >
//       <Paper
//         elevation={0}
//         sx={{
//           width: "100%",
//           maxWidth: 900,
//           p: 4,
//           borderRadius: 4,
//           backdropFilter: "blur(10px)",
//           background: "rgba(255,255,255,0.9)",
//           boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
//         }}
//       >
//         {/* Header */}
//         <Typography
//           variant="h4"
//           fontWeight="bold"
//           mb={4}
//           sx={{
//             background: "linear-gradient(90deg,#2563eb,#06b6d4)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           📢 Upload Advertisement
//         </Typography>

//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           display="grid"
//           gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
//           gap={3}
//         >
//           <TextField
//             label="Ad Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             fullWidth
//           />

//           <TextField
//             label="Redirect URL"
//             value={redirectUrl}
//             onChange={(e) => setRedirectUrl(e.target.value)}
//             required
//             fullWidth
//           />

//           <TextField
//             select
//             label="Ad Position"
//             value={position}
//             onChange={(e) => setPosition(e.target.value)}
//             fullWidth
//           >
//             <MenuItem value="TOP_BANNER">Top Banner</MenuItem>
//             <MenuItem value="RIGHT_TOP">Right Top</MenuItem>
//             <MenuItem value="RIGHT_BOTTOM">Right Bottom</MenuItem>
//           </TextField>

//           <TextField
//             type="datetime-local"
//             label="Start Date"
//             InputLabelProps={{ shrink: true }}
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             required
//             fullWidth
//           />

//           <TextField
//             type="datetime-local"
//             label="End Date"
//             InputLabelProps={{ shrink: true }}
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             required
//             fullWidth
//           />

//           {/* Upload Section Full Width */}
//           <Box gridColumn="1 / -1">
//             <Box
//               sx={{
//                 border: "2px dashed #cbd5e1",
//                 borderRadius: 3,
//                 p: 3,
//                 textAlign: "center",
//                 cursor: "pointer",
//                 transition: "0.3s",
//                 "&:hover": {
//                   borderColor: "#2563eb",
//                   background: "#f1f5f9",
//                 },
//               }}
//               component="label"
//             >
//               <Typography fontWeight="medium">
//                 Drag & Drop Image Here or Click to Upload
//               </Typography>

//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </Box>
//           </Box>

//           {preview && (
//             <Box gridColumn="1 / -1" mt={2}>
//               <Typography variant="body2" mb={1}>
//                 Preview:
//               </Typography>
//               <img
//                 src={preview}
//                 alt="Preview"
//                 style={{
//                   width: "100%",
//                   maxHeight: "250px",
//                   objectFit: "contain",
//                   borderRadius: "12px",
//                   boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                 }}
//               />
//             </Box>
//           )}

//           {/* Submit Button Full Width */}
//           <Box gridColumn="1 / -1">
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={loading}
//               sx={{
//                 py: 1.5,
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 borderRadius: 3,
//                 background: "linear-gradient(90deg,#16a34a,#22c55e)",
//                 boxShadow: "0 10px 20px rgba(34,197,94,0.3)",
//                 "&:hover": {
//                   background: "linear-gradient(90deg,#15803d,#16a34a)",
//                 },
//               }}
//             >
//               {loading ? "Uploading..." : "Submit Advertisement"}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default AdsPanel;

"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-hot-toast";
import { cmnApi } from "@/utils/cmnapi";

const AdsPanel = () => {
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [position, setPosition] = useState("TOP_BANNER");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- DRAG EVENTS ---------------- */

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("File type not permitted (Only images allowed)");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setImageFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    if (!validateFile(file)) return;

    setImageFile(file);
  };

  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setTitle("");
    setRedirectUrl("");
    setPosition("TOP_BANNER");
    setStartDate("");
    setEndDate("");
    setImageFile(null);
    setError("");
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select image");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("redirectUrl", redirectUrl);
    formData.append("position", position);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("imageFile", imageFile);

    try {
      setLoading(true);

      await cmnApi.post("/api/admin/ads/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Ad uploaded successfully ✅");
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2f7, #f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 4,
          borderRadius: 4,
          background: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          📢 Upload Advertisement
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={3}
        >
          <TextField
            label="Ad Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Redirect URL"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Ad Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            fullWidth
          >
            <MenuItem value="TOP_BANNER">Top Banner</MenuItem>
            <MenuItem value="RIGHT_TOP">Right Top</MenuItem>
            <MenuItem value="RIGHT_BOTTOM">Right Bottom</MenuItem>
          </TextField>
          <TextField
            type="datetime-local"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            fullWidth
          />
          <TextField
            type="datetime-local"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            fullWidth
          />
          {/* -------- DRAG & DROP -------- */}
          <Box gridColumn="1 / -1">
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed #1e88e5",
                borderRadius: 2,
                p: 5,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragging ? "#e3f2fd" : "#fafafa",
                transition: "0.3s",
                position: "relative",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 50, color: "#1e88e5" }} />

              <Typography mt={2} fontWeight={500}>
                {isDragging
                  ? "Drop the file here 👇"
                  : "Drag & Drop files here or click to select file(s)"}
              </Typography>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </Box>

            {/* File Info */}
            {imageFile && (
              <Box
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={1.5}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  background: "#fff",
                }}
              >
                <Typography variant="body2">
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                </Typography>

                <CloseIcon
                  sx={{ cursor: "pointer", color: "red" }}
                  onClick={() => setImageFile(null)}
                />
              </Box>
            )}

            {error && (
              <Typography mt={1} color="error" fontSize="13px">
                {error}
              </Typography>
            )}
          </Box>
          {/* Submit Button */}
          <Box gridColumn="1 / -1" display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: 2,
                background: "linear-gradient(90deg,#16a34a,#22c55e)",
                "&:hover": {
                  background: "linear-gradient(90deg,#15803d,#16a34a)",
                },
              }}
            >
              {loading ? "Uploading..." : "Submit Advertisement"}
            </Button>
          </Box>{" "}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdsPanel;
