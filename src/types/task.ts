import { Dispatch, SetStateAction } from 'react';


// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  category: string;
  subcategory: string;
  createdAt: string;
  bids: Bid[];
  createdBy: {
    firstName: string;
    lastName: string;
    rating?: number;
    reviewCount?: number;
  };
}

export interface Bid {
  id: string;
  amount: number;
  proposal: string;
  status: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  isClientView: boolean;
  onDelete?: (taskId: string) => Promise<void>;  // Make onDelete optional
  onClick: Dispatch<SetStateAction<Task | null>>;
}