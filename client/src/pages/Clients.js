import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Clients({ socket }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    report_frequency: 'weekly',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();

    if (socket) {
      socket.on('client_created', (newClient) => {
        setClients((prev) => [...prev, newClient]);
      });

      socket.on('client_updated', (updatedClient) => {
        setClients((prev) => prev.map((client) => (client.id === updatedClient.id ? updatedClient : client)));
      });

      return () => {
        socket.off('client_created');
        socket.off('client_updated');
      };
    }
  }, [socket]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients');
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        report_frequency: client.report_frequency,
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        report_frequency: 'weekly',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingClient) {
        // Update existing client
        await axios.put(`/api/clients/${editingClient.id}`, formData);
      } else {
        // Add new client
        await axios.post('/api/clients', formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const viewClientReports = (clientId) => {
    navigate(`/reports/${clientId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Clients
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add New Client
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Report Frequency</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.report_frequency}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => viewClientReports(client.id)} title="View Reports" sx={{ mr: 1 }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(client)} title="Edit Client">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Client Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Client Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Report Frequency"
            name="report_frequency"
            value={formData.report_frequency}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 1 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!formData.name || !formData.email}>
            {editingClient ? 'Save Changes' : 'Add Client'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Clients;
