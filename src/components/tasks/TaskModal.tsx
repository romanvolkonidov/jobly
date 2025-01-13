import { useState } from 'react';
import { Task } from '@/src/types/task';
import { VacancyModal } from './VacancyModal';
import { X } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import TaskResponseModal from '../common/modals/TaskResponseModal';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface TaskModalProps {
  task: Task;
  isWorkerView: boolean;
  onClose: () => void;
}

export const TaskModal = ({ task, isWorkerView, onClose }: TaskModalProps) => {
  const router = useRouter();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showMainModal, setShowMainModal] = useState(true);
  
  if (task.type === 'vacancy') {
    return <VacancyModal vacancy={task} onClose={onClose} />;
  }

  const handleShowResponse = () => {
    setShowMainModal(false);
    setShowResponseModal(true);
  };

  const handleResponse = async (price: number, message: string) => {
    try {
      const response = await fetch('/api/tasks/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          amount: price,
          proposal: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bid');
      }

      setShowResponseModal(false);
      onClose();
      toast.success('Proposal submitted successfully');
      router.refresh(); // Refresh the page data
      router.push('/messages'); // Redirect to messages
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit proposal');
    }
  };

  return (
    <>
      {showMainModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{task.title}</h2>
                <Badge variant={task.status === 'open' ? 'default' : 'secondary'}>
                  {task.status}
                </Badge>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              <div className="flex justify-between items-center py-3 border-t">
                <span className="text-gray-600">Budget</span>
                <span className="text-2xl font-bold text-green-600">
                  KES {task.budget?.toLocaleString() ?? 'Negotiable'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-t">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize">{task.status}</span>
              </div>

              <div className="pt-6 border-t">
                <button
                  onClick={handleShowResponse}
                  className="w-full bg-primary-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-blue/90 transition-colors"
                >
                  Submit Proposal
                </button>
              </div>

              {task.bids.map((bid) => (
                <div key={bid.id} className="border-t pt-4">
                  <h3 className="font-medium mb-2">Your Proposal</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {bid.proposal}
                  </p>
                  <div className="mt-3 text-green-600 font-medium">
                    Your Bid: KES {bid.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResponseModal && (
        <TaskResponseModal
          taskTitle={task.title}
          maxBudget={task.budget || 0}
          isOpen={showResponseModal}
          onClose={() => {
            setShowResponseModal(false);
            setShowMainModal(true);
          }}
          onResponse={handleResponse}
        />
      )}
    </>
  );
};