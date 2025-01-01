// src/components/common/navbar/MessagesButton.tsx
import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import MessagesModal from './MessagesModal';

export default function MessagesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkUnreadMessages = async () => {
    try {
      const response = await fetch('/api/messages/unread');
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error checking unread messages:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkUnreadMessages, 30000); // Check every 30 seconds
    checkUnreadMessages(); // Initial check

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <MessageSquare className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <MessagesModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onMessagesRead={checkUnreadMessages} // Add this prop
      />
    </>
  );
}