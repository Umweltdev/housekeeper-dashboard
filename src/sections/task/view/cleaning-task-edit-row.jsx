import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CleaningTaskTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const { room, category, description, dueDate, priority, status, createDate } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{room}</TableCell>
        <TableCell>{category}</TableCell>
        <TableCell>{description}</TableCell>

        <TableCell>
          <Typography variant="body2">{fDate(dueDate)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {fTime(dueDate)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{
              color:
                (priority === 'High' && 'error.main') ||
                (priority === 'Medium' && 'warning.main') ||
                (priority === 'Low' && 'success.main') ||
                'text.primary',
              fontWeight: 600,
            }}
          >
            {priority}
          </Typography>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'completed' && 'success') ||
              (status === 'pending' && 'warning') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

CleaningTaskTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
