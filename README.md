# Smart Communication Pipelines POC

This is a proof of concept (POC) for a Smart Communication Pipelines solution that addresses two key areas:

1. **Client Communication Automation**: A dashboard that visualizes deal progress and can generate reports automatically for clients.
2. **Internal Feedback Mechanism**: A streamlined process for team members to submit feedback with AI-assisted clarification.

## Quick Start for Developers

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd hackathon-team4-poc/poc

# Install dependencies for both client and server
npm run setup

# Start the server (in one terminal)
cd server
npm start

# Start the client (in another terminal)
cd ../client
npm start
```

## Features

### Client Communication Dashboard

- Real-time deal tracking across various stages
- Automated report generation
- Visualization of portfolio metrics
- Deal management interface

### Internal Feedback System

- AI-assisted feedback submission process
- Multiple-choice suggestion generation
- Ticket creation
- Real-time feedback status tracking

## Technologies Used

- **Frontend**: React, Material-UI, Chart.js
- **Backend**: Node.js, Express
- **Database**: LowDB (JSON file-based database for demo purposes)
- **Real-time Updates**: Socket.IO

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Navigate to the project directory:

   ```bash
   cd poc
   ```

3. Install dependencies:

   ```bash
   # Install all dependencies (both client and server)
   npm run setup

   # Or install them separately
   cd server && npm install
   cd ../client && npm install
   ```

### Running the Application

#### Method 1: Running separately (recommended for development)

```bash
# Start the backend server (runs on port 5001)
cd server
npm start

# In a new terminal, start the frontend (runs on port 3000)
cd client
npm start
```

#### Method 2: Using the convenience script

```bash
# From the project root
npm start
```

This will:

- Start the backend server on port 5001
- Launch the frontend on port 3000
- Open the application in your default web browser

### Potential Issues and Solutions

If you encounter port conflicts:

- Server port (5001): Check if something is already running on this port with `lsof -i :5001`
- Client port (3000): React will usually offer to use a different port automatically

If you get CORS errors:

- Ensure you're using the correct ports (backend: 5001, frontend: 3000)
- Check that the CORS configuration in server.js allows your frontend origin

## Demo Guide

### Client Dashboard Demo

1. Navigate to the Dashboard to see an overview of all deals
2. Go to the Deals page to view, filter, and manage deals
3. Add a new deal to see real-time updates across the application
4. Visit the Client Reports page to generate and view client reports

### Internal Feedback Demo

1. Go to the Internal Feedback page
2. Click "Submit Feedback" to start the process
3. Enter a description of an issue, improvement, or feature request
4. See how the AI generates multiple options to clarify the feedback
5. Select an option and submit the feedback
6. Watch as the feedback appears in the list with real-time updates

## Project Structure

```text
poc/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # Reusable UI components
│       └── pages/        # Application pages
├── server/               # Node.js backend
│   ├── data/             # JSON database
│   └── server.js         # Express server
└── package.json          # Project configuration
```

## Extending the POC

This POC is designed to be extended in several ways:

1. **Authentication**: Add user login and role-based permissions
2. **Notifications**: Implement email notifications for reports and feedback
3. **Database**: Replace LowDB with a production database like MongoDB or PostgreSQL
4. **Integration**: Connect with real systems like Pipedrive
5. **Advanced Analytics**: Add more sophisticated reporting capabilities

## Technical Details

### API Endpoints

The server exposes the following key endpoints:

- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create a new deal
- `PUT /api/deals/:id` - Update a deal
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `GET /api/reports/:clientId` - Get reports for a specific client
- `POST /api/reports/:clientId` - Generate a new report

### Real-Time Updates

Socket.IO is used for real-time updates. The following events are emitted:

- `deal_updated` - When a deal is created or updated
- `report_generated` - When a new report is generated
- `feedback_submitted` - When new feedback is submitted

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
