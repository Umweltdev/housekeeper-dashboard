import React from 'react';

import {
  Box,
  Card,
  Stack,
  Avatar,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function ScheduleKnowledgeBase() {
  return (
    <Box sx={{ mx: 'auto' }}>
      {/* Header */}

      {/* FAQs Section */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: '0px 10px 20px rgba(0,0,0,0.05)',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(to bottom right, #f9f9ff, #f0f4ff)'
              : 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
          color: (theme) => (theme.palette.mode === 'dark' ? 'common.white' : 'inherit'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <Iconify icon="mdi:chat-question" width={24} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Quick FAQs
          </Typography>
        </Box>

        {[
          {
            question: 'How to log completed tasks?',
            answer:
              'Go to the dashboard, click on the task, and select "Mark as Completed". Pro tip: You can use voice commands too! Just say "Alexa, task done"',
            icon: 'mdi:check-circle-outline',
          },
          {
            question: 'What to do if a guest is in the room?',
            answer:
              'Politely say "Housekeeping" and wait for response. No answer? Peek in and say it again. Still nothing? Come back later. Remember the golden rule: Never enter if Do Not Disturb is on!',
            icon: 'mdi:account-question',
          },
          {
            question: 'Emergency procedures',
            answer:
              '1. Stay calm 2. Assess the situation 3. Press the emergency button on your smartwatch or app 4. Follow instructions from your supervisor. Remember: Your safety comes first!',
            icon: 'mdi:alert-octagon',
          },
        ].map((item, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: (theme) =>
                theme.palette.mode === 'light'
                  ? '0px 2px 8px rgba(0,0,0,0.05)'
                  : '0px 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-2px)' },
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? 'background.paper' : 'grey.900',
            }}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="mdi:chevron-down" width={24} />}
              sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}
            >
              <Iconify icon={item.icon} width={24} sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="medium" sx={{ flexGrow: 1 }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>

      {/* Safety Guidelines Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'error.main',
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            {/* <Iconify icon="mdi:shield-alert" width={24} /> */}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Safety Game
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Card
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'flex-start',
              bgcolor: 'warning.lighter',
              borderLeft: '6px solid',
              borderColor: 'warning.main',
              borderRadius: 3,
              boxShadow: 'none',
              transition: 'all 0.3s',
              '&:hover': { transform: 'scale(1.01)' },
            }}
          >
            <Iconify
              icon="mdi:flask-outline"
              width={28}
              color="warning.main"
              sx={{ mr: 2, flexShrink: 0 }}
            />
            <Box>
              <Typography
                variant="subtitle"
                color="warning.main"
                fontWeight="bold"
                sx={{ mb: 0.5 }}
              >
                Chemical Handling
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                <Box component="span" fontWeight="bold">
                  Protect ya self:
                </Box>{' '}
                Always wear gloves and goggles when handling the strong stuff.
                <br />
                <Box component="span" fontWeight="bold">
                  Big no-no:
                </Box>{' '}
                Mixing bleach + ammonia = toxic gas (we&apos;re not making chemistry experiments
                here!)
              </Typography>
            </Box>
          </Card>

          <Card
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'flex-start',
              bgcolor: 'error.lighter',
              borderLeft: '6px solid',
              borderColor: 'error.main',
              borderRadius: 3,
              boxShadow: 'none',
              transition: 'all 0.3s',
              '&:hover': { transform: 'scale(1.01)' },
            }}
          >
            <Iconify icon="mdi:fire" width={28} color="error.main" sx={{ mr: 2, flexShrink: 0 }} />
            <Box>
              <Typography variant="subtitle1" color="error.main" fontWeight="bold" sx={{ mb: 0.5 }}>
                Fire Safety 🔥
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                <Box component="span" fontWeight="bold">
                  Keep it clear:
                </Box>{' '}
                Hallways and exits must stay cart-free at all times.
                <br />
                <Box component="span" fontWeight="bold">
                  Be prepared:
                </Box>{' '}
                Know where the nearest fire extinguisher is (hint: check the app&apos;s floor plan)
              </Typography>
            </Box>
          </Card>

          <Card
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'flex-start',
              bgcolor: 'info.lighter',
              borderLeft: '6px solid',
              borderColor: 'info.main',
              borderRadius: 3,
              boxShadow: 'none',
              transition: 'all 0.3s',
              '&:hover': { transform: 'scale(1.01)' },
            }}
          >
            <Iconify
              icon="mdi:weight-lifter"
              width={28}
              color="info.main"
              sx={{ mr: 2, flexShrink: 0 }}
            />
            <Box>
              <Typography variant="subtitle1" color="info.main" fontWeight="bold" sx={{ mb: 0.5 }}>
                Ergonomics 💪
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                <Box component="span" fontWeight="bold">
                  Lift smart:
                </Box>{' '}
                Bend those knees, not your back! Your future self will thank you.
                <br />
                <Box component="span" fontWeight="bold">
                  Cart rules:
                </Box>{' '}
                Push don&apos;t pull, and adjust handle height to avoid hunching.
              </Typography>
            </Box>
          </Card>
        </Stack>
      </Box>

      {/* Pro Tips Section */}
    </Box>
  );
}
