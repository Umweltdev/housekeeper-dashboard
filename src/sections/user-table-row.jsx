import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // ✅ Import spinner

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import UserNewEditForm from './user-new-edit-form';
import UserQuickEditForm from './user-quick-edit-form';

export default function UserTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { subject, status, priority, category, createdAt, description, images } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const [currentFormData, setCurrentFormData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ✅ Loading state

  const statusColorMap = {
    open: 'warning',
    'in-progress': 'info',
    resolved: 'success',
    closed: 'default',
  };

  const priorityColorMap = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  };

  const handleOpenViewDialog = () => {
    const formData = {
      _id: row._id,
      subject: row.subject,
      description: row.description,
      status: row.status,
      priority: row.priority,
      category: row.category,
      images: row.images || [],
      createdAt: row.createdAt,
    };

    setCurrentFormData(formData);
    setViewDialogOpen(true);
    popover.onClose();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setIsSaving(false);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);

    // Simulate async save
    setTimeout(() => {
      setIsSaving(false);
      setViewDialogOpen(false);
    }, 1500);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {subject}
          </Typography>
        </TableCell>

        <TableCell>
          <Chip
            label={status}
            color={statusColorMap[status] || 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
        </TableCell>

        <TableCell>
          <Chip
            label={priority}
            color={priorityColorMap[priority] || 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {category}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{formatDate(createdAt)}</Typography>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton
            color={popover.open ? 'primary' : 'default'}
            onClick={popover.onOpen}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.lighter',
              },
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 160 }}>
        <MenuItem onClick={handleOpenViewDialog} sx={{ color: 'text.secondary' }}>
          <Iconify icon="solar:eye-bold" width={18} sx={{ mr: 1 }} />
          View Details
        </MenuItem>

        <MenuItem onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
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
            overflow: 'hidden',
          },
        }}
      >
        {currentFormData && (
          <>
            <Box
              sx={{
                overflowY: 'auto',
                px: 3,
                pt: 3,
                flex: 1,
              }}
            >
              <UserNewEditForm currentUser={currentFormData} onClose={handleCloseViewDialog} />
            </Box>

            <Box
              sx={{
                p: 2,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'background.paper',
              }}
            >
              <Stack direction="row" spacing={1.5}>
                <Button
                  onClick={handleCloseViewDialog}
                  variant="outlined"
                  sx={{ minWidth: 100 }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSaveChanges}
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 100, position: 'relative' }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{
                          color: 'common.white',
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          marginTop: '-10px',
                          marginLeft: '-10px',
                        }}
                      />
                      <Box sx={{ opacity: 0 }}>Save Changes</Box>
                    </>
                  ) : (
                    'Save Changes'
                  )}
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
            Are you sure you want to delete this complaint? This action cannot be undone.
          </Typography>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={onDeleteRow}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
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
