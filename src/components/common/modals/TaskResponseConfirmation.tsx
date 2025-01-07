import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TaskResponseConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export default function TaskResponseConfirmation({
  isOpen,
  onClose,
  isLoading = false
}: TaskResponseConfirmationProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Response Sent</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p id="modal-description" className="text-gray-600 mb-6">
            Your response has been sent successfully. The client will review it and contact you if they&apos;re interested.
          </p>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-primary-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-blue/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'OK'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}