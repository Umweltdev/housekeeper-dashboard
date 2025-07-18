import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { RoomDescriptionModal } from './room-description';

export default function RoomTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const { title, price, maxPeople, roomsAvailable = 0, description, images } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const descriptionModal = useBoolean(); // State for the description modal
  const navigate = useNavigate();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{title}</TableCell>
        <TableCell>{roomsAvailable}</TableCell>
        <TableCell>{`₦${price.toLocaleString()}`}</TableCell>
        <TableCell>{maxPeople} Adults</TableCell>
        <TableCell>
          {description.length > 50 ? `${description.substring(0, 30)}...` : description}
        </TableCell>
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Description Modal */}
      <RoomDescriptionModal
        open={descriptionModal.value}
        onClose={descriptionModal.onFalse}
        description={description}
        images={images} // Pass the images array to the modal
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            descriptionModal.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="eva:eye-outline" />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/dashboard/room/${row._id}`);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:document-text-bold" />
          Listed Rooms
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
        title="Delete Room"
        content="Are you sure you want to delete this room?"
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

RoomTableRow.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Add this line
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    maxPeople: PropTypes.number.isRequired,
    roomsAvailable: PropTypes.number,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};
