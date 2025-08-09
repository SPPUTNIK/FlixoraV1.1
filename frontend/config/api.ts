const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const config = {
  apiUrl: API_BASE_URL,
  authUrls: {
    google: `${API_BASE_URL}/auth/google`,
    fortytwo: `${API_BASE_URL}/auth/42`,
  }
};
