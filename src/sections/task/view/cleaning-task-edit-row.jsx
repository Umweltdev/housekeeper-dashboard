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
import { useMarkAsCleaned } from 'src/api/task';

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
  onUpdateStatus,
}) {
  const { room, category, description, dueDate, priority, status, _id } = row;
  const [localStatus, setLocalStatus] = useState(status); // Local state for optimistic updates
  const confirm = useBoolean();
  const popover = usePopover();
  const { markAsCleaned, isLoading: markingCleaned } = useMarkAsCleaned();

  const canMarkAsCleaned = localStatus === 'dirty' || localStatus === 'cleaned';

  const handleMarkAsCleaned = async () => {
    const newStatus = localStatus === 'dirty' ? 'cleaned' : 'dirty';
    try {
      // Optimistic update
      setLocalStatus(newStatus);
      onUpdateStatus(_id, newStatus); // Notify parent immediately
      await markAsCleaned(_id); // Call the hook's function
      popover.onClose();
    } catch (error) {
      // Revert optimistic update on error
      setLocalStatus(status);
      onUpdateStatus(_id, status);
    }
  };

  const tooltipTitle = (() => {
    if (canMarkAsCleaned) return localStatus === 'dirty' ? 'Mark as Cleaned' : 'Mark as Dirty';
    if (localStatus === 'inspected') return 'Cannot toggle status for inspected tasks';
    return 'Cannot mark this task';
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
                (priority === 'high' && 'error.main') ||
                (priority === 'medium' && 'warning.main') ||
                (priority === 'low' && 'success.main') ||
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
              (localStatus === 'cleaned' && 'success') ||
              (localStatus === 'dirty' && 'error') ||
              (localStatus === 'inspected' && 'info') ||
              'default'
            }
          >
            {localStatus}
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
        <Tooltip title={tooltipTitle}>
          <span>
            <MenuItem
              disabled={markingCleaned || !canMarkAsCleaned}
              onClick={handleMarkAsCleaned}
              sx={{
                bgcolor: localStatus === 'dirty' ? 'success.main' : 'warning.main',
                color: 'common.white',
                borderRadius: 1,
                my: 1,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: localStatus === 'dirty' ? 'success.dark' : 'warning.dark',
                },
                opacity: !canMarkAsCleaned ? 0.5 : 1,
              }}
            >
              {markingCleaned ? (
                <Iconify icon="eos-icons:loading" width={20} />
              ) : (
                <Iconify
                  icon={localStatus === 'dirty' ? 'ic:round-check-circle' : 'ic:round-warning'}
                />
              )}
              {localStatus === 'dirty' ? 'Mark as Cleaned' : 'Mark as Dirty'}
            </MenuItem>
          </span>
        </Tooltip>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this task?"
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
  onUpdateStatus: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
