// components/tasks/TaskCard.tsx
import { Archive, Clock, MapPin, Building, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Task } from '@/src/types/task';

interface TaskCardProps {
  task: Task;
  isClientView: boolean;
  onClick: (task: Task) => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export const TaskCard = ({
  task,
  isClientView,
  onClick,
  onArchive,
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

  const renderPoster = () => {
    console.log('Task data:', {
      id: task.id,
      postedAs: task.postedAs,
      company: task.company
    });

    if (task.postedAs === 'company' && task.company) {
      return (
        <div className="flex items-center gap-2">
          {task.company.logo ? (
            <Image 
              src={task.company.logo} 
              alt={task.company.name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <Building className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {task.company.name}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {task.createdBy?.imageUrl ? (
          <Image 
            src={task.createdBy.imageUrl} 
            alt={task.createdBy.firstName}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">
              {task.createdBy?.firstName?.charAt(0)}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {task.createdBy?.firstName}
        </span>
      </div>
    );
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
          {renderPoster()}
          
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
              onClick={onArchive}
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