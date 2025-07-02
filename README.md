# Smart Communication Pipelines POC

This is a proof of concept (POC) for a Smart Communication Pipelines solution that addresses two key areas:

1. **Client Communication Automation**: A dashboard that visualizes deal progress and can generate reports automatically for clients.
2. **Internal Feedback Mechanism**: A streamlined process for team members to submit feedback with AI-assisted clarification.

## Deployed Application

The application is deployed and can be accessed at:

- **Frontend**: [https://smart-communication-pipelines-client.onrender.com](https://smart-communication-pipelines-client.onrender.com)
- **Backend**: [https://smart-communication-pipelines.onrender.com](https://smart-communication-pipelines.onrender.com)

For detailed demo instructions, please see [DEMO_INSTRUCTIONS.md](./DEMO_INSTRUCTIONS.md).

## Quick Start for Developers

```bash
# Clone the repository
git clone https://github.com/jm-wanja/smart-communication-pipelines.git

# Navigate to the project directory
cd smart-communication-pipelines

# Install dependencies for both client and server
npm run setup

# Start the server (in one terminal)
cd server
npm start

# Start the client (in another terminal)
cd ../client
npm start
```

## Deployment Information

The application is deployed on Render.com with the following configuration:

### Backend (Web Service)

- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && node server.js`
- **Environment Variables**: None required (using in-memory database)

### Frontend (Static Site)

- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/build`
- **Environment Variables**:
  - `REACT_APP_API_URL`: Set to the backend URL

## System Architecture

```ascii
                                 +------------------+
                                 |                  |
                                 |  Material UI     |
                                 |  React Components|
                                 |                  |
                                 +---------+--------+
                                           |
+--------------------+           +---------v-----------+         +------------------+
|                    |           |                     |         |                  |
|   Socket.IO Client |<--------->|  React Application  |<------->|  Axios HTTP      |
|   (Real-time)      |           |  (Frontend)         |         |  Client          |
|                    |           |                     |         |                  |
+--------------------+           +---------+-----------+         +------------------+
                                           |
                                           |
                             +-------------v--------------+
                             |                            |
                             |     Express.js API         |
                             |     (Backend)              |
                             |                            |
                             +--------------+-------------+
                                            |
              +--------------------+        |        +--------------------+
              |                    |        |        |                    |
              |  Socket.IO Server  |<-------+------->|  LowDB JSON        |
              |  (Real-time)       |                 |  Database          |
              |                    |                 |                    |
              +--------------------+                 +--------------------+
```

## Project Structure

```text
poc/
├── client/                  # React frontend
│   ├── public/              # Static files
│   │   ├── index.html       # Main HTML file
│   │   └── ...              # Other static assets
│   └── src/                 # React source code
│       ├── components/      # Reusable UI components
│       │   ├── Navbar.js    # Top navigation bar
│       │   ├── Sidebar.js   # Side navigation menu
│       │   └── ...          # Other components
│       ├── pages/           # Application pages
│       │   ├── Dashboard.js # Main dashboard
│       │   ├── Deals.js     # Deals management
│       │   └── ...          # Other pages
│       ├── utils/           # Utility functions
│       │   └── api.js       # API client configuration
│       └── App.js           # Main application component
├── server/                  # Node.js backend
│   ├── data/                # JSON database
│   │   └── db.json          # Database file
│   ├── public/              # Static files served by Express
│   │   └── ...              # Static HTML and assets
│   └── server.js            # Express server & API endpoints
└── package.json             # Project configuration
```

## Features

### Client Communication Dashboard

- Real-time deal tracking across various stages (bidding, negotiation, legals, exchange, completion)
- Automated weekly report generation for investment funds
- Visualization of portfolio metrics (units by type, funds required, deal stages)
- Comprehensive deal management interface with filtering capabilities
- Client management with configurable reporting preferences

### Internal Feedback System

- AI-assisted feedback submission process with smart categorization
- Multiple-choice suggestion generation for better context clarity
- Ticket creation with automated routing to relevant teams
- Real-time feedback status tracking and updates
- Historical feedback analysis capabilities

## Technology Stack

### Frontend

- **React 18**: Core UI library
- **Material-UI**: Component library for consistent design
- **Chart.js**: Data visualization
- **Socket.IO Client**: Real-time communication
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Socket.IO**: Real-time bi-directional communication
- **LowDB**: JSON file-based database (for demo purposes)
- **UUID**: Unique identifier generation
- **Morgan**: HTTP request logger middleware

### Deployment

- **Render.com**: Cloud hosting platform
- **Git**: Version control
- **Environment Variables**: Configuration management

## Demo Features

The POC includes several features specifically designed for demonstration:

- **Pre-populated Data**: Sample deals, clients, and feedback entries
- **Real-time Updates**: All changes are instantly reflected across all connected clients
- **Interactive UI**: Add deals, generate reports, and submit feedback with immediate visual feedback
- **Visual Dashboards**: Charts and graphs to visualize deal statistics
- **Simulated AI Integration**: Smart feedback categorization and multiple-choice generation
- **Example Investment Funds**: System includes multiple anonymous example investment funds with ability to add more

## Extending the POC

This POC is designed to be extended in several ways:

1. **Authentication**: Add user login and role-based permissions
2. **Notifications**: Implement email notifications for reports and feedback
3. **Database**: Replace LowDB with a production database like MongoDB or PostgreSQL
4. **Integration**: Connect with real CRM systems
5. **Advanced Analytics**: Add more sophisticated reporting capabilities
6. **Mobile Application**: Develop a companion mobile app for on-the-go access
7. **AI Enhancement**: Implement actual NLP for smarter feedback processing

## Technical Details

### API Endpoints

The server exposes the following key endpoints:

- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create a new deal
- `PUT /api/deals/:id` - Update a deal
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `GET /api/reports/:clientId` - Get reports for a specific client
- `POST /api/reports/generate/:clientId` - Generate a new report
- `GET /api/feedback` - Get all feedback entries
- `POST /api/feedback` - Submit new feedback
- `PUT /api/feedback/:id` - Update feedback status

### Real-Time Events

Socket.IO is used for real-time updates. The following events are emitted:

- `deal_created`, `deal_updated` - When a deal is created or updated
- `client_created`, `client_updated` - When a client is created or updated
- `report_generated` - When a new report is generated
- `feedback_created`, `feedback_updated` - When feedback is submitted or updated

## Notes for Presentation

- The demo is entirely self-contained and doesn't require external services
- All data is stored locally in JSON files
- Real-time updates are visible when multiple browsers are open
- The UI is responsive and works on mobile devices

## Troubleshooting

### Common Issues

1. **Port already in use**

   If you see an `EADDRINUSE` error:

   ```bash
   # Find and kill the process using the port
   lsof -i :5001
   kill -9 <PID>
   ```

2. **CORS Errors**

   If you see CORS errors in the browser console:

   - Check that the server is running on port 5001
   - Verify that the Socket.IO connection in `App.js` is using the correct URL
   - Make sure the CORS configuration in `server.js` is correct

3. **Database Reset**

   To reset the database to its original state:

   ```bash
   cp server/data/db.backup.json server/data/db.json
   ```

### Development Tips

- The client's proxy is configured in `client/package.json` to forward API requests to the server
- Edit `server/data/db.json` directly to make bulk changes to the data
- Use the React Developer Tools browser extension for debugging the frontend
- Socket.IO connection can be monitored in the Network tab of browser DevTools
