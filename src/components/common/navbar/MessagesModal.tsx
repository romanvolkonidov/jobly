import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { withLazyLoading } from '@/src/components/common/Performance';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImageUrl?: string;
  taskId: string;
  taskTitle: string;
  lastMessage: string;
  timestamp: string;
}

interface MessageContent {
  id: string;
  content: string;
  isSender: boolean;
  userImageUrl?: string;
  timestamp: string;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessagesRead: () => void;
  initialTaskId?: string;
}

function MessagesModal({ isOpen, onClose, onMessagesRead, initialTaskId }: MessagesModalProps) {
      const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageContent[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTaskId && isOpen) {
      setSelectedConversation(initialTaskId);
    }
  }, [initialTaskId, isOpen]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const markMessagesAsRead = async () => {
        try {
          await fetch('/api/messages/mark-read', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              conversationId: selectedConversation,
            }),
          });
          onMessagesRead(); // Call this after successfully marking messages as read
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      };
  
      markMessagesAsRead();
    }
  }, [selectedConversation, onMessagesRead]);
  
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
  
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage
        })
      });

      setNewMessage('');
      fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] mx-4 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedConversation === conv.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={conv.senderImageUrl || '/default-avatar.png'}
                    alt={conv.senderName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{conv.senderName}</div>
                    <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
   
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Task Link */}
              <div className="p-4 border-b border-gray-200">
                <Link
                  href={`/tasks/${conversations.find(c => c.id === selectedConversation)?.taskId}`}
                  className="text-blue-600 hover:underline"
                >
                  View Task: {conversations.find(c => c.id === selectedConversation)?.taskTitle}
                </Link>
              </div>
   
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${msg.isSender ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Image
                      src={msg.userImageUrl || '/default-avatar.png'}
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <div
                      className={`max-w-[70%] break-words rounded-xl px-4 py-2 ${
                        msg.isSender
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span 
                        className={`text-xs ${
                          msg.isSender ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
   
              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
   
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
   );
}

export default withLazyLoading(MessagesModal);