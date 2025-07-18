import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import UserNewEditForm from './user-new-edit-form';
import UserQuickEditForm from './user-quick-edit-form';

const statusColorMap = {
  'Checked-In': 'success',
  'Checked-Out': 'error',
  'Pending': 'warning',
  'Cancelled': 'default',
};

export default function UserTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { customerName, img, email, orderNumber, status, roomNumber, roomType, rooms } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const [currentFormData, setCurrentFormData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleOpenViewDialog = () => {
    console.log('Raw row data:', row);
  
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
          _id: row._id || '',
          roomNumber: row.roomNumber || '',
          floor: row.floor,
          roomType: {
            title: row.roomType || '',
            price: row.status || 0,
            images: row.roomImg ? [row.roomImg] : []
          }
        },
        checkIn: '',
        checkOut: '',
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
      <TableRow hover selected={selected} sx={{ '&:last-child td': { border: 0 } }}>
        <TableCell padding="checkbox" sx={{ pl: 2 }}>
          <Checkbox 
            checked={selected} 
            onClick={onSelectRow} 
            color="primary"
            sx={{ '&.Mui-checked': { color: 'primary.main' } }}
          />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <Avatar 
            alt={customerName} 
            src={img} 
            sx={{ 
              mr: 2,
              width: 40,
              height: 40,
              backgroundColor: 'primary.lighter',
              color: 'primary.dark'
            }}
          >
            {!img && customerName?.charAt(0)}
          </Avatar>

          <ListItemText
            primary={
              <Typography variant="subtitle2" noWrap>
                {customerName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary" noWrap>
                {email}
              </Typography>
            }
          />
        </TableCell>

        <TableCell>
        <Typography variant="body2" fontWeight="medium">
            {status}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {orderNumber}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {roomType}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {roomNumber}
          </Typography>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton 
            color={popover.open ? 'primary' : 'default'} 
            onClick={popover.onOpen}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.lighter'
              }
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem 
          onClick={handleOpenViewDialog}
          sx={{ color: 'text.secondary' }}
        >
          <Iconify icon="solar:eye-bold" width={18} sx={{ mr: 1 }} />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
          sx={{ color: 'text.secondary' }}
        >
          <Iconify icon="solar:pen-bold" width={18} sx={{ mr: 1 }} />
          Check-In
        </MenuItem>

        <MenuItem
          onClick={confirm.onTrue}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={18} sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </CustomPopover>

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        {currentFormData && (
          <>
            <Box sx={{ 
              overflowY: 'auto',
              px: 3,
              pt: 3,
              flex: 1
            }}>
              <UserNewEditForm 
                currentUser={currentFormData}
                onClose={handleCloseViewDialog}
              />
            </Box>
            <Box sx={{ 
              p: 2,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: 'background.paper'
            }}>
              <Stack direction="row" spacing={1.5}>
                <Button 
                  onClick={handleCloseViewDialog}
                  variant="outlined"
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCloseViewDialog} 
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 100 }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm Delete"
        content={
          <Typography variant="body2">
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
        }
        action={
          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="contained" 
              color="error" 
              onClick={onDeleteRow}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Delete
            </Button>
          </Stack>
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