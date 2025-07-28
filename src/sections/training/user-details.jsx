import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function UserDetails({ currentUser }) {
  if (!currentUser) {
    return <Typography variant="h6">User not found</Typography>;
  }

  const userCountry = countries.find((country) => country.label === currentUser.country);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          <Label
            color={
              (currentUser.status === 'active' && 'success') ||
              (currentUser.status === 'banned' && 'error') ||
              'warning'
            }
            sx={{ position: 'absolute', top: 24, right: 24 }}
          >
            {currentUser.status}
          </Label>

          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <img
              src={currentUser.img?.preview || currentUser.img || '/placeholder-avatar.png'}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              style={{ width: '120px', height: '120px', borderRadius: '50%' }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
              Allowed *.jpeg, *.jpgg, *.png, *.gif
              <br /> max size of {fData(3145728)}
            </Typography>
          </Box>

          {/* <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
            <Button variant="soft" color="error">
              Delete User
            </Button>
          </Stack> */}
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Box>
              <Typography variant="subtitle2">First Name</Typography>
              <Typography variant="body2">{currentUser.firstName}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Last Name</Typography>
              <Typography variant="body2">{currentUser.lastName}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Email Address</Typography>
              <Typography variant="body2">{currentUser.email}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Phone Number</Typography>
              <Typography variant="body2">{currentUser.phone}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Country</Typography>
              <Typography variant="body2">{userCountry?.label || currentUser.country}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">City</Typography>
              <Typography variant="body2">{currentUser.city}</Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

UserDetails.propTypes = {
  currentUser: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    status: PropTypes.string,
    img: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
};
