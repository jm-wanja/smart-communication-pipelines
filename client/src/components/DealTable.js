import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

function DealStatusChip({ stage }) {
  let color = 'default';

  switch (stage) {
    case 'bidding':
      color = 'info';
      break;
    case 'negotiation':
      color = 'warning';
      break;
    case 'legals':
      color = 'primary';
      break;
    case 'exchange':
      color = 'secondary';
      break;
    case 'completion':
      color = 'success';
      break;
    default:
      color = 'default';
  }

  return <Chip label={stage.charAt(0).toUpperCase() + stage.slice(1)} color={color} size="small" />;
}

function DealTable({ deals, showActions = true }) {
  const navigate = useNavigate();

  if (!deals || deals.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No deals to display
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>
              <Typography variant="subtitle2">Title</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Type</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Region</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Builder</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Units</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Stage</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Legal Stage</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Projected Exchange</Typography>
            </TableCell>
            {showActions && (
              <TableCell>
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id} hover>
              <TableCell>{deal.title}</TableCell>
              <TableCell>{deal.type === 'retrofit' ? 'Retrofit' : 'New Build'}</TableCell>
              <TableCell>{deal.region}</TableCell>
              <TableCell>{deal.builder}</TableCell>
              <TableCell>{deal.units}</TableCell>
              <TableCell>
                <DealStatusChip stage={deal.stage} />
              </TableCell>
              <TableCell>{deal.legal_stage}</TableCell>
              <TableCell>{new Date(deal.projected_exchange_date).toLocaleDateString()}</TableCell>
              {showActions && (
                <TableCell>
                  <Tooltip title="Edit Deal">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/deals/edit/${deal.id}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <IconButton size="small" color="secondary" onClick={() => navigate(`/deals/edit/${deal.id}`)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DealTable;
