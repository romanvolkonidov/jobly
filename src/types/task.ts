import { Dispatch, SetStateAction } from 'react';


// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  status: string;
  createdAt: string;
  type: string;
  bids: Bid[];
  postedAs: 'individual' | 'company';
  companyId?: string; // Add this field
  createdBy: {
    firstName: string;
    lastName: string;
    imageUrl?: string;
    rating?: number;
    reviewCount?: number;
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
  } | null;
  // Vacancy specific fields
  salaryMin?: number | null;
  salaryMax?: number | null;
  employmentType?: string;
  isRemote?: boolean;
  location?: string;
  applicationDeadline?: string | Date;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  requiredDocuments?: {
    cv: boolean;
    coverLetter: boolean;
    certificates: boolean;
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