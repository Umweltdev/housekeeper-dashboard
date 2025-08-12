import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDeleteInventory, useGetInventoryByHousekeeper } from 'src/api/inventory';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function CleaningTaskTableRow({ row, selected, onSelectRow, housekeeperId }) {
  const { id, itemName, requestDate, quantity, status } = row;

  const confirm = useBoolean();
  const [loading, setLoading] = useState(false);
  const { deleteInventory } = useDeleteInventory();
  const { refreshInventory } = useGetInventoryByHousekeeper(housekeeperId);

  console.log('ROW_ID:', id);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteInventory(id, housekeeperId);
      await refreshInventory(); // Explicitly trigger refetch
      confirm.onFalse();
      setLoading(false);
    } catch (error) {
      // Error notification handled in useDeleteInventory
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{itemName}</TableCell>
        <TableCell>
          <Typography variant="body2">{fDate(requestDate)}</Typography>
        </TableCell>
        <TableCell>{quantity}</TableCell>
        <TableCell>
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
        </TableCell>

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
    roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    roomType: PropTypes.string,
    id: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    requestDate: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['approved', 'requested', 'rejected', 'received']).isRequired,
    housekeeperId: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
};
