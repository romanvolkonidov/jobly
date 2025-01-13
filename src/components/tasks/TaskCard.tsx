// components/tasks/TaskCard.tsx
import { Archive, Clock, MapPin, Building, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
import { Badge } from '@/src/components/ui/badge';

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
  budget: number | null;
  status: string;
  createdAt: string;
  bids: Bid[];
  type: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  employmentType?: string;
  isRemote?: boolean;
  location?: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface TaskCardProps {
  task: Task;
  isClientView: boolean;
  onClick: Dispatch<SetStateAction<Task | null>>;
  onDelete?: (taskId: string) => Promise<void>;
}

export const TaskCard = ({
  task,
  isClientView,
  onClick,
  onDelete,
}: TaskCardProps) => {
  const renderPrice = () => {
    if (task.type === 'vacancy') {
      if (task.salaryMin && task.salaryMax) {
        return `KES ${task.salaryMin.toLocaleString()} - ${task.salaryMax.toLocaleString()}`;
      } else if (task.salaryMin) {
        return `From KES ${task.salaryMin.toLocaleString()}`;
      } else if (task.salaryMax) {
        return `Up to KES ${task.salaryMax.toLocaleString()}`;
      }
      return 'Salary Negotiable';
    }
    
    return task.budget ? `KES ${task.budget.toLocaleString()}` : 'Budget Negotiable';
  };

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
    <div className="bg-white rounded-lg shadow-sm p-6 relative hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-grow cursor-pointer" onClick={() => onClick(task)}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-medium">{task.title}</h3>
            <Badge variant={task.status === 'open' ? 'default' : 'secondary'}>
              {task.status}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {task.type === 'vacancy' ? (
              <>
                <div className="flex items-center gap-1">
                  <Building size={16} />
                  <span>{task.employmentType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{task.isRemote ? 'Remote' : task.location}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span>Proposals: {task.bids.length}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xl font-bold text-green-600">
            {renderPrice()}
          </div>
          {isClientView && task.status !== 'archived' && (
            <button
              onClick={archiveTask}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-50"
            >
              <Archive size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};