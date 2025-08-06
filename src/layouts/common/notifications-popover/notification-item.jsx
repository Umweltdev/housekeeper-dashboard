import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import Iconify from 'src/components/iconify';
import { fToNow } from 'src/utils/format-time';

const iconMap = {
  training: 'solar:book-2-bold-duotone',
  'item-request': 'solar:box-bold-duotone',
  'cleaning-task': 'solar:broom-bold-duotone',
  'schedule-update': 'solar:calendar-mark-bold-duotone',
  default: 'solar:bell-bing-bold-duotone',
};

export default function NotificationItem({ notification, onMarkAsRead }) {
  const handleClick = () => {
    if (notification.isUnRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const renderIcon = (
    <ListItemAvatar>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        <Iconify
          icon={iconMap[notification.type] || iconMap.default}
          width={24}
          color={notification.isUnRead ? 'primary.dark' : 'text.primary'}
        />
      </Stack>
    </ListItemAvatar>
  );

  const renderUnReadBadge = notification.isUnRead && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <ListItemButton
      disableRipple
      onClick={handleClick}
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        position: 'relative',
      }}
    >
      {renderUnReadBadge}
      {renderIcon}

      <ListItemText
        primary={
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.5,
              color: notification.isUnRead ? 'primary.dark' : 'text.primary',
            }}
          >
            {notification.title}
          </Typography>
        }
        secondary={
          <Stack direction="column" spacing={0.5}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: notification.isUnRead ? 'medium' : 'normal',
              }}
            >
              {notification.description}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fToNow(notification.createdAt)}
            </Typography>
          </Stack>
        }
        sx={{ mt: 0 }}
      />
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'training',
      'item-request',
      'cleaning-task',
      'schedule-update',
      'default',
    ]),
    isUnRead: PropTypes.bool,
    createdAt: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  onMarkAsRead: PropTypes.func,
};
