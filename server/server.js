const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const morgan = require('morgan');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database setup
const adapter = new FileSync(path.join(__dirname, 'data/db.json'));
const db = low(adapter);

// Initialize database with default data
db.defaults({
  deals: [
    {
      id: '1',
      client_id: '1',
      title: 'Yorkshire Property Portfolio',
      type: 'retrofit',
      region: 'Yorkshire',
      builder: 'Premier Builders',
      units: 12,
      stage: 'bidding',
      status: 'In Progress',
      legal_stage: 'Not Started',
      projected_exchange_date: '2025-08-15',
      projected_completion_date: '2025-10-30',
      funds_required: 2500000,
      created_at: '2025-06-15T10:30:00.000Z',
      updated_at: '2025-06-30T14:15:00.000Z',
    },
    {
      id: '2',
      client_id: '1',
      title: 'London Apartment Complex',
      type: 'new_build',
      region: 'London',
      builder: 'Metropolitan Developments',
      units: 8,
      stage: 'negotiation',
      status: 'In Progress',
      legal_stage: 'Searches In',
      projected_exchange_date: '2025-07-25',
      projected_completion_date: '2025-09-15',
      funds_required: 3200000,
      created_at: '2025-06-10T09:45:00.000Z',
      updated_at: '2025-06-28T11:20:00.000Z',
    },
    {
      id: '3',
      client_id: '2',
      title: 'Manchester Townhouse Development',
      type: 'new_build',
      region: 'Manchester',
      builder: 'Northern Constructions',
      units: 6,
      stage: 'legals',
      status: 'In Progress',
      legal_stage: 'ROT In',
      projected_exchange_date: '2025-07-10',
      projected_completion_date: '2025-08-30',
      funds_required: 1800000,
      created_at: '2025-06-05T14:20:00.000Z',
      updated_at: '2025-06-25T16:10:00.000Z',
    },
    {
      id: '4',
      client_id: '2',
      title: 'Bristol Waterfront Properties',
      type: 'retrofit',
      region: 'Bristol',
      builder: 'Coastal Renovations',
      units: 4,
      stage: 'exchange',
      status: 'Pending Funds',
      legal_stage: 'Reviewed',
      projected_exchange_date: '2025-07-05',
      projected_completion_date: '2025-08-15',
      funds_required: 1500000,
      created_at: '2025-06-01T11:30:00.000Z',
      updated_at: '2025-06-20T13:45:00.000Z',
    },
  ],
  clients: [
    {
      id: '1',
      name: 'Highbrook Investments',
      email: 'reports@highbrook.example.com',
      report_frequency: 'weekly',
    },
    {
      id: '2',
      name: 'Cerberus Capital',
      email: 'updates@cerberus.example.com',
      report_frequency: 'weekly',
    },
  ],
  feedback: [
    {
      id: '1',
      from_team: 'Valuations',
      to_team: 'Tech',
      issue_type: 'Improvement',
      description: 'Need faster loading times on property valuation page',
      status: 'Pending',
      created_at: '2025-06-28T09:30:00.000Z',
    },
  ],
  reports: [],
  notifications: [],
}).write();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://smart-communication-pipelines.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://smart-communication-pipelines.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Socket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.get('/api/deals', (req, res) => {
  const deals = db.get('deals').value();
  res.json(deals);
});

app.get('/api/deals/:id', (req, res) => {
  const deal = db.get('deals').find({ id: req.params.id }).value();
  if (deal) {
    res.json(deal);
  } else {
    res.status(404).json({ error: 'Deal not found' });
  }
});

app.post('/api/deals', (req, res) => {
  const newDeal = {
    id: uuidv4(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.get('deals').push(newDeal).write();

  // Emit socket event for real-time updates
  io.emit('deal_created', newDeal);

  res.status(201).json(newDeal);
});

app.put('/api/deals/:id', (req, res) => {
  const dealId = req.params.id;
  const updatedDeal = {
    ...db.get('deals').find({ id: dealId }).value(),
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  db.get('deals').find({ id: dealId }).assign(updatedDeal).write();

  // Emit socket event for real-time updates
  io.emit('deal_updated', updatedDeal);

  res.json(updatedDeal);
});

app.get('/api/clients', (req, res) => {
  const clients = db.get('clients').value();
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = db.get('clients').find({ id: req.params.id }).value();
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    id: uuidv4(),
    ...req.body,
  };

  db.get('clients').push(newClient).write();

  // Emit socket event for real-time updates
  io.emit('client_created', newClient);

  res.status(201).json(newClient);
});

app.put('/api/clients/:id', (req, res) => {
  const clientId = req.params.id;
  const updatedClient = {
    ...db.get('clients').find({ id: clientId }).value(),
    ...req.body,
  };

  db.get('clients').find({ id: clientId }).assign(updatedClient).write();

  // Emit socket event for real-time updates
  io.emit('client_updated', updatedClient);

  res.json(updatedClient);
});

app.post('/api/feedback', (req, res) => {
  const newFeedback = {
    id: uuidv4(),
    ...req.body,
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  db.get('feedback').push(newFeedback).write();

  // Emit socket event for real-time updates
  io.emit('feedback_created', newFeedback);

  res.status(201).json(newFeedback);
});

app.get('/api/feedback', (req, res) => {
  const feedback = db.get('feedback').value();
  res.json(feedback);
});

app.put('/api/feedback/:id', (req, res) => {
  const feedbackId = req.params.id;
  const updatedFeedback = {
    ...db.get('feedback').find({ id: feedbackId }).value(),
    ...req.body,
  };

  db.get('feedback').find({ id: feedbackId }).assign(updatedFeedback).write();

  // Emit socket event for real-time updates
  io.emit('feedback_updated', updatedFeedback);

  res.json(updatedFeedback);
});

// Generate weekly report for a client
app.post('/api/reports/generate/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const client = db.get('clients').find({ id: clientId }).value();

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  const clientDeals = db.get('deals').filter({ client_id: clientId }).value();

  // Simple stats calculation
  const retrofitUnits = clientDeals.filter((deal) => deal.type === 'retrofit').reduce((sum, deal) => sum + deal.units, 0);

  const newBuildUnits = clientDeals.filter((deal) => deal.type === 'new_build').reduce((sum, deal) => sum + deal.units, 0);

  const dealsByStage = clientDeals.reduce((acc, deal) => {
    if (!acc[deal.stage]) acc[deal.stage] = [];
    acc[deal.stage].push(deal);
    return acc;
  }, {});

  const totalFundsRequired = clientDeals
    .filter((deal) => ['exchange', 'completion'].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.funds_required, 0);

  const report = {
    id: uuidv4(),
    client_id: clientId,
    client_name: client.name,
    generated_at: new Date().toISOString(),
    period: `${new Date().toISOString().slice(0, 10)} - Weekly Report`,
    stats: {
      total_units: retrofitUnits + newBuildUnits,
      retrofit_units: retrofitUnits,
      new_build_units: newBuildUnits,
      total_deals: clientDeals.length,
      deals_by_stage: Object.keys(dealsByStage).map((stage) => ({
        stage,
        count: dealsByStage[stage].length,
        deals: dealsByStage[stage],
      })),
      total_funds_required: totalFundsRequired,
    },
  };

  db.get('reports').push(report).write();

  // Emit socket event for real-time updates
  io.emit('report_generated', report);

  res.status(201).json(report);
});

app.get('/api/reports/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const reports = db.get('reports').filter({ client_id: clientId }).value();
  res.json(reports);
});

// Server start
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
