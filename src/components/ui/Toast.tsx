import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'loading';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    loading: Loader2
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1",
      type === 'success' && "ring-green-500",
      type === 'error' && "ring-red-500",
      type === 'loading' && "ring-blue-500"
    )}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn(
              "h-6 w-6",
              type === 'success' && "text-green-500",
              type === 'error' && "text-red-500",
              type === 'loading' && "text-blue-500 animate-spin"
            )} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            {message && (
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};