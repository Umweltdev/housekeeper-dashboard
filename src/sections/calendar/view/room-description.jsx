import PropTypes from 'prop-types';

import {
  Box,
  Dialog,
  Button,
  CardMedia,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export function RoomDescriptionModal({ open, onClose, description, images }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Room Description</DialogTitle>

      <Box sx={{ margin: 'auto', width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <CardMedia
            component="img"
            image={images[0]}
            alt="room image"
            sx={{
              width: '95%',
              height: 375,
              objectFit: 'cover',
              borderRadius: '10px 0 0 10px',
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <CardMedia
              component="img"
              image={images[1]}
              alt="room image"
              sx={{ width: 200, height: 120, objectFit: 'cover', borderRadius: '0 10px 0 0' }}
            />
            <CardMedia
              component="img"
              image={images[2]}
              alt="room image"
              sx={{ width: 200, height: 120, objectFit: 'cover', borderRadius: '0 0 0 0' }}
            />
            <CardMedia
              component="img"
              image={images[4]}
              alt="room image"
              sx={{ width: 200, height: 120, objectFit: 'cover', borderRadius: '0 0 10px 0' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Apply scrolling here */}
      <DialogContent
        sx={{
          maxHeight: '70vh', // Restrict height
          overflowY: 'auto', // Enable scrolling
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#aaa', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#888' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        }}
      >
        <Typography variant="body1">{description}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RoomDescriptionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // Add images prop type
};
