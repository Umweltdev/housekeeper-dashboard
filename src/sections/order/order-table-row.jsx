import PropTypes from 'prop-types';

// Material UI Components
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// Custom Hooks and Components
import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { customerName, img, email, orderNumber, status, roomNumber, roomType, checkIn, checkOut, totalPrice } = row;
  
  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
      <TableCell padding="checkbox" sx={{ borderBottom: 'none' }}>
        <Checkbox 
          checked={selected} 
          onClick={onSelectRow}
          sx={{ '&.Mui-checked': { color: 'primary.main' } }}
        />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
        <Avatar 
          alt={customerName} 
          src={img} 
          sx={{ 
            mr: 2,
            width: 40,
            height: 40,
            border: '1px solid',
            borderColor: 'divider'
          }} 
        />
        <Box>
          <Typography variant="subtitle2" noWrap>
            {customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {email}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{ borderBottom: 'none' }}>
        <Box>
          <Typography variant="body2" noWrap>
            {fDate(checkIn)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fTime(checkIn)}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{ borderBottom: 'none' }}>
        <Typography fontWeight="medium">
          ₦{totalPrice.toLocaleString()}
        </Typography>
      </TableCell>

      <TableCell sx={{ borderBottom: 'none' }}>
        <Label
          variant="soft"
          color={
            (status === 'completed' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
          sx={{ 
            textTransform: 'capitalize',
            fontWeight: 'medium',
            borderRadius: 1
          }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell sx={{ borderBottom: 'none' }}>
        <Typography variant="body2">{roomType}</Typography>
      </TableCell>

      <TableCell sx={{ borderBottom: 'none' }}>
        <Typography variant="body2">{roomNumber}</Typography>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', borderBottom: 'none' }}>
        <IconButton
          size="small"
          onClick={collapse.onToggle}
          sx={{
            mr: 1,
            color: collapse.value ? 'primary.main' : 'text.secondary',
            '&:hover': { bgcolor: 'action.selected' }
          }}
        >
          <Iconify 
            icon={collapse.value ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"} 
            width={20} 
          />
        </IconButton>

        <IconButton 
          size="small"
          onClick={popover.onOpen}
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.selected' }
          }}
        >
          <Iconify icon="eva:more-vertical-fill" width={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z1,
            borderRadius: 1,
            m: 1,
            p: 2
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar 
              alt={customerName} 
              src={img} 
              sx={{ 
                width: 56, 
                height: 56,
                border: '1px solid',
                borderColor: 'divider'
              }} 
            />

            <Stack spacing={2} direction="row" sx={{ flexGrow: 1 }}>
              <Paper variant="outlined" sx={{ p: 1.5, flex: 1, borderRadius: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ₦{totalPrice.toLocaleString()}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, flex: 1, borderRadius: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  Check In
                </Typography>
                <Typography variant="subtitle1">
                  {fDate(checkIn)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fTime(checkIn)}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, flex: 1, borderRadius: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  Check Out
                </Typography>
                <Typography variant="subtitle1">
                  {fDate(checkOut)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fTime(checkOut)}
                </Typography>
              </Paper>
            </Stack>
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}

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
          sx={{ color: 'text.primary' }}
        >
          <Iconify icon="solar:eye-bold" width={18} sx={{ mr: 1 }} />
          Check-Out
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={18} sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm Deletion"
        content={
          <Typography>
            Are you sure you want to delete this booking? 
            <Box component="span" fontWeight="fontWeightBold">
              {` ${customerName}'s `}
            </Box>
            booking will be permanently removed.
          </Typography>
        }
        action={
          <Button 
            variant="contained" 
            color="error" 
            onClick={onDeleteRow}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Confirm Delete
          </Button>
        }
      />
    </>
  );
}

OrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};