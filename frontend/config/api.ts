const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

export const config = {
  apiUrl: API_BASE_URL as string, // Type assertion since we provide a fallback
};
