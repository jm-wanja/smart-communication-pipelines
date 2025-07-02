import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import DealTable from '../components/DealTable';

function Deals() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    stage: '',
    type: '',
    region: '',
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('/api/deals');
        setDeals(response.data);
        setFilteredDeals(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let results = deals;

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (deal) => deal.title.toLowerCase().includes(term) || deal.region.toLowerCase().includes(term) || deal.builder.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.stage) {
      results = results.filter((deal) => deal.stage === filters.stage);
    }

    if (filters.type) {
      results = results.filter((deal) => deal.type === filters.type);
    }

    if (filters.region) {
      results = results.filter((deal) => deal.region === filters.region);
    }

    setFilteredDeals(results);
  }, [searchTerm, filters, deals]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      stage: '',
      type: '',
      region: '',
    });
    setFilterDialogOpen(false);
  };

  // Get unique regions for filter dropdown
  const regions = [...new Set(deals.map((deal) => deal.region))];

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

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
          Deals
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/deals/add')}>
          Add New Deal
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Tooltip title="Filter Deals">
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDialogOpen(true)}
                color={hasActiveFilters ? 'primary' : 'inherit'}
              >
                Filters {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {filteredDeals.length > 0 ? (
        <DealTable deals={filteredDeals} />
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No deals found matching your search criteria
          </Typography>
          {hasActiveFilters && (
            <Button variant="text" color="primary" onClick={clearFilters} sx={{ mt: 1 }}>
              Clear Filters
            </Button>
          )}
        </Paper>
      )}

      <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>Filter Deals</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="stage-filter-label">Stage</InputLabel>
              <Select labelId="stage-filter-label" id="stage" name="stage" value={filters.stage} onChange={handleFilterChange} label="Stage">
                <MenuItem value="">All Stages</MenuItem>
                <MenuItem value="bidding">Bidding</MenuItem>
                <MenuItem value="negotiation">Negotiation</MenuItem>
                <MenuItem value="legals">Legals</MenuItem>
                <MenuItem value="exchange">Exchange</MenuItem>
                <MenuItem value="completion">Completion</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select labelId="type-filter-label" id="type" name="type" value={filters.type} onChange={handleFilterChange} label="Type">
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="retrofit">Retrofit</MenuItem>
                <MenuItem value="new_build">New Build</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="region-filter-label">Region</InputLabel>
              <Select labelId="region-filter-label" id="region" name="region" value={filters.region} onChange={handleFilterChange} label="Region">
                <MenuItem value="">All Regions</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Clear All</Button>
          <Button onClick={handleFilterDialogClose} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Deals;
