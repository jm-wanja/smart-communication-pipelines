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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import axios from 'axios';
import FeedbackIcon from '@mui/icons-material/Feedback';
import BugReportIcon from '@mui/icons-material/BugReport';
import EnhancementIcon from '@mui/icons-material/AutoFixHigh';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

function InternalFeedback({ socket }) {
  const [loading, setLoading] = useState(true);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    from_team: 'Valuations',
    to_team: 'Tech',
    issue_type: 'Bug',
    description: '',
  });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('/api/feedback');
        setFeedbackItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      }
    };

    fetchFeedback();

    // Socket event listeners for real-time updates
    socket.on('feedback_created', (newFeedback) => {
      setFeedbackItems((prev) => [newFeedback, ...prev]);
    });

    socket.on('feedback_updated', (updatedFeedback) => {
      setFeedbackItems((prev) => prev.map((item) => (item.id === updatedFeedback.id ? updatedFeedback : item)));
    });

    return () => {
      socket.off('feedback_created');
      socket.off('feedback_updated');
    };
  }, [socket]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setStep(1);
    setFormData({
      from_team: 'Valuations',
      to_team: 'Tech',
      issue_type: 'Bug',
      description: '',
    });
    setAiSuggestions([]);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitDescription = (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setError('Please provide a description of the issue');
      return;
    }

    setError('');

    // Simulate AI generating multiple-choice options
    setTimeout(() => {
      const suggestions = generateAiSuggestions(formData.description, formData.issue_type);
      setAiSuggestions(suggestions);
      setStep(2);
    }, 1000);
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      description: suggestion,
    }));
    setStep(3);
  };

  const handleSubmitFeedback = async () => {
    try {
      await axios.post('/api/feedback', formData);
      setSuccess('Feedback submitted successfully');
      setTimeout(() => {
        setDialogOpen(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    }
  };

  const generateAiSuggestions = (description, issueType) => {
    // Simulate AI-generated suggestions based on description and issue type
    if (issueType === 'Bug') {
      return [
        `Bug: ${description}. The issue occurs consistently when loading large datasets.`,
        `Bug: ${description}. This happens only in certain browsers (Chrome, Firefox).`,
        `Bug: ${description}. The error appears after the system has been running for several hours.`,
      ];
    } else if (issueType === 'Improvement') {
      return [
        `Improvement request: ${description}. This would enhance user workflow by reducing steps needed.`,
        `Improvement request: ${description}. Similar functionality exists in competitive products.`,
        `Improvement request: ${description}. This would address frequent user complaints about process efficiency.`,
      ];
    } else {
      return [
        `Feature request: ${description}. This would enable new capabilities for users.`,
        `Feature request: ${description}. This feature is essential for upcoming client requirements.`,
        `Feature request: ${description}. This would bring the product in line with industry standards.`,
      ];
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" size="small" />;
      case 'In Progress':
        return <Chip icon={<HourglassEmptyIcon />} label="In Progress" color="primary" size="small" />;
      case 'Pending':
      default:
        return <Chip icon={<PriorityHighIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  const getAvatarForIssueType = (type) => {
    switch (type) {
      case 'Bug':
        return <BugReportIcon />;
      case 'Improvement':
        return <EnhancementIcon />;
      case 'Feature':
        return <FeedbackIcon />;
      default:
        return <FeedbackIcon />;
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
          Internal Feedback
        </Typography>
        <Button variant="contained" color="primary" startIcon={<FeedbackIcon />} onClick={handleOpenDialog}>
          Submit Feedback
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Feedback
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {feedbackItems.length > 0 ? (
              <List>
                {feedbackItems.map((item) => (
                  <ListItem
                    key={item.id}
                    alignItems="flex-start"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: item.issue_type === 'Bug' ? '#f44336' : item.issue_type === 'Improvement' ? '#3f51b5' : '#4caf50' }}>
                        {getAvatarForIssueType(item.issue_type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span">
                            {item.from_team} to {item.to_team}
                          </Typography>
                          {getStatusChip(item.status)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', mt: 1 }}>
                            {item.issue_type}: {item.description}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Submitted: {new Date(item.created_at).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No feedback items found. Be the first to submit feedback!
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How It Works
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                1. Submit Your Feedback
              </Typography>
              <Typography variant="body2" paragraph>
                Describe the issue, improvement, or feature you'd like to suggest. Be specific about what you're experiencing or what you need.
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                2. AI-Generated Options
              </Typography>
              <Typography variant="body2" paragraph>
                Our system will analyze your description and generate multiple-choice options to clarify and categorize your feedback.
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                3. Select Best Match
              </Typography>
              <Typography variant="body2" paragraph>
                Choose the option that best represents your feedback or edit as needed.
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                4. Ticket Generation
              </Typography>
              <Typography variant="body2" paragraph>
                The system automatically creates a ticket with all the relevant details and assigns it to the appropriate team.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" startIcon={<FeedbackIcon />} onClick={handleOpenDialog} fullWidth>
                  Submit New Feedback
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {step === 1
            ? 'Submit Feedback - Step 1: Describe Issue'
            : step === 2
            ? 'Submit Feedback - Step 2: Select Option'
            : 'Submit Feedback - Step 3: Confirm Submission'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {step === 1 && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="from-team-label">From Team</InputLabel>
                  <Select
                    labelId="from-team-label"
                    id="from_team"
                    name="from_team"
                    value={formData.from_team}
                    onChange={handleChange}
                    label="From Team"
                  >
                    <MenuItem value="Valuations">Valuations</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Legal">Legal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="to-team-label">To Team</InputLabel>
                  <Select labelId="to-team-label" id="to_team" name="to_team" value={formData.to_team} onChange={handleChange} label="To Team">
                    <MenuItem value="Tech">Tech</MenuItem>
                    <MenuItem value="Product">Product</MenuItem>
                    <MenuItem value="UX/UI">UX/UI</MenuItem>
                    <MenuItem value="Data">Data</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="issue-type-label">Issue Type</InputLabel>
                  <Select
                    labelId="issue-type-label"
                    id="issue_type"
                    name="issue_type"
                    value={formData.issue_type}
                    onChange={handleChange}
                    label="Issue Type"
                  >
                    <MenuItem value="Bug">Bug</MenuItem>
                    <MenuItem value="Improvement">Improvement</MenuItem>
                    <MenuItem value="Feature">Feature Request</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue, improvement, or feature you'd like to suggest..."
                />
              </Grid>
            </Grid>
          )}

          {step === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Based on your description, here are some suggested options:
              </Typography>
              <List>
                {aiSuggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSelectSuggestion(suggestion)}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(63, 81, 181, 0.08)',
                      },
                    }}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary">
                Click on the option that best represents your feedback.
              </Typography>
            </Box>
          )}

          {step === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Feedback Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    From Team
                  </Typography>
                  <Typography variant="body1">{formData.from_team}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    To Team
                  </Typography>
                  <Typography variant="body1">{formData.to_team}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Issue Type
                  </Typography>
                  <Typography variant="body1">{formData.issue_type}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                    <Typography variant="body1">{formData.description}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {step === 1 && (
            <Button onClick={handleSubmitDescription} variant="contained" color="primary" disabled={!formData.description.trim()}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button onClick={() => setStep(1)} variant="outlined">
              Back
            </Button>
          )}
          {step === 3 && (
            <>
              <Button onClick={() => setStep(2)} variant="outlined">
                Back
              </Button>
              <Button onClick={handleSubmitFeedback} variant="contained" color="primary">
                Submit Feedback
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InternalFeedback;
