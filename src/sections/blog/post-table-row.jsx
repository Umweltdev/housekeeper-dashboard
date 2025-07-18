import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import PostNewEditForm from './post-new-edit-form';
import PostQuickEditForm from './post-quick-edit-form';

export default function UserTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { customerName, img, email, orderNumber, status, roomNumber, roomType, rooms } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const [currentFormData, setCurrentFormData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleOpenViewDialog = () => {
    console.log('Raw row data:', row);
  
    // Transform the data to match what UserNewEditForm expects
    const formData = {
      _id: row._id,
      customer: {
        firstName: (row.customerName ? row.customerName.split(' ')[0] : ''),
        lastName: (row.customerName ? row.customerName.split(' ').slice(1).join(' ') : ''),
        email: row.email || '',
        phone: row.phoneNumber || '',
        img: row.img || null
      },
      status: row.stats || 'Checked-Out',
      city: row.city || '',
      country: row.country || '',
      rooms: [{
        roomId: {
          _id: row._id || '', // Using booking ID as fallback
          roomNumber: row.roomNumber || '',
          floor: row.floor, // Default empty if not available
          roomType: {
            title: row.roomType || '',
            price: row.status || 0,
            images: row.roomImg ? [row.roomImg] : []
          }
        },
        checkIn: row.checkIn, // Default empty if not available
        checkOut: row.checkOut, // Default empty if not available
        tPrice: row.status || 0
      }],
      additionalCharges: row.additionalCharges || 0
    };
  
    console.log('Transformed form data:', formData);
    setCurrentFormData(formData);
    setViewDialogOpen(true);
    popover.onClose();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={customerName} src={img} sx={{ mr: 2 }} />

          <ListItemText
            primary={`${customerName}`}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{status}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{orderNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{roomType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{roomNumber}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <PostQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={handleOpenViewDialog}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      {/* View Dialog */}
<Dialog
  open={viewDialogOpen}
  onClose={handleCloseViewDialog}
  maxWidth="md"
  fullWidth
  sx={{
    '& .MuiDialog-paper': {
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }}
>
  {currentFormData && (
    <>
      <Box sx={{ 
        overflowY: 'auto',  // Vertical scrolling only
        px: 3,             // Add some horizontal padding
        flex: 1            // Take up available space
      }}>
        <PostNewEditForm 
          currentUser={currentFormData}
          onClose={handleCloseViewDialog}
        />
      </Box>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'flex-end',
        flexShrink: 0  // Prevent button from being squished
      }}>
        <Button 
          onClick={handleCloseViewDialog} 
          variant="contained"
        >
          Close
        </Button>
      </Box>
    </>
  )}
</Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};