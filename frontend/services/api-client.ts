import { config } from '../config/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = config.apiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const requestOptions: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // REMOVED: credentials: 'include', // Remove cookie-based authentication
      ...options,
    };

    try {
      const response = await fetch(url, requestOptions);
      
      // REMOVED: Authentication error handling
      // if (response.status === 401) {
      //   // Handle unauthorized - redirect to login or handle as needed
      //   window.location.href = '/auth/login';
      //   throw new Error('Unauthorized');
      // }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<{ data: T }> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();