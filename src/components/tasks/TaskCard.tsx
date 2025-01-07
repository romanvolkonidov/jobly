// components/tasks/TaskCard.tsx
import { Archive } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Bid {
  id: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  bids: Bid[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface TaskCardProps {
  task: Task;
  isClientView: boolean;
  onClick: (task: Task) => void;
}
export const TaskCard = ({
  task,
  isClientView,
  onClick,
}: TaskCardProps) => {
  const archiveTask = async () => {
    try {
      const response = await fetch(`/api/tasks/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id })
      });
      
      if (!response.ok) throw new Error('Failed to archive task');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to archive task');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-grow cursor-pointer" onClick={() => onClick(task)}>
          <h3 className="text-xl font-medium mb-2">{task.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
          <div className="text-sm text-gray-500 space-x-4">
            <span>Status: {task.status}</span>
            <span>Proposals: {task.bids.length}</span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-green-600">
            KES {task.budget.toLocaleString()}
          </div>
          {isClientView && task.status !== 'archived' && (
            <button
              onClick={archiveTask}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-50"
            >
              <Archive size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};