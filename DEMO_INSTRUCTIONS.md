# Smart Communication Pipelines - Demo Instructions

This document provides step-by-step instructions for demonstrating the Smart Communication Pipelines POC application. Follow these steps in order to showcase all key features of the system.

## Initial Setup

1. Ensure the application is running:

   ```bash
   cd /Users/juliemugira/Projects/hackathon-team4-poc/poc
   npm start
   ```

   This will start both the backend server and frontend application.

2. Open the application in your browser: http://localhost:3000

## Demo Flow

### 1. Dashboard Overview (2-3 minutes)

1. **Start at the Dashboard**

   - Explain the key metrics shown: Total Deals, Total Units, Legal Progress, and Funds Required
   - Point out that the dashboard gives a real-time overview of all deals across clients
   - Note the visualization of deals by stage and region

2. **Add a New Deal**
   - Click the "Add New Deal" button in the top right
   - Fill in the form with the following details:
     - Client: Highbrook Investments
     - Deal Title: Edinburgh City Center Apartments
     - Type: New Build
     - Region: Edinburgh
     - Builder: Scottish Construction Ltd
     - Units: 10
     - Stage: Bidding
     - Legal Stage: Not Started
     - Projected Exchange Date: 2025-09-15
     - Projected Completion Date: 2025-11-30
     - Funds Required: 2,800,000
   - Click "Submit" to add the deal
   - Point out how the dashboard metrics update in real-time

### 2. Deals Management (2-3 minutes)

1. **Navigate to the Deals Page**

   - Click "Deals" in the sidebar
   - Show how all deals are displayed in a table format
   - Demonstrate the search functionality by typing "London" in the search bar

2. **Use Filters**

   - Click the "Filters" button
   - Filter by "Stage: Negotiation"
   - Show how the table updates to display only deals in the negotiation stage
   - Clear the filters

3. **Edit a Deal**
   - Click the edit icon next to any deal
   - Modify the "Stage" to move it forward (e.g., from "Bidding" to "Negotiation")
   - Update the "Legal Stage" as well
   - Click "Save Changes"
   - Return to the Deals page to show the updated status

### 3. Client Reporting (3-4 minutes)

1. **Navigate to Client Reports**

   - Click "Client Reports" in the sidebar
   - It will default to showing Highbrook Investments

2. **Generate a New Report**

   - Click the "Generate New Report" button
   - Point out how the report captures all current deal information
   - Explain that this would normally be sent automatically on a schedule

3. **Email Report Demo**

   - Click the three dots menu in the top right
   - Select "Email Report"
   - Show the pre-populated email form
   - Explain how this would replace the manual weekly emails currently sent

4. **View Historical Reports**

   - Click the "Historical Reports" tab
   - Show the list of previously generated reports (including the one just created)

5. **View Another Client's Report**

   - Use the navigation to switch to Cerberus Capital's report
   - Generate a report for this client as well
   - Compare the differences in portfolio metrics

6. **View Moorfield's Report**
   - Switch to Moorfield's report
   - Point out the Edinburgh Mixed-Use Development deal
   - Explain how the system is designed to easily accommodate new clients

### 4. Client Management (2-3 minutes)

1. **Navigate to Clients Page**

   - Click "Clients" in the sidebar
   - Show the list of all clients: Highbrook Investments, Cerberus Capital, and Moorfield

2. **Add a New Client**

   - Click the "Add New Client" button
   - Fill in the form:
     - Name: Blackstone Real Estate
     - Email: (use reports@ followed by blackstone.example.com)
     - Report Frequency: Weekly
   - Click "Add Client"
   - Show how the new client appears in the list immediately

3. **Edit an Existing Client**
   - Click the edit icon next to any client
   - Modify some details (e.g., change report frequency to Monthly)
   - Click "Save Changes"
   - Explain how this makes it easy to add and manage clients as the business grows

### 5. Internal Feedback System (3-4 minutes)

1. **Navigate to Internal Feedback**

   - Click "Internal Feedback" in the sidebar
   - Explain the current process pain points this solves

2. **Submit New Feedback**

   - Click the "Submit Feedback" button
   - Fill in the form:
     - From Team: Valuations
     - To Team: Tech
     - Issue Type: Bug
     - Description: "The property valuation tool crashes when processing portfolios with more than 50 properties at once"
   - Click "Next"

3. **AI-Generated Options**

   - Show the AI-generated multiple-choice options
   - Select one of the options
   - Proceed to the confirmation screen
   - Submit the feedback

4. **Demonstrate Real-Time Updates**
   - Point out how the feedback appears in the list immediately
   - Explain how this streamlines communication between teams

## Wrap-up and Q&A (2-3 minutes)

1. **Return to the Dashboard**

   - Show how all the changes made during the demo are reflected
   - Emphasize the real-time nature of the system

2. **Summarize Key Benefits**

   - Automated client reporting saves time and reduces errors
   - Real-time deal tracking improves transparency
   - Streamlined internal feedback improves cross-team communication
   - Centralized system provides a single source of truth

3. **Discuss Future Enhancements**

   - Integration with Pipedrive
   - Automated email notifications
   - Mobile app for on-the-go updates
   - Advanced analytics and forecasting

4. **Answer Questions**

## Post-Demo Reset (if needed)

If you need to reset the application for another demo:

1. Stop the application (Ctrl+C in the terminal)
2. Restore the original database by copying the backup:

   ```bash
   cp /Users/juliemugira/Projects/hackathon-team4-poc/poc/server/data/db.backup.json /Users/juliemugira/Projects/hackathon-team4-poc/poc/server/data/db.json
   ```

3. Restart the application:

   ```bash
   npm start
   ```

## Troubleshooting

If you encounter any issues during the demo:

1. **No deals showing up?**

   - Check that the server is running (terminal should show "Server running on port 5000")
   - Verify the db.json file has data (should be in /poc/server/data/db.json)

2. **Changes not reflecting in real-time?**

   - Check that Socket.IO is working (terminal should show "New client connected" messages)
   - Try refreshing the page if needed

3. **Application crashes?**
   - Check the terminal for error messages
   - Restart both the server and client applications

## Adding Future Clients

The system is designed to easily accommodate new clients. Here's how to add a new client:

1. **Through the UI (Preferred Method)**

   - Navigate to the Clients page (accessible from the sidebar)
   - Click the "Add New Client" button
   - Fill in the client details:
     - Name: [Client Name]
     - Email: [Client Email]
     - Report Frequency: [Weekly/Monthly]
   - Click "Submit" to add the client
   - The new client will be immediately available throughout the system

2. **Directly in the Database (For Bulk Updates)**

   - Stop the application (Ctrl+C in the terminal)
   - Edit the db.json file:

   ```bash
   nano /Users/juliemugira/Projects/hackathon-team4-poc/poc/server/data/db.json
   ```

   - Add a new client object to the "clients" array with the following structure:

   ```json
   {
     "id": "[Unique ID]",
     "name": "[Client Name]",
     "email": "[Client Email]",
     "report_frequency": "[weekly/monthly]"
   }
   ```

   - Save the file and restart the application:

   ```bash
   npm start
   ```
