export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'superSecretKey123!@#',
};

export const emailConstants = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
};
