import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
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
  onEditRow,
  onDeleteRow,
}) {
  const { room, category, description, dueDate, priority, status } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  const [markingCleaned, setMarkingCleaned] = useState(false);

  const canMarkAsCleaned = status === 'dirty';

  const handleMarkAsCleaned = async () => {
    setMarkingCleaned(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Trigger update event to parent
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('taskStatusUpdated', { detail: row.id });
      window.dispatchEvent(event);
    }

    setMarkingCleaned(false);
    popover.onClose();
  };

  const tooltipTitle = (() => {
    if (canMarkAsCleaned) return '';
    if (status === 'cleaned') return 'Already cleaned';
    return 'Cannot mark this task as cleaned';
  })();

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
              (status === 'cleaned' && 'success') ||
              (status === 'dirty' && 'error') ||
              (status === 'inspected' && 'info') ||
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
        sx={{ width: 200 }}
      >
        {/* Mark as Cleaned with highlight */}
        <Tooltip title={tooltipTitle}>
          <span>
            <MenuItem
              disabled={markingCleaned || !canMarkAsCleaned || status === 'cleaned'}
              onClick={handleMarkAsCleaned}
              sx={{
                bgcolor: 'success.main',
                color: 'common.white',
                borderRadius: 1,
                my: 1,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
                opacity: !canMarkAsCleaned || status === 'cleaned' ? 0.5 : 1,
              }}
            >
              {markingCleaned ? (
                <Iconify icon="eos-icons:loading" width={20} />
              ) : (
                <Iconify icon="ic:round-check-circle" />
              )}
              Mark as Cleaned
            </MenuItem>
          </span>
        </Tooltip>

        {/* Edit Option */}
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        {/* Delete Option */}
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      </CustomPopover>

      {/* Confirm Delete Dialog */}
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
  row: PropTypes.object,
  selected: PropTypes.bool,
};
