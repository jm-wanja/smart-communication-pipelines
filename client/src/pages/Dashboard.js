import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import BusinessIcon from '@mui/icons-material/Business';
import ConstructionIcon from '@mui/icons-material/Construction';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import StatCard from '../components/StatCard';
import DealTable from '../components/DealTable';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard({ socket }) {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({
    totalDeals: 0,
    retrofitUnits: 0,
    newBuildUnits: 0,
    totalUnits: 0,
    dealsByStage: {},
    dealsByRegion: {},
    totalFundsRequired: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('/api/deals');
        setDeals(response.data);
        calculateStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setLoading(false);
      }
    };

    fetchDeals();

    // Socket event listeners for real-time updates
    socket.on('deal_created', (newDeal) => {
      setDeals((prevDeals) => [...prevDeals, newDeal]);
      calculateStats([...deals, newDeal]);
    });

    socket.on('deal_updated', (updatedDeal) => {
      setDeals((prevDeals) => prevDeals.map((deal) => (deal.id === updatedDeal.id ? updatedDeal : deal)));
      calculateStats([...deals.filter((d) => d.id !== updatedDeal.id), updatedDeal]);
    });

    return () => {
      socket.off('deal_created');
      socket.off('deal_updated');
    };
  }, [socket, deals]);

  const calculateStats = (dealsData) => {
    const retrofitUnits = dealsData.filter((deal) => deal.type === 'retrofit').reduce((sum, deal) => sum + deal.units, 0);

    const newBuildUnits = dealsData.filter((deal) => deal.type === 'new_build').reduce((sum, deal) => sum + deal.units, 0);

    const dealsByStage = dealsData.reduce((acc, deal) => {
      if (!acc[deal.stage]) acc[deal.stage] = 0;
      acc[deal.stage]++;
      return acc;
    }, {});

    const dealsByRegion = dealsData.reduce((acc, deal) => {
      if (!acc[deal.region]) acc[deal.region] = 0;
      acc[deal.region]++;
      return acc;
    }, {});

    const totalFundsRequired = dealsData
      .filter((deal) => ['exchange', 'completion'].includes(deal.stage))
      .reduce((sum, deal) => sum + deal.funds_required, 0);

    setStats({
      totalDeals: dealsData.length,
      retrofitUnits,
      newBuildUnits,
      totalUnits: retrofitUnits + newBuildUnits,
      dealsByStage,
      dealsByRegion,
      totalFundsRequired,
    });
  };

  const pieChartData = {
    labels: Object.keys(stats.dealsByStage).map((stage) => stage.charAt(0).toUpperCase() + stage.slice(1)),
    datasets: [
      {
        data: Object.values(stats.dealsByStage),
        backgroundColor: ['#3f51b5', '#f50057', '#00bcd4', '#ff9800', '#4caf50'],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(stats.dealsByRegion),
    datasets: [
      {
        label: 'Deals by Region',
        data: Object.values(stats.dealsByRegion),
        backgroundColor: '#3f51b5',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Deals by Region',
      },
    },
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
          Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/deals/add')}>
          Add New Deal
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Deals" value={stats.totalDeals} subtitle="All active deals" color="#3f51b5" icon={<BusinessIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            subtitle={`${stats.retrofitUnits} Retrofit, ${stats.newBuildUnits} New Build`}
            color="#f50057"
            icon={<ConstructionIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Legal Progress"
            value={deals.filter((d) => d.legal_stage !== 'Not Started').length}
            subtitle={`of ${stats.totalDeals} deals`}
            color="#00bcd4"
            icon={<GavelIcon />}
            progress={Math.round((deals.filter((d) => d.legal_stage !== 'Not Started').length / stats.totalDeals) * 100) || 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Funds Required"
            value={`£${(stats.totalFundsRequired / 1000000).toFixed(1)}M`}
            subtitle="For exchange/completion"
            color="#4caf50"
            icon={<AccountBalanceIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deals by Stage
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={pieChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deals by Region
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar options={barChartOptions} data={barChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Deals
        </Typography>
        <DealTable deals={deals.slice(0, 5)} />
      </Box>
    </Box>
  );
}

export default Dashboard;
