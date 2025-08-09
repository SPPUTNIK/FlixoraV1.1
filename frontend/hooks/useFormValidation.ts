import { useState } from 'react';

export interface FormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const initialErrors: FormErrors = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const useFormValidation = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: FormErrors = { ...initialErrors };

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      valid = false;
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      valid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear the error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return {
    formData,
    errors,
    validateForm,
    handleChange
  };
};