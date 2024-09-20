import React, { useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Toolbar, ListItemIcon, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector for Redux state
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icon for Tasks
import WorkIcon from '@mui/icons-material/Work'; // Icon for Jobs
import { fetchJobs } from '../features/jobs/jobThunks';
import { fetchTasks } from '../features/tasks/taskThunks';

const drawerWidth = 240;

const Sidebar = () => {
  const dispatch = useDispatch();
  // Select the count of tasks and jobs from Redux state
  const taskCount = useSelector((state) => state?.tasks?.totalCount || 0);
  const jobCount = useSelector((state) => state?.jobs?.totalCount || 0);

  // when page refresh then call both data jobs and tasks
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List sx={{ mt: 2 }}>
        <ListItem button component={Link} to="/tasks" sx={{ mb: 2 }}>
          <ListItemIcon>
            <AssignmentIcon color="primary" /> {/* Task Icon */}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <span>Tasks</span>
                <span>({taskCount})</span> {/* Display task count */}
              </Box>
            }
          />
        </ListItem>

        <Divider />

        <ListItem button component={Link} to="/jobs" sx={{ mt: 2 }}>
          <ListItemIcon>
            <WorkIcon color="primary" /> {/* Job Icon */}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <span>Jobs</span>
                <span>({jobCount})</span> {/* Display job count */}
              </Box>
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
