//src/components/common/modals/TaskResponseModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';

interface TaskResponseModalProps {
  taskTitle: string;
  maxBudget: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (price: number, message: string) => void;
}

export default function TaskResponseModal({
  taskTitle,
  maxBudget,
  isOpen,
  onClose,
  onSubmit
}: TaskResponseModalProps) {
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(price), message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{taskTitle}</h2>
              <p className="text-sm text-gray-600 mt-1">Client offers up to {maxBudget.toLocaleString()} KES</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Enter amount in KES"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">KES</span>
              </div>
              {Number(price) > maxBudget && (
                <p className="mt-2 text-sm text-red-600">
                  Lower price will give you more chances to get the job
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2">Your message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Describe your experience and explain why you should be chosen for this task"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-blue text-white py-4 px-6 rounded-lg font-medium hover:bg-primary-blue/90 transition-colors"
            >
              Send Response
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}