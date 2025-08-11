import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDeleteInventory, useGetInventoryByHousekeeper } from 'src/api/inventory';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function CleaningTaskTableRow({ row, selected, onSelectRow, housekeeperId }) {
  const { id, itemName, requestDate, quantity, status, roomId, room, category } = row;

  const confirm = useBoolean();
  const [loading, setLoading] = useState(false);
  const { deleteInventory } = useDeleteInventory();
  const { refreshInventory } = useGetInventoryByHousekeeper(housekeeperId);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteInventory(id, housekeeperId);
      await refreshInventory();
      confirm.onFalse();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2">
              Room #{roomId?.roomNumber || room || 'N/A'}
            </Typography>
            <Label
              variant="soft"
              color={
                (status === 'approved' && 'success') ||
                (status === 'requested' && 'warning') ||
                (status === 'rejected' && 'error') ||
                (status === 'received' && 'info') ||
                'default'
              }
            >
              {status}
            </Label>
          </Stack>

          <TextField
            label="Room Category"
            value={roomId?.roomType?.title || category || 'Unknown'}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </TableCell>

        <TableCell>{itemName}</TableCell>
        <TableCell>
          <Typography variant="body2">{fDate(requestDate)}</Typography>
        </TableCell>
        <TableCell>{quantity}</TableCell>

        <TableCell align="left" sx={{ px: 1 }}>
          {status === 'requested' && (
            <IconButton color="primary" onClick={confirm.onTrue} disabled={loading}>
              <Iconify icon="fluent:delete-28-regular" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button disabled={loading} variant="contained" color="error" onClick={handleDelete}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}

CleaningTaskTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  housekeeperId: PropTypes.string.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    requestDate: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['approved', 'requested', 'rejected', 'received']).isRequired,
    room: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    roomId: PropTypes.shape({
      roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      roomType: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
  }).isRequired,
  selected: PropTypes.bool,
};
