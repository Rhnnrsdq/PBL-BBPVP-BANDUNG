import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export default function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}
        <span className={`text-sm font-medium ${
          type === 'success' ? 'text-green-800' : 'text-red-800'
        }`}>
          {message}
        </span>
        <button
          onClick={onClose}
          className={`ml-2 ${
            type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}