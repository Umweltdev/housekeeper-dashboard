import sum from 'lodash/sum';
import { useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// File Path: /components/InvoiceNewEditDetails.js

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const subTotal = sum(totalOnRow);

  const totalAmount = sum(totalOnRow);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      title: '',
      description: '', // Added description field
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const handleChangeQuantity = useCallback(
    (event, index) => {
      const quantity = Number(event.target.value);
      setValue(`items[${index}].quantity`, quantity);
      const price = values.items[index]?.price || 0;
      setValue(`items[${index}].total`, quantity * price);
    },
    [setValue, values.items]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      const price = Number(event.target.value);
      setValue(`items[${index}].price`, price);
      const quantity = values.items[index]?.quantity || 0;
      setValue(`items[${index}].total`, quantity * price);
    },
    [setValue, values.items]
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>
          {`₦${subTotal.toLocaleString()}` || '-'}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{`₦${totalAmount.toLocaleString()}` || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFTextField
                size="small"
                name={`items[${index}].title`}
                label="Title"
                placeholder="Enter title"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 350 }}
              />

              <RHFTextField
                size="small"
                name={`items[${index}].description`}
                label="Description"
                placeholder="Enter description"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 350 }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].quantity`}
                label="Days"
                placeholder="0"
                onChange={(event) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 96 } }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].price`}
                label="Price"
                placeholder="0.00"
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>₦</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 96 } }}
              />

              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`items[${index}].total`}
                label="Total"
                placeholder="0.00"
                value={values.items[index]?.total === 0 ? '' : values.items[index].total.toFixed(2)}
                sx={{
                  maxWidth: { md: 104 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>
      </Stack>

      {renderTotal}
    </Box>
  );
}
// repost