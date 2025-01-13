import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import MessagesModal from './MessagesModal';

export default function MessagesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUnreadMessages = async () => {
    try {
      setError(null);
      const response = await fetch('/api/messages/unread');
      
      if (!response.ok) {
        throw new Error('Failed to fetch unread messages');
      }
      
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error checking unread messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkUnreadMessages, 30000);
    checkUnreadMessages();

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full relative transition-colors duration-200"
        disabled={isLoading}
        aria-label={`Messages ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {isLoading ? (
          <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full" />
        ) : (
          <MessageSquare className="w-6 h-6 text-gray-600" />
        )}
        
        {!isLoading && unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in"
            role="status"
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {error && (
          <span 
            className="absolute -bottom-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full"
            title={error}
          />
        )}
      </button>

      <MessagesModal 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          checkUnreadMessages(); // Always check unread messages when modal closes
        }}
        onMessagesRead={checkUnreadMessages}
        isLoading={isLoading}
      />
    </>
  );
}