export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  isActive: boolean;
  language: 'en' | 'ar' | 'fr';
  avatar: string;
  background: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;
  language?: 'en' | 'ar' | 'fr';
}

export interface UpdateUserResponse {
  message: string;
}
