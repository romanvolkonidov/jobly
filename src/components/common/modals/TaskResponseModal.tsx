import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskResponseModalProps {
  taskTitle: string;
  maxBudget: number;
  isOpen: boolean;
  onClose: () => void;
  onResponse: (price: number, message: string) => void;
}

export default function TaskResponseModal({
  taskTitle,
  maxBudget,
  isOpen,
  onClose,
  onResponse,
}: TaskResponseModalProps) {
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onResponse(Number(price), message);
      setPrice('');
      setMessage('');
      toast.success('Proposal submitted successfully');
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit proposal. Please try again.');
      toast.error('Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{taskTitle}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Client offers up to {maxBudget.toLocaleString()} KES
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Suggest your price</label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter amount in KES"
                  disabled={isSubmitting}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  KES
                </span>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Your message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Describe your experience and explain why you should be chosen for this task"
                disabled={isSubmitting}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary-blue text-white py-4 px-6 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-blue/90 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
                  Submitting...
                </span>
              ) : (
                'Send Response'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}