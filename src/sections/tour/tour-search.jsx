import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

export default function TourSearch({ query, results, onSearch, hrefItem }) {
  const router = useRouter();

  const handleClick = (id) => {
    router.push(hrefItem(id));
  };

  const handleKeyUp = (event) => {
    if (query && event.key === 'Enter') {
      const selectProduct = results.find((tour) => tour.roomName === query);
      if (selectProduct) handleClick(selectProduct.id);
    }
  };

  const filterResults = (input) => {
    const isTimeQuery = /\d{2}:\d{2}/.test(input); // Example format: "12:30"
    if (isTimeQuery) {
      return results.filter((tour) => tour.time && tour.time.includes(input));
    }
    return results.filter(
      (tour) => tour.roomName.includes(input) || tour.roomNumber.includes(input)
    );
  };

  const handleInputChange = (event, newValue) => {
    const filtered = filterResults(newValue);
    onSearch(filtered);
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.roomName}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by room number or time (e.g., 12:30)"
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, tour, { inputValue }) => {
        const matches = match(tour.roomName, inputValue);
        const parts = parse(tour.roomName, matches);

        return (
          <Box component="li" {...props} onClick={() => handleClick(tour.id)} key={tour.id}>
            <Avatar
              key={tour.id}
              alt={tour.roomName}
              src={tour.images[0]}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <div key={inputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}

TourSearch.propTypes = {
  hrefItem: PropTypes.func,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
