// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic validation for 10 digits)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

// Validate OTP (4 digits)
export const isValidOTP = (otp: string): boolean => {
  return otp.length === 4 && /^\d+$/.test(otp);
};

// Validate name
export const isValidName = (name: string): boolean => {
  return name.trim().length > 2;
};

// Validate date of birth
export const isValidDateOfBirth = (
  year: string,
  month: string,
  day: string
): boolean => {
  if (!year || !month || !day) return false;

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();

  return age >= 13 && age <= 120;
};

// Generate mock OTP
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.slice(0, 5) + "-" + cleaned.slice(5);
};
