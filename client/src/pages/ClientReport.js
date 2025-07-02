import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import ConstructionIcon from '@mui/icons-material/Construction';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

import DealTable from '../components/DealTable';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`client-report-tabpanel-${index}`} aria-labelledby={`client-report-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function ClientReport({ socket }) {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [deals, setDeals] = useState([]);
  const [reports, setReports] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipient: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client data, deals, and reports
        const [clientsResponse, dealsResponse, reportsResponse] = await Promise.all([
          api.get('/api/clients'),
          api.get('/api/deals'),
          api.get(`/api/reports/${clientId}`),
        ]);

        const clientData = clientsResponse.data.find((c) => c.id === clientId);
        if (!clientData) {
          throw new Error('Client not found');
        }

        setClient(clientData);
        setDeals(dealsResponse.data.filter((d) => d.client_id === clientId));
        setReports(reportsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleGenerateReport = async () => {
    try {
      await api.post(`/api/reports/generate/${clientId}`);
      const response = await api.get(`/api/reports/${clientId}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEmailDialog = () => {
    setAnchorEl(null);
    setEmailDialogOpen(true);
    if (client) {
      setEmailForm({
        recipient: client.email,
        subject: `Weekly Property Report - ${new Date().toLocaleDateString()}`,
        message: `Dear ${client.name},\n\nPlease find attached the weekly property report for your portfolio.\n\nKind regards,\nThe Bricklane Team`,
      });
    }
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
  };

  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendEmail = () => {
    // Simulate sending email
    console.log('Sending email:', emailForm);
    setEmailDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ pt: 2, pb: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Client not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  // Calculate stats for the report
  const retrofitUnits = deals.filter((deal) => deal.type === 'retrofit').reduce((sum, deal) => sum + deal.units, 0);

  const newBuildUnits = deals.filter((deal) => deal.type === 'new_build').reduce((sum, deal) => sum + deal.units, 0);

  const dealsByStage = deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) acc[deal.stage] = 0;
    acc[deal.stage]++;
    return acc;
  }, {});

  const dealsByRegion = deals.reduce((acc, deal) => {
    if (!acc[deal.region]) acc[deal.region] = 0;
    acc[deal.region]++;
    return acc;
  }, {});

  const totalFundsRequired = deals
    .filter((deal) => ['exchange', 'completion'].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.funds_required, 0);

  // Chart data
  const pieChartData = {
    labels: Object.keys(dealsByStage).map((stage) => stage.charAt(0).toUpperCase() + stage.slice(1)),
    datasets: [
      {
        data: Object.values(dealsByStage),
        backgroundColor: ['#3f51b5', '#f50057', '#00bcd4', '#ff9800', '#4caf50'],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(dealsByRegion),
    datasets: [
      {
        label: 'Deals by Region',
        data: Object.values(dealsByRegion),
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

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {client.name} - Client Reports
        </Typography>
        <Box>
          <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={handleGenerateReport} sx={{ mr: 2 }}>
            Generate New Report
          </Button>
          <IconButton aria-label="more" aria-controls="report-menu" aria-haspopup="true" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu id="report-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleOpenEmailDialog}>
              <ListItemIcon>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Email Report</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share Report</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Download PDF</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Current Report" />
          <Tab label="Historical Reports" />
        </Tabs>
        <Divider />

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Weekly Portfolio Summary - {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              This report provides an overview of all properties in the {client.name} portfolio, including deals in progress, legal status, and
              required funds.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Total Deals
                        </Typography>
                        <Typography variant="h4">{deals.length}</Typography>
                      </Box>
                      <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Total Units
                        </Typography>
                        <Typography variant="h4">{retrofitUnits + newBuildUnits}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {retrofitUnits} Retrofit, {newBuildUnits} New Build
                        </Typography>
                      </Box>
                      <ConstructionIcon color="secondary" sx={{ fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Deals in Legals
                        </Typography>
                        <Typography variant="h4">{deals.filter((d) => d.stage === 'legals').length}</Typography>
                      </Box>
                      <GavelIcon sx={{ fontSize: 40, color: '#00bcd4' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Funds Required
                        </Typography>
                        <Typography variant="h4">£{(totalFundsRequired / 1000000).toFixed(1)}M</Typography>
                      </Box>
                      <AccountBalanceIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
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
                <Card elevation={2}>
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

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Portfolio Details
            </Typography>
            <DealTable deals={deals} showActions={false} />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Historical Reports
            </Typography>
            {reports.length > 0 ? (
              <List>
                {reports.map((report, index) => (
                  <ListItem
                    key={index}
                    divider={index !== reports.length - 1}
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText primary={report.period} secondary={`Generated: ${new Date(report.generated_at).toLocaleString()}`} />
                    <Chip label={`${report.stats.total_deals} Deals`} size="small" color="primary" sx={{ mr: 1 }} />
                    <Chip label={`${report.stats.total_units} Units`} size="small" color="secondary" sx={{ mr: 1 }} />
                    <IconButton size="small">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No historical reports found. Generate a new report to see it here.
              </Typography>
            )}
          </Box>
        </TabPanel>
      </Paper>

      <Dialog open={emailDialogOpen} onClose={handleEmailDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Email Report</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Recipient"
            type="email"
            fullWidth
            name="recipient"
            value={emailForm.recipient}
            onChange={handleEmailFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            name="subject"
            value={emailForm.subject}
            onChange={handleEmailFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Message"
            multiline
            rows={4}
            fullWidth
            name="message"
            value={emailForm.message}
            onChange={handleEmailFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailDialogClose}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ClientReport;
