import React from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showConfirmButton?: boolean;
  confirmText?: string;
  onConfirm?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showConfirmButton = false,
  confirmText = 'ตกลง',
  onConfirm,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };



  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className={`p-6 border-l-4 ${getTypeStyles()}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            {showConfirmButton && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {confirmText}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              {showConfirmButton ? 'ยกเลิก' : 'ตกลง'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 