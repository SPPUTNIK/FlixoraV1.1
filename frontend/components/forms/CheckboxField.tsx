import React from 'react';

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  name,
  label,
  checked,
  error,
  onChange
}) => {
  return (
    <div>
      <div className="flex items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          {label}
        </label>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};