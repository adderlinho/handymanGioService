// Phone number formatting utilities

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else {
    // For international numbers, keep first 11 digits
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 11)}`;
  }
};



export const validatePhoneNumber = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  // Accept 10 digits (US) or 11 digits (US with country code)
  return numbers.length === 10 || numbers.length === 11;
};