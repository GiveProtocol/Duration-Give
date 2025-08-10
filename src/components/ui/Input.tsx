import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'enhanced';
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText,
  className,
  variant = 'default',
  ...props 
}) => {
  const baseClasses = "block w-full shadow-sm transition-all duration-200 placeholder:text-gray-400";
  
  const variantClasses = {
    default: cn(
      "rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50",
      error && "border-red-300 focus:border-red-500 focus:ring-red-500"
    ),
    enhanced: cn(
      // Enhanced styling with your specifications
      "border-[1.5px] border-[#e1e4e8] rounded-lg px-4 py-3 text-base bg-[#fafbfc]",
      "focus:border-[#0366d6] focus:shadow-[0_0_0_3px_rgba(3,102,214,0.1)] focus:bg-white focus:outline-none",
      error && "border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
    )
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <input
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          "text-sm",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};