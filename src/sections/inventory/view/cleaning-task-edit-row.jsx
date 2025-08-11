import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDeleteInventory } from 'src/api/inventory';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function CleaningTaskTableRow({ row, selected, onSelectRow }) {
  const { id, itemName, requestDate, quantity, status, housekeeperId } = row;

  const confirm = useBoolean();
  const [loading, setLoading] = useState(false);
  const { deleteInventory } = useDeleteInventory();
  console.log(id);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteInventory(id, housekeeperId);
      confirm.onFalse();
      setLoading(false);
    } catch (error) {
      // Error notification handled in useDeleteInventory
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
            <IconButton color="primary" onClick={confirm.onTrue}>
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
            {loading ? 'Wait...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}

CleaningTaskTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.shape({
    id: PropTypes.string,
    itemName: PropTypes.string,
    requestDate: PropTypes.string,
    quantity: PropTypes.number,
    status: PropTypes.string,
    housekeeperId: PropTypes.string,
  }),
  selected: PropTypes.bool,
};
