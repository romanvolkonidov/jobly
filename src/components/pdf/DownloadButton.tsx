'use client';

import React from 'react';
import { FileDown } from 'lucide-react';

interface DownloadButtonProps {
  type: 'resume' | 'company';
  userId: string;
  className?: string;
  firstName: string;
  lastName: string;
}

export default function DownloadButton({ type, userId, className, firstName, lastName }: DownloadButtonProps) {
  const downloadPdf = async () => {
    try {
      const response = await fetch(`/api/pdf/${type}/${userId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${firstName}-${lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <button
      onClick={downloadPdf}
      className={className}
    >
      <FileDown className="w-4 h-4" />
      Download PDF
    </button>
  );
}
