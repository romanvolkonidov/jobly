// src/components/common/navbar/MessagesModal.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { withLazyLoading } from '@/src/components/common/Performance';
import ProfilePreviewModal from './ProfilePreviewModal';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  isSender: boolean;
  userImageUrl?: string;
  timestamp: string;
  fromUserId: string;
}

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserFirstName: string;
  otherUserLastName: string;
  otherUserImage: string | null;
  taskId: string;
  taskTitle: string;
  lastMessage: string;
  timestamp: string;
  status: string;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessagesRead: () => void;
  initialTaskId?: string;
  isLoading?: boolean;
}

const MessageSkeleton = () => (
  <div className="flex items-start gap-2">
    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
    </div>
  </div>
);

const ConversationSkeleton = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-2 bg-gray-200 rounded w-1/4 animate-pulse" />
    </div>
  </div>
);

function MessagesModal({ isOpen, onClose, onMessagesRead, initialTaskId, isLoading = false }: MessagesModalProps) {
  const [viewType, setViewType] = useState<'current' | 'archived'>('current');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialTaskId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', viewType],
    queryFn: async () => {
      const response = await fetch(`/api/messages/conversations?type=${viewType}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json() as Promise<Conversation[]>;
    },
    enabled: isOpen
  });

  useEffect(() => {
    if (initialTaskId) {
      setSelectedConversation(initialTaskId);
    }
  }, [initialTaskId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      const response = await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId }),
      });

      if (response.ok) {
        onMessagesRead(); // Call the prop to update unread count
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const selectedTask = conversations.find(c => c.id === selectedConversation);
    if (selectedTask?.status === 'archived') {
      toast.error('Cannot send messages in archived conversations');
      return;
    }

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const sentMessage = await response.json();
      setMessages(prev => [...prev, {
        id: sentMessage.id,
        content: newMessage,
        isSender: true,
        timestamp: new Date().toISOString(),
        fromUserId: sentMessage.fromUserId
      }]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] mx-4 flex overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close messages"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setViewType('current')}
                className={`px-4 py-2 rounded ${
                  viewType === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setViewType('archived')}
                className={`px-4 py-2 rounded ${
                  viewType === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Archived
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {conversationsLoading ? (
              <div className="space-y-4 p-4">
                {[...Array(5)].map((_, index) => (
                  <ConversationSkeleton key={index} />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-gray-500 text-center">No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 ${
                    selectedConversation === conv.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={conv.otherUserImage || '/default-avatar.png'}
                      alt={`${conv.otherUserFirstName}'s profile`}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUserId(conv.otherUserId);
                        setIsProfilePreviewOpen(true);
                      }}
                    />
                    <div>
                      <div className="font-medium">
                        {`${conv.otherUserFirstName} ${conv.otherUserLastName}`}
                      </div>
                      <div className="text-sm text-gray-500">{conv.lastMessage}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(conv.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">
                    {conversations.find(c => c.id === selectedConversation)?.taskTitle}
                  </h2>
                  {conversations.find(c => c.id === selectedConversation)?.status === 'archived' && (
                    <span className="text-gray-500 text-sm">Archived</span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <MessageSkeleton key={index} />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages in this conversation yet
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSender ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isSender ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {conversations.find(c => c.id === selectedConversation)?.status !== 'archived' && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>

      {selectedUserId && (
        <ProfilePreviewModal
          userId={selectedUserId}
          isOpen={isProfilePreviewOpen}
          onClose={() => setIsProfilePreviewOpen(false)}
        />
      )}
    </div>
  );
}

export default withLazyLoading(MessagesModal);