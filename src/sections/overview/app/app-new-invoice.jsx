import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { fetcher, endpoints } from 'src/utils/axios';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AppNewInvoice({ title, subheader, tableLabels, ...other }) {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // Fetch invoices from the API
        const invoices = await fetcher(endpoints.invoice.list);

        console.log(invoices);

        // Format data and sort by a timestamp field (assuming `createdAt`)
        const formattedData = invoices
          .map((invoice) => ({
            id: invoice?.invoiceNumber || 'N/A',
            category: invoice?.items.length || 'General',
            price: invoice?.totalAmount || 0,
            status: invoice?.status || 'pending',
            createdAt: invoice?.createdAt, // Ensure this field exists
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
          .slice(0, 5); // Get the latest 5 invoices

        console.log(formattedData);

        setInvoiceData(formattedData);
      } catch (error) {
        console.error('Failed to fetch invoice data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {invoiceData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View All
        </Button> */}
      {/* </Box> */}
    </Card>
  );
}

AppNewInvoice.propTypes = {
  subheader: PropTypes.string,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AppNewInvoiceRow({ row }) {
  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>
          {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(row.price)}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'pending' && 'warning') ||
              (row.status === 'paid' && 'success') ||
              'error'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        {/* <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>
        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};
