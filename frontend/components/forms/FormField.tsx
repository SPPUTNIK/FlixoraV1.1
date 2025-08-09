import React from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  icon: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  error,
  autoComplete,
  required = false,
  icon,
  onChange
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className={`input-field pl-10 ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <div className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};