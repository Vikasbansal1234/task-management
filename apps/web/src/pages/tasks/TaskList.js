import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
  DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, TablePagination, Box, Grid, Toolbar, Typography, Input, AppBar
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, uploadTasksFile } from '../../features/tasks/taskThunks';
import { selectAllTasks, selectTaskLoading } from '../../features/tasks/taskSelectors';
import DialogContentText from '@mui/material/DialogContentText';
import * as XLSX from 'xlsx'; // For CSV/XLSX processing
import { ButtonGroup } from '@mui/material'; // Import ButtonGroup
import AddIcon from '@mui/icons-material/Add'; // Icon for Add New Task
import FileUploadIcon from '@mui/icons-material/FileUpload'; // Icon for Import Tasks
import DownloadIcon from '@mui/icons-material/Download'; // Icon for Export Tasks

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectTaskLoading);
  const totalCount = useSelector((state) => state.tasks.totalCount || 0); // Get total count from state

  const [selectedTask, setSelectedTask] = useState(null); // Task to edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Enums for priority and status
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['To Do', 'In Progress', 'Done'];


  const [file, setFile] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  useEffect(() => {
    dispatch(fetchTasks({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit task handlers
  const handleEdit = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    dispatch(updateTask({ id: selectedTask._id, updatedTask: selectedTask }));
    setEditModalOpen(false);
  };

  // Add new task handlers
  const handleAddNewTask = () => {
    setSelectedTask({ title: '', description: '', priority: 'Low', status: 'To Do', deadline: '' });
    setNewTaskModalOpen(true);
  };

  const handleNewTaskSave = () => {
    dispatch(createTask(selectedTask)); // Dispatch the create task thunk
    setNewTaskModalOpen(false);
  };

  // Delete task handlers
  const handleDelete = (task) => {
    setSelectedTask(task);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteTask(selectedTask._id)); // Dispatch the delete task thunk
    setDeleteConfirmOpen(false);
  };

  const handleFileChangeAndUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert('Please upload the file first.');
      return;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Dispatch the file upload action to the API
    dispatch(uploadTasksFile(formData))
      .then(() => {
        alert('File uploaded successfully!');

        // After successful file upload, refetch the tasks to update the list
        dispatch(fetchTasks()); // This will refetch the task list
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
      });
  };

  // Handle exporting tasks to CSV/XLSX
  const handleExportTasks = () => {
    const tasksToExport = tasks.map(({ title, description, priority, status, deadline }) => ({
      title,
      description,
      priority,
      status,
      deadline,
    }));

    const worksheet = XLSX.utils.json_to_sheet(tasksToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

    XLSX.writeFile(workbook, 'tasks_export.xlsx');
  };

  return (
    <Box>
      {/* Toolbar for Create, Import, Export */}



      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h6" component="div">
                Task Management
              </Typography>
            </Grid>

            {/* Empty Grid item to push buttons to the right */}
            <Grid item xs />

            <Grid item>
              <ButtonGroup variant="contained" size="small" aria-label="small button group">
                {/* Add New Task Button with consistent color and icon */}
                <Button sx={{ backgroundColor: '#b0b0b0', color: '#ffffff' }} onClick={handleAddNewTask}>
                  <AddIcon sx={{ mr: 1 }} /> Add New Task
                </Button>

                {/* Custom File Upload Button with consistent color and icon */}
                <input
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={handleFileChangeAndUpload}
                />
                <label htmlFor="file-upload">
                  <Button component="span" sx={{ backgroundColor: '#b0b0b0', color: '#ffffff' }}>
                    <FileUploadIcon sx={{ mr: 1 }} /> Import Tasks
                  </Button>
                </label>

                {/* Export Tasks Button with consistent color and icon */}
                <Button sx={{ backgroundColor: '#b0b0b0', color: '#ffffff' }} onClick={handleExportTasks}>
                  <DownloadIcon sx={{ mr: 1 }} /> Export Tasks
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Loading state */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks && tasks?.map((task, index) => (
                <TableRow key={task._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5', // Alternate row color
                  }}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" data-testid={`delete-task-${task?._id}`} onClick={() => handleDelete(task)}>
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

      {/* Edit Task Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                value={selectedTask?.title || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={selectedTask?.description || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                margin="dense"
                label="Priority"
                fullWidth
                value={selectedTask?.priority || 'Low'}
                onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                margin="dense"
                label="Status"
                fullWidth
                value={selectedTask?.status || 'To Do'}
                onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Deadline"
                fullWidth
                type="date"
                value={selectedTask?.deadline || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add New Task Modal */}
      <Dialog open={newTaskModalOpen} onClose={() => setNewTaskModalOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                value={selectedTask?.title || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={selectedTask?.description || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                margin="dense"
                label="Priority"
                fullWidth
                value={selectedTask?.priority || 'Low'}
                onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                margin="dense"
                label="Status"
                fullWidth
                value={selectedTask?.status || 'To Do'}
                onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Deadline"
                fullWidth
                type="date"
                value={selectedTask?.deadline || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTaskModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleNewTaskSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;
