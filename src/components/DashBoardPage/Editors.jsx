"use client";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-hot-toast";
import { cmnApi } from "@/utils/cmnapi";

const Editors = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchEditors = async () => {
    setLoading(true);
    try {
      const data = await cmnApi.get("/api/admin/editors");

      console.log("Editors data 👉", data); // now this WILL log array

      setEditors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch editors");
      setEditors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await cmnApi.put(`/api/admin/editors/${id}/approve`);
      toast.success("Editor activated");
      fetchEditors();
    } catch {
      toast.error("Failed to activate editor");
    }
  };

  const handleReject = async (id) => {
    try {
      await cmnApi.put(`/api/admin/editors/${id}/reject`);
      toast.success("Editor deactivated");
      fetchEditors();
    } catch {
      toast.error("Failed to deactivate editor");
    }
  };

  const paginatedEditors = editors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper className="p-4 mt-2">
      {/* HEADER */}
      <div className="px-4 py-2 border-b mb-2">
        <Typography variant="h6" fontWeight="bold">
          👥 Editors Management
        </Typography>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedEditors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      className="py-20 text-gray-500"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEditors.map((editor) => (
                    <TableRow key={editor.id} hover>
                      <TableCell>{editor.name}</TableCell>
                      <TableCell>{editor.email}</TableCell>
                      <TableCell>{editor.phone}</TableCell>

                      <TableCell>
                        <Chip
                          label={editor.active ? "Active" : "Inactive"}
                          color={editor.active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        {!editor.active && (
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(editor.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        )}

                        {editor.active && (
                          <IconButton
                            color="error"
                            onClick={() => handleReject(editor.id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={editors.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Paper>
  );
};

export default Editors;
