import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { Table } from "@mui/material";
import { TableBody } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableContainer } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TablePagination } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
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

  // If backend already returns full URL
  if (path.startsWith("http")) return path;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};

const StoryNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const endpoint = "/api/admin/story/pending";

  // 🔹 Fetch story news
  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await cmnApi.get(endpoint, {
        page,
        size: rowsPerPage,
      });

      setNews(Array.isArray(data.content) ? data.content : []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch news");
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
      toast.success("Story approved");
      fetchNews();
    } catch {
      toast.error("Failed to approve story");
    }
  };

  const handleReject = async (id) => {
    try {
      await cmnApi.put(`/api/admin/${id}/reject`);
      toast.success("Story rejected");
      fetchNews();
    } catch {
      toast.error("Failed to reject story");
    }
  };

  // 🔹 Image renderer (table + dialog)
  const renderImages = (mediaUrls, size = "table") => {
    if (!mediaUrls || mediaUrls.length === 0) return "N/A";

    return (
      <Box display="flex" gap={1} flexWrap="wrap">
        {mediaUrls.map((url, i) => {
          const fullUrl = getFullUrl(url);

          return (
            <Box
              key={i}
              component="img"
              src={fullUrl}
              alt="story"
              loading="lazy"
              sx={{
                width: size === "table" ? 80 : 260,
                height: size === "table" ? 50 : "auto",
                objectFit: "cover",
                borderRadius: 3,
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onError={(e) => {
                console.error("Image load error:", fullUrl);
                e.currentTarget.src =
                  "https://via.placeholder.com/250?text=Image+Not+Found";
              }}
            />
          );
        })}
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
          Story News Management
        </Typography>

        <Chip
          label={`${totalElements} Pending`}
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
                "& th": {
                  fontWeight: 600,
                  backgroundColor: "#f9fafc",
                },
                "& tr:hover": {
                  backgroundColor: "#f1f7ff",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Short Description</TableCell>
                  <TableCell>Full Context</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Images</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {news.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No pending story news
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
                        {row.fullContext?.slice(0, 50)}
                        {row.fullContext?.length > 50 && "..."}
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
                      <TableCell>
                        {renderImages(row.mediaUrls, "table")}
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
            count={totalElements}
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

      {/* ENHANCED MODERN DIALOG */}
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
            {/* Header with gradient background */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 3,
                color: "white",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {selectedNews.title}
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Chip
                  label={selectedNews.category || "Uncategorized"}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={selectedNews.status}
                  size="small"
                  sx={{
                    bgcolor:
                      selectedNews.status === "DRAFT"
                        ? "rgba(255,152,0,0.9)"
                        : "rgba(76,175,80,0.9)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <DialogContent sx={{ p: 0 }}>
              {/* Short Description Section */}
              <Box sx={{ p: 3, bgcolor: "#f8f9fa" }}>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#64748b",
                    letterSpacing: 1,
                  }}
                >
                  Short Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#334155", lineHeight: 1.7 }}
                >
                  {selectedNews.shortDescription || "No description provided"}
                </Typography>
              </Box>

              {/* Full Context Section */}
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#64748b",
                    letterSpacing: 1,
                  }}
                >
                  Full Context
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "#334155", lineHeight: 1.7 }}
                >
                  {selectedNews.fullContext || "No full context provided"}
                </Typography>
              </Box>

              {/* Image Gallery Section */}
              {selectedNews.mediaUrls && selectedNews.mediaUrls.length > 0 && (
                <Box sx={{ p: 3, bgcolor: "#f8f9fa" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "#64748b",
                      letterSpacing: 1,
                      mb: 2,
                      display: "block",
                    }}
                  >
                    Image Gallery
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {selectedNews.mediaUrls.map((url, i) => {
                      const fullUrl = getFullUrl(url);

                      return (
                        <Box
                          key={i}
                          component="img"
                          src={fullUrl}
                          alt={`story-${i}`}
                          sx={{
                            // width: "100%",
                            height: 300,
                            borderRadius: 3,
                            objectFit: "cover",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                            },
                          }}
                          onError={(e) => {
                            console.error("Image load error:", fullUrl);
                            e.currentTarget.src =
                              "https://via.placeholder.com/250?text=Image+Not+Found";
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Metadata Section */}
              <Box
                sx={{
                  p: 3,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                  borderTop: "1px solid #e2e8f0",
                }}
              ></Box>
            </DialogContent>

            <DialogActions
              sx={{
                p: 3,
                bgcolor: "#f8f9fa",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setOpenDialog(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#cbd5e1",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    bgcolor: "rgba(0,0,0,0.02)",
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  handleApprove(selectedNews.id);
                  setOpenDialog(false);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#10b981",
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                startIcon={<CancelIcon />}
                onClick={() => {
                  handleReject(selectedNews.id);
                  setOpenDialog(false);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
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

export default StoryNews;
