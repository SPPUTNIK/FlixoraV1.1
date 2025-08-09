import { useState, useEffect } from 'react';
import { User } from '../services/user';

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  preferredLanguage: string;
}

export interface ProfileFormErrors {
  first_name: string;
  last_name: string;
  preferredLanguage: string;
}

const initialFormData: ProfileFormData = {
  first_name: '',
  last_name: '',
  preferredLanguage: 'en'
};

const initialErrors: ProfileFormErrors = {
  first_name: '',
  last_name: '',
  preferredLanguage: ''
};

export const useProfileValidation = (user?: User) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [errors, setErrors] = useState<ProfileFormErrors>(initialErrors);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      const newFormData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        preferredLanguage: user.preferredLanguage || 'en'
      };
      setFormData(newFormData);
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    if (user) {
      const hasChanged = 
        formData.first_name !== (user.first_name || '') ||
        formData.last_name !== (user.last_name || '') ||
        formData.preferredLanguage !== (user.preferredLanguage || 'en');
      
      setHasChanges(hasChanged);
    }
  }, [formData, user]);

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: ProfileFormErrors = { ...initialErrors };

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

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error when user starts typing
    if (errors[name as keyof ProfileFormErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        preferredLanguage: user.preferredLanguage || 'en'
      });
    }
    setErrors(initialErrors);
  };

  return {
    formData,
    errors,
    hasChanges,
    validateForm,
    handleChange,
    resetForm
  };
};