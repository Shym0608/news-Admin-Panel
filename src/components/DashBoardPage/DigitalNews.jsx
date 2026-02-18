"use client";
import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { Table } from "@mui/material";
import { TableBody } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableContainer } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TablePagination } from "@mui/material";
import { Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-hot-toast";
import { cmnApi } from "@/utils/cmnapi";

// ✅ Use Environment Variable (works in local + production)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Build full media URL safely
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};

const DigitalNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const endpoint = "/api/admin/digital/pending";

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await cmnApi.get(endpoint, {
        page,
        size: rowsPerPage,
      });

      const content = Array.isArray(data.content) ? data.content : [];
      setNews(content);
      setTotalItems(data.totalElements || content.length);
    } catch (err) {
      toast.error("Failed to fetch news");
      setNews([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, rowsPerPage]);

  const handleApprove = async (id) => {
    try {
      await cmnApi.put(`/api/admin/${id}/approve`);
      toast.success("News approved");
      fetchNews();
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await cmnApi.put(`/api/admin/${id}/reject`);
      toast.error("News rejected");
      fetchNews();
    } catch {
      toast.error("Rejection failed");
    }
  };

  // ✅ Renders original uploaded media (images / raw videos)
  const renderMedia = (mediaUrls, size = "small") => {
    if (!mediaUrls || mediaUrls.length === 0) return "N/A";

    return (
      <Box display="flex" gap={1} flexWrap="wrap">
        {mediaUrls.map((url, i) => {
          const fullUrl = getFullUrl(url);
          const isVideo =
            fullUrl.toLowerCase().endsWith(".mp4") ||
            fullUrl.toLowerCase().endsWith(".mov") ||
            fullUrl.toLowerCase().endsWith(".webm");

          return isVideo ? (
            <Box
              key={i}
              sx={{
                width: size === "small" ? 120 : "100%",
                height: size === "small" ? 80 : 260,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              }}
            >
              <video
                src={fullUrl}
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ) : (
            <Box
              key={i}
              component="img"
              src={fullUrl}
              alt="media"
              sx={{
                width: size === "small" ? 80 : "100%",
                height: size === "small" ? 50 : "auto",
                borderRadius: 3,
                objectFit: "cover",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              }}
            />
          );
        })}
      </Box>
    );
  };

  // ✅ NEW: Renders the final merged video (TTS audio + original video)
  const renderFinalVideo = (finalVideoUrl, size = "small") => {
    if (!finalVideoUrl) {
      return (
        <Chip
          label="Processing..."
          size="small"
          sx={{
            backgroundColor: "#fff8e1",
            color: "#f57c00",
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      );
    }

    const fullUrl = getFullUrl(finalVideoUrl);

    if (size === "small") {
      return (
        <Tooltip title="Final merged video (TTS + Video)" arrow>
          <Box
            sx={{
              width: 120,
              height: 80,
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid #10b981", // ✅ green border = final video
              boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
              position: "relative",
            }}
          >
            <video
              src={fullUrl}
              controls
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* ✅ "FINAL" badge */}
            <Box
              sx={{
                position: "absolute",
                top: 4,
                left: 4,
                bgcolor: "#10b981",
                color: "white",
                fontSize: "0.55rem",
                fontWeight: 700,
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                letterSpacing: 0.5,
              }}
            >
              FINAL
            </Box>
          </Box>
        </Tooltip>
      );
    }

    // Large version for dialog
    return (
      <Box
        sx={{
          mt: 2,
          borderRadius: 3,
          overflow: "hidden",
          border: "2px solid #10b981",
          boxShadow: "0 6px 24px rgba(16,185,129,0.2)",
        }}
      >
        <Box
          sx={{
            bgcolor: "#ecfdf5",
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid #d1fae5",
          }}
        ></Box>
        <video
          src={fullUrl}
          controls
          style={{
            width: "100%",
            maxHeight: 320,
            objectFit: "contain",
            background: "#000",
          }}
        />
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(145deg, #ffffff, #f4f6f9)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          pb: 2,
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg,#1976d2,#42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Digital News Management
        </Typography>

        <Chip
          label={`${totalItems} Pending`}
          color="primary"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {loading ? (
        <Box textAlign="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table
              sx={{
                "& th": { fontWeight: 600, backgroundColor: "#f9fafc" },
                "& tr:hover": { backgroundColor: "#f1f7ff" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Final Video</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {news.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No pending news
                    </TableCell>
                  </TableRow>
                ) : (
                  news.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.title}</TableCell>

                      <TableCell>
                        {row.shortDescription?.slice(0, 50)}
                        {row.shortDescription?.length > 50 && "..."}
                      </TableCell>

                      <TableCell>
                        <Chip label={row.category || "N/A"} size="small" />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor:
                              row.status === "DRAFT" ? "#fff3e0" : "#e8f5e9",
                            color:
                              row.status === "DRAFT" ? "#ef6c00" : "#2e7d32",
                          }}
                        />
                      </TableCell>

                      {/* ✅ Final merged video cell */}
                      <TableCell>
                        {renderFinalVideo(row.finalVideoUrl, "small")}
                      </TableCell>

                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            sx={{
                              bgcolor: "#e3f2fd",
                              "&:hover": { bgcolor: "#bbdefb" },
                            }}
                            onClick={() => {
                              setSelectedNews(row);
                              setOpenDialog(true);
                            }}
                          >
                            <VisibilityIcon color="primary" />
                          </IconButton>

                          <IconButton
                            sx={{
                              bgcolor: "#e8f5e9",
                              "&:hover": { bgcolor: "#c8e6c9" },
                            }}
                            onClick={() => handleApprove(row.id)}
                          >
                            <CheckCircleIcon sx={{ color: "#2e7d32" }} />
                          </IconButton>

                          <IconButton
                            sx={{
                              bgcolor: "#ffebee",
                              "&:hover": { bgcolor: "#ffcdd2" },
                            }}
                            onClick={() => handleReject(row.id)}
                          >
                            <CancelIcon sx={{ color: "#d32f2f" }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      {/* DETAIL DIALOG */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        {selectedNews && (
          <>
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 3,
                color: "white",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {selectedNews.title}
              </Typography>
              {selectedNews.anchorName && (
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                  Anchor: {selectedNews.anchorName}
                </Typography>
              )}
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Typography sx={{ mb: 3, lineHeight: 1.7 }}>
                {selectedNews.shortDescription}
              </Typography>

              {/* ✅ Final merged video — shown below original */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#555", mt: 3, mb: 1 }}
              >
                Final Processed Video
              </Typography>
              {renderFinalVideo(selectedNews.finalVideoUrl, "large")}
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenDialog(false)}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Close
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  handleApprove(selectedNews.id);
                  setOpenDialog(false);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  bgcolor: "#10b981",
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Approve
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  handleReject(selectedNews.id);
                  setOpenDialog(false);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  bgcolor: "#ef4444",
                  "&:hover": { bgcolor: "#dc2626" },
                }}
              >
                Reject
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default DigitalNews;
