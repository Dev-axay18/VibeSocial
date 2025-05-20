# Frontend Integration Guide

This guide provides instructions on how to integrate the Express.js backend with the React frontend.

## API Service Setup

Create an API service in your React frontend to communicate with the backend:

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

## Socket.IO Connection

Set up Socket.IO for real-time communication:

```javascript
// src/services/socket.js
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = 'http://localhost:5000';

// Hook to manage socket connection
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
        },
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      setSocket(newSocket);

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return { socket, isConnected };
};
```

## Authentication Integration

Update the authentication components to work with the backend:

```javascript
// src/services/auth.js
import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/users', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async logout() {
    await api.post('/users/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
```

## Chat Page Integration

Modify the ChatPage component to integrate with the backend:

```javascript
// Modified version of ChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../services/socket';
import api from '../services/api';
import { authService } from '../services/auth';
// ... other imports

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileAttachment, setShowFileAttachment] = useState(false);
  const messagesEndRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMessage, setForwardMessage] = useState(null);
  const { socket, isConnected } = useSocket();
  const currentUser = authService.getCurrentUser();
  
  // Fetch chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);
  
  // Socket event listeners
  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('receive_message', (newMessage) => {
        if (selectedChat && selectedChat._id === newMessage.chat._id) {
          // Update messages in current chat
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
          }));
          
          // Mark message as delivered
          updateMessageStatus(newMessage.chat._id, 'delivered');
        }
        
        // Update chat list to show latest message
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat._id === newMessage.chat._id) {
              return {
                ...chat,
                latestMessage: newMessage,
                unread: chat._id !== selectedChat?._id ? (chat.unread + 1) : 0,
              };
            }
            return chat;
          });
          return updatedChats;
        });
      });
      
      // Typing indicators
      socket.on('typing', (data) => {
        if (selectedChat && selectedChat._id === data.chatId && data.user !== currentUser._id) {
          setIsTyping(true);
        }
      });
      
      socket.on('stop_typing', (data) => {
        if (selectedChat && selectedChat._id === data.chatId && data.user !== currentUser._id) {
          setIsTyping(false);
        }
      });
      
      // Clean up
      return () => {
        socket.off('receive_message');
        socket.off('typing');
        socket.off('stop_typing');
      };
    }
  }, [socket, selectedChat]);
  
  // Join chat room when chat is selected
  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit('join_chat', selectedChat._id);
      
      // Mark messages as read
      updateMessageStatus(selectedChat._id, 'read');
    }
  }, [socket, selectedChat]);
  
  // Fetch all chats
  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chats');
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  
  // Fetch messages when a chat is selected
  const fetchMessages = async (chatId) => {
    try {
      const { data } = await api.get(`/messages/${chatId}`);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };
  
  // Update message status (read/delivered)
  const updateMessageStatus = async (chatId, status) => {
    try {
      await api.put(`/messages/status/${chatId}`, { status });
    } catch (error) {
      console.error(`Error updating message status to ${status}:`, error);
    }
  };
  
  // Handle chat selection
  const handleChatSelect = async (chat) => {
    try {
      const messages = await fetchMessages(chat._id);
      
      // Update selected chat with messages
      setSelectedChat({
        ...chat,
        messages,
      });
      
      // Reset chat unread count
      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id === chat._id ? { ...c, unread: 0 } : c
        )
      );
      
      setShowEmojiPicker(false);
      setShowFileAttachment(false);
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      // Emit stop typing event
      socket.emit('stop_typing', {
        chatId: selectedChat._id,
        user: currentUser._id,
      });
      
      try {
        const messageData = {
          content: message,
          chatId: selectedChat._id,
          type: 'text',
        };
        
        // Add reply data if replying to a message
        if (replyTo) {
          messageData.replyTo = {
            messageId: replyTo.id,
            content: replyTo.text || '',
            type: replyTo.type || 'text',
            sender: replyTo.sender,
          };
        }
        
        // Send message to server
        const { data } = await api.post('/messages', messageData);
        
        // Emit socket event
        socket.emit('send_message', data);
        
        // Update UI
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
        }));
        
        // Update chat list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, latestMessage: data }
              : chat
          )
        );
        
        setMessage('');
        setReplyTo(null);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !selectedChat) return;
    
    socket.emit('typing', {
      chatId: selectedChat._id,
      user: currentUser._id,
    });
    
    // Stop typing indicator after 3 seconds
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    
    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= timerLength) {
        socket.emit('stop_typing', {
          chatId: selectedChat._id,
          user: currentUser._id,
        });
      }
    }, timerLength);
  };
  
  // Handle file uploads
  const handleFileSelect = async (fileData) => {
    if (selectedChat) {
      try {
        const messageData = {
          chatId: selectedChat._id,
          type: 'file',
          file: fileData,
        };
        
        const { data } = await api.post('/messages', messageData);
        
        // Emit socket event
        socket.emit('send_message', data);
        
        // Update UI
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
        }));
        
        // Update chat list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, latestMessage: data }
              : chat
          )
        );
        
        setShowFileAttachment(false);
      } catch (error) {
        console.error('Error sending file:', error);
      }
    }
  };
  
  // Handle message forwarding
  const handleForwardSubmit = async (message, selectedUsers) => {
    try {
      const { data } = await api.post('/messages/forward', {
        messageId: message.id,
        chatIds: selectedUsers,
      });
      
      console.log('Message forwarded:', data);
      
      // Emit socket events for each forwarded message
      data.forwardedMessages.forEach((msg) => {
        socket.emit('send_message', msg);
      });
      
      // Update UI
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        data.forwardedMessages.forEach((msg) => {
          const chatIndex = updatedChats.findIndex((c) => c._id === msg.chat._id);
          if (chatIndex !== -1) {
            updatedChats[chatIndex].latestMessage = msg;
          }
        });
        return updatedChats;
      });
      
      setShowForwardModal(false);
      setForwardMessage(null);
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };
  
  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      
      // Update UI
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== messageId),
      }));
      
      // If deleted message was the latest in chat, update chat list
      if (selectedChat.latestMessage && selectedChat.latestMessage.id === messageId) {
        const newLatestMessage = selectedChat.messages
          .filter((msg) => msg.id !== messageId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, latestMessage: newLatestMessage }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  
  // ... rest of your component logic
  
  return (
    // ... existing JSX with updated logic
  );
} 