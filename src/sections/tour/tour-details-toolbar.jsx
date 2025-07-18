import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function TourDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  rooms,
  onSearch,
  sx,
  ...other
}) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        alignItems="center"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        {/* Search */}
        {/* <TourSearch rooms={rooms} onSearch={onSearch} /> */}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {/* {publishOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === publish}
            onClick={() => {
              popover.onClose();
              onChangePublish(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))} */}
      </CustomPopover>
    </>
  );
}

TourDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  rooms: PropTypes.array,
  onSearch: PropTypes.func,
  sx: PropTypes.object,
};
