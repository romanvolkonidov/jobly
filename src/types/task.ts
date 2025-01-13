import { Dispatch, SetStateAction } from 'react';


// src/types/task.ts
export interface Task {
  id: string;
  applicationDeadline?: string | Date;

  title: string;
  description: string;
  budget: number | null;
  status: string;
  createdAt: string;
  bids: Bid[];
  type: string;  // Added this field
  salaryMin?: number | null;
  salaryMax?: number | null;
  employmentType?: string;
  isRemote?: boolean;
  location?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  requiredDocuments?: {
    cv: boolean;
    coverLetter: boolean;
    certificates: boolean;
  };
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