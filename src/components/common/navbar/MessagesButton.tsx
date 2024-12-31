import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import MessagesModal from './MessagesModal';

export default function MessagesButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <MessageSquare className="w-6 h-6 text-gray-600" />
      </button>

      <MessagesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}