import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { _addressBooks } from 'src/_mock';
import { useGetBookings } from 'src/api/booking';

import Iconify from 'src/components/iconify';

import { AddressListDialog } from '../address';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const [addressList, setAddressList] = useState(_addressBooks);
  const { bookings } = useGetBookings();

  const { invoiceFrom, invoiceTo } = values;

  const from = useBoolean();

  const to = useBoolean();

  const createDialog = useBoolean();
  const editDialog = useBoolean();

  const createDialogTo = useBoolean();
  const editDialogTo = useBoolean();

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={
          <Divider
            flexItem
            orientation={mdUp ? 'vertical' : 'horizontal'}
            sx={{ borderStyle: 'dashed' }}
          />
        }
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              From:
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton onClick={createDialog.onTrue}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
              <IconButton onClick={editDialog.onTrue}>
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">{invoiceFrom.name}</Typography>
            <Typography variant="body2">{invoiceFrom.fullAddress}</Typography>
            <Typography variant="body2"> {invoiceFrom.phoneNumber}</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              To:
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton onClick={createDialogTo.onTrue}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
              <IconButton onClick={editDialogTo.onTrue}>
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{invoiceTo?.name}</Typography>
            <Typography variant="body2">{invoiceTo?.fullAddress}</Typography>
            <Typography variant="body2"> {invoiceTo?.phoneNumber}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <AddressListDialog
        title="Customers"
        open={createDialog.value}
        onClose={createDialog.onFalse}
        selected={(selectedId) => invoiceFrom?.id === selectedId}
        onSelect={(address) => setValue('invoiceFrom', address)}
        list={_addressBooks}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: 'flex-end' }}
          >
            New
          </Button>
        }
      />

      <AddressListDialog
        title="Customers"
        open={createDialogTo.value}
        onClose={createDialogTo.onFalse}
        selected={(selectedId) => invoiceTo?.id === selectedId}
        onSelect={(address) => setValue('invoiceTo', address)}
        list={bookings.map((booking) => booking.customer)}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: 'flex-end' }}
          >
            New
          </Button>
        }
      />

      <CreateAddress
        open={editDialog.value}
        onClose={editDialog.onFalse}
        dialog={editDialog}
        value="invoiceFrom"
        setValue={setValue}
        title="Add From Address"
        addressList={addressList}
        setAddressList={setAddressList}
      />

      <CreateAddress
        open={editDialogTo.value}
        onClose={editDialogTo.onFalse}
        dialog={editDialogTo}
        value="invoiceTo"
        setValue={setValue}
        title="Add To Address"
        addressList={addressList}
        setAddressList={setAddressList}
      />
    </>
  );
}

const CreateAddress = ({
  open,
  onClose,
  dialog,
  value,
  setValue,
  title,
  addressList,
  setAddressList,
}) => {
  const [obj, setObj] = useState({ name: '', fullAddress: '', phoneNumber: '' });

  const handleSubmit = () => {
    setValue(value, obj);
    setAddressList([obj, ...addressList]);
    setObj({ name: '', fullAddress: '', phoneNumber: '' });
    dialog.onFalse();
  };
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <Stack sx={{ p: 3 }} gap={4}>
          <Typography variant="h6"> {title} </Typography>

          <TextField
            name="name"
            value={obj.name}
            onChange={(event) => {
              setObj({ ...obj, name: event.target.value });
            }}
            label="Full Name"
          />
          <TextField
            name="fullAddress"
            value={obj.fullAddress}
            onChange={(event) => {
              setObj({ ...obj, fullAddress: event.target.value });
            }}
            label="Full-Address"
          />
          <TextField
            name="phoneNumber"
            value={obj.phoneNumber}
            onChange={(event) => {
              setObj({ ...obj, phoneNumber: event.target.value });
            }}
            label="Phone-Number"
          />

          <Button size="large" variant="outlined" color="inherit" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Dialog>
  );
};

CreateAddress.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dialog: PropTypes.any,
  value: PropTypes.string,
  setValue: PropTypes.any,
  title: PropTypes.string,
  addressList: PropTypes.array,
  setAddressList: PropTypes.any,
};
