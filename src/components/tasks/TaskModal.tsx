import { Task } from '@/src/types/task';

interface TaskModalProps {
  task: Task;
  isWorkerView: boolean;
  onClose: () => void;
}

export const TaskModal = ({ task, isWorkerView, onClose }: TaskModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold">{task.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          ✕
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
            KES {task.budget.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-t">
          <span className="text-gray-600">Status</span>
          <span className="font-medium capitalize">{task.status}</span>
        </div>

        {isWorkerView &&
          task.bids.map((bid) => (
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
);
