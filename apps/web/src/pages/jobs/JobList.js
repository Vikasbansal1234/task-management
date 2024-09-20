// src/pages/jobs/JobList.js
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TablePagination, Box
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, deleteJob } from '../../features/jobs/jobThunks';
import { selectAllJobs, selectJobLoading } from '../../features/jobs/jobSelectors';
import { formatDate } from '../../utils/dateUtils';
const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const loading = useSelector(selectJobLoading);
  const totalCount = useSelector((state) => state.jobs.totalCount);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchJobs({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // Delete job handlers
  const handleDelete = (job) => {
    setSelectedJob(job);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedJob) {
      dispatch(deleteJob(selectedJob._id)); // Trigger the deleteJob thunk
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <Box>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell>Total Tasks</TableCell>
                <TableCell>Total Batches</TableCell>
                <TableCell>Completed Tasks</TableCell>
                <TableCell>Failed Tasks</TableCell>
                <TableCell>Completed Batches</TableCell>
                <TableCell>Failed Batches</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Completed At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs?.map((job) => (
                <TableRow key={job.jobId}>
                  <TableCell>{job.jobId}</TableCell>
                  <TableCell>{job.totalTasks}</TableCell>
                  <TableCell>{job.totalBatches}</TableCell>
                  <TableCell>{job.completedTasks}</TableCell>
                  <TableCell>{job.failedTasks}</TableCell>
                  <TableCell>{job.completedBatches}</TableCell>
                  <TableCell>{job.failedBatches}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>{formatDate(job.createdAt)}</TableCell> {/* Use formatDate */}
                  <TableCell>{formatDate(job.completedAt)}</TableCell> {/* Use formatDate */}
                  <TableCell>
                    <IconButton color="secondary" data-testid={`delete-jobs-${job?._id}`} onClick={() => handleDelete(job)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount} // Use total count for pagination
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this job?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobList;
