import { useState, useEffect } from "react";

export default function useEvent(events, selectEventId, selectedRange, openForm) {
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    if (selectEventId) {
      const event = events.find((e) => e.id === selectEventId);
      setCurrentEvent(event || null);
    } else if (selectedRange) {
      setCurrentEvent({
        start: selectedRange.start,
        end: selectedRange.end,
      });
    } else if (!openForm) {
      setCurrentEvent(null);
    }
  }, [events, selectEventId, selectedRange, openForm]);

  return currentEvent;
}

// import { useMemo } from 'react';
// import merge from 'lodash/merge';

// import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

// // ----------------------------------------------------------------------

// export default function useEvent(events, selectEventId, selectedRange, openForm) {
//   const currentEvent = events.find((event) => event.id === selectEventId);

//   const defaultValues = useMemo(
//     () => ({
//       id: '',
//       title: '',
//       description: '',
//       color: CALENDAR_COLOR_OPTIONS[1],
//       allDay: false,
//       start: selectedRange ? selectedRange.start : new Date().getTime(),
//       end: selectedRange ? selectedRange.end : new Date().getTime(),
//     }),
//     [selectedRange]
//   );

//   if (!openForm) {
//     return undefined;
//   }

//   if (currentEvent || selectedRange) {
//     return merge({}, defaultValues, currentEvent);
//   }

//   return defaultValues;
// }

// export default function useEvent(events, selectEventId) {
//   return events.find((event) => event.id === selectEventId) || null;
// }

// ----------------------------------------------------------------------

// export default function useEvent(events, selectEventId, selectedRange, openForm) {
//   // Find the current event based on the selected event ID
//   const currentEvent = events.find((event) => event.id === selectEventId);

//   // Default values for a new reservation
//   const defaultValues = useMemo(
//     () => ({
//       id: '', // Unique ID for the reservation
//       title: '', // Title for the event (e.g., customer name + room number)
//       description: '', // Optional description
//       color: CALENDAR_COLOR_OPTIONS[1], // Default color
//       allDay: true, // Reservations are typically all-day events
//       start: selectedRange ? selectedRange.start : new Date().getTime(), // Check-in date
//       end: selectedRange ? selectedRange.end : new Date().getTime(), // Check-out date
//       customerName: '', // Customer name
//       customerEmail: '', // Customer email
//       customerPhone: '', // Customer phone number
//       roomNumber: '', // Room number
//       roomType: '', // Room type
//       checkIn: selectedRange ? selectedRange.start : new Date().getTime(), // Check-in date
//       checkOut: selectedRange ? selectedRange.end : new Date().getTime(), // Check-out date
//       totalPrice: 0, // Total price for the reservation
//       bookingNotes: '', // Additional notes for the booking
//     }),
//     [selectedRange]
//   );

//   // If the form is not open, return undefined
//   if (!openForm) {
//     return undefined;
//   }

//   // If there's a current event or a selected range, merge it with the default values
//   if (currentEvent || selectedRange) {
//     return merge({}, defaultValues, currentEvent);
//   }

//   // Return default values for a new reservation
//   return defaultValues;
// }
