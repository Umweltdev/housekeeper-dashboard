import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { _addressBooks } from 'src/_mock';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditAddress from './invoice-new-edit-address';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();

  const loadingSend = useBoolean();
  const { enqueueSnackbar } = useSnackbar();

  const NewInvoiceSchema = Yup.object().shape({
    invoiceTo: Yup.mixed().nullable().required('Invoice to is required'),
    createDate: Yup.mixed().nullable().required('Create date is required'),
    dueDate: Yup.mixed()
      .required('Due date is required')
      .test(
        'date-min',
        'Due date must be later than create date',
        (value, { parent }) => value.getTime() > parent.createDate.getTime()
      ),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          title: Yup.string().required('Title is required'),
          quantity: Yup.number()
            .required('Quantity is required')
            .min(1, 'Quantity must be more than 0'),
        })
      )
    ),
    // not required
    // taxes: Yup.number(),
    status: Yup.string(),
    // discount: Yup.number(),
    // shipping: Yup.number(),
    invoiceFrom: Yup.mixed(),
    totalAmount: Yup.number(),
    invoiceNumber: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      invoiceNumber:
        currentInvoice?.invoiceNumber || `INV ${Math.floor(1000 + Math.random() * 9000)}`,
      createDate: new Date(currentInvoice?.createDate) || new Date(),
      dueDate: new Date(currentInvoice?.dueDate) || null,
      // taxes: currentInvoice?.taxes || 0,
      // shipping: currentInvoice?.shipping || 0,
      status: currentInvoice?.status || 'draft',
      // discount: currentInvoice?.discount || 0,
      invoiceFrom: currentInvoice?.invoiceFrom || _addressBooks[0],
      invoiceTo: currentInvoice?.invoiceTo || null,
      items: currentInvoice?.items || [
        {
          title: '',
          description: '',
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
      totalAmount: currentInvoice?.totalAmount || 0,
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentInvoice) {
      reset(defaultValues);
    }
  }, [currentInvoice, defaultValues, reset]);

  // const handleSaveAsDraft = handleSubmit(async (data) => {
  //   loadingSave.onTrue();

  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     reset();
  //     loadingSave.onFalse();
  //     router.push(paths.dashboard.invoice.root);
  //     console.info('DATA');
  //   } catch (error) {
  //     console.error(error);
  //     loadingSave.onFalse();
  //   }
  // });

  const handleCreateAndSend = handleSubmit(async (data) => {
    console.log(data);
    loadingSend.onTrue();

    try {
      if (currentInvoice) {
        await axiosInstance.put(`/api/invoice/${currentInvoice._id}`, data);
      } else {
        await axiosInstance.post(`/api/invoice`, data);
      }
      reset();
      loadingSend.onFalse();
      enqueueSnackbar(currentInvoice ? 'Update success!' : 'Invoice Created Successfully!');
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress />

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails />
      </Card>

 
    </FormProvider>
  );
}

InvoiceNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
