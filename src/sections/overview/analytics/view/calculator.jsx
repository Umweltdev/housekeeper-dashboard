import { format, startOfWeek, startOfYear, startOfMonth } from 'date-fns';

export function groupAverageStay(bookings) {
  const result = {
    week: {},
    month: {},
    year: {},
  };

  bookings.forEach((booking) => {
    const checkInDate = new Date(booking.rooms[0].checkIn);
    const duration = booking.rooms[0].durationOfStay;

    const weekKey = format(startOfWeek(checkInDate), 'yyyy-MM-dd');
    const monthKey = format(startOfMonth(checkInDate), 'yyyy-MM');
    const yearKey = format(startOfYear(checkInDate), 'yyyy');

    // Helper to push and calculate
    const pushToGroup = (group, key) => {
      if (!group[key]) group[key] = [];
      group[key].push(duration);
    };

    pushToGroup(result.week, weekKey);
    pushToGroup(result.month, monthKey);
    pushToGroup(result.year, yearKey);
  });

  // Convert to average
  const computeAverages = (group) =>
    Object.entries(group).map(([key, values]) => ({
      time: key,
      averageStay: values.reduce((a, b) => a + b, 0) / values.length,
    }));

  return {
    week: computeAverages(result.week),
    month: computeAverages(result.month),
    year: computeAverages(result.year),
  };
}