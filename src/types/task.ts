import { Dispatch, SetStateAction } from 'react';


export interface Bid {
  id: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
}

export interface Task {
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
  onDelete?: (taskId: string) => Promise<void>;  // Make onDelete optional
  onClick: Dispatch<SetStateAction<Task | null>>;
}