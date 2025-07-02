import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Paper, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditDeal({ socket }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    type: 'retrofit',
    region: '',
    builder: '',
    units: 1,
    stage: 'bidding',
    status: 'In Progress',
    legal_stage: 'Not Started',
    projected_exchange_date: '',
    projected_completion_date: '',
    funds_required: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealResponse, clientsResponse] = await Promise.all([axios.get(`/api/deals/${id}`), axios.get('/api/clients')]);

        setFormData(dealResponse.data);
        setClients(clientsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load deal data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'units' || name === 'funds_required' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`/api/deals/${id}`, formData);
      setSaving(false);
      navigate('/deals');
    } catch (error) {
      console.error('Error updating deal:', error);
      setError('Failed to update deal. Please try again.');
      setSaving(false);
    }
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
          Edit Deal
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/deals')}>
          Back to Deals
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="client-label">Client</InputLabel>
                <Select labelId="client-label" id="client_id" name="client_id" value={formData.client_id} onChange={handleChange} label="Client">
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="title" name="title" label="Deal Title" value={formData.title} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="type-label">Type</InputLabel>
                <Select labelId="type-label" id="type" name="type" value={formData.type} onChange={handleChange} label="Type">
                  <MenuItem value="retrofit">Retrofit</MenuItem>
                  <MenuItem value="new_build">New Build</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="region" name="region" label="Region" value={formData.region} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="builder" name="builder" label="Builder" value={formData.builder} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                id="units"
                name="units"
                label="Number of Units"
                value={formData.units}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="stage-label">Stage</InputLabel>
                <Select labelId="stage-label" id="stage" name="stage" value={formData.stage} onChange={handleChange} label="Stage">
                  <MenuItem value="bidding">Bidding</MenuItem>
                  <MenuItem value="negotiation">Negotiation</MenuItem>
                  <MenuItem value="legals">Legals</MenuItem>
                  <MenuItem value="exchange">Exchange</MenuItem>
                  <MenuItem value="completion">Completion</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="legal-stage-label">Legal Stage</InputLabel>
                <Select
                  labelId="legal-stage-label"
                  id="legal_stage"
                  name="legal_stage"
                  value={formData.legal_stage}
                  onChange={handleChange}
                  label="Legal Stage"
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="Searches In">Searches In</MenuItem>
                  <MenuItem value="ROT In">ROT In</MenuItem>
                  <MenuItem value="Reviewed">Reviewed</MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="projected_exchange_date"
                name="projected_exchange_date"
                label="Projected Exchange Date"
                type="date"
                value={formData.projected_exchange_date ? formData.projected_exchange_date.split('T')[0] : ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="projected_completion_date"
                name="projected_completion_date"
                label="Projected Completion Date"
                type="date"
                value={formData.projected_completion_date ? formData.projected_completion_date.split('T')[0] : ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                id="funds_required"
                name="funds_required"
                label="Funds Required (£)"
                value={formData.funds_required}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" disabled={saving} sx={{ mr: 2 }}>
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/deals')} size="large" disabled={saving}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default EditDeal;
