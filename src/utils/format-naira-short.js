// src/utils/formatAmount.js
export const formatNairaAmount = (amount) => {
  if (amount === null || amount === undefined) return '₦0';

  let formattedAmount;
  const absAmount = Math.abs(amount); // Handle negative values
  const sign = amount < 0 ? '-' : ''; // Preserve sign

  if (absAmount >= 1_000_000_000) {
    formattedAmount = `${(absAmount / 1_000_000_000).toFixed(1)}B`;
  } else if (absAmount >= 1_000_000) {
    formattedAmount = `${(absAmount / 1_000_000).toFixed(1)}M`;
  } else if (absAmount >= 1_000) {
    formattedAmount = `${(absAmount / 1_000).toFixed(1)}K`;
  } else {
    formattedAmount = absAmount.toFixed(2); // For smaller amounts
  }

  return `${sign}₦${formattedAmount}`;
};


export const formatNairaAmountLong = (amount) => {
  if (amount === null || amount === undefined) return '₦0';

  const absAmount = Math.abs(amount); // Handle negative values
  const sign = amount < 0 ? '-' : ''; // Preserve sign

  // Format the number with commas for thousands separators
  const formattedAmount = absAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}₦${formattedAmount}`;
};