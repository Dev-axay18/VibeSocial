import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MoreVertical, 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video,
  ArrowLeft,
  UserPlus,
  Settings,
  MessageCircle
} from 'lucide-react'
import EmojiPicker from '../components/EmojiPicker'
import FileAttachment from '../components/FileAttachment'
import FilePreview from '../components/FilePreview'
import MessageBubble from '../components/MessageBubble'
import ReplyPreview from '../components/ReplyPreview'
import ForwardMessageModal from '../components/ForwardMessageModal'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileView, setIsMobileView] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileAttachment, setShowFileAttachment] = useState(false)
  const messagesEndRef = useRef(null)
  const [replyTo, setReplyTo] = useState(null)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [forwardMessage, setForwardMessage] = useState(null)

  // Check if it's mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobileView()
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  // Updated mock chat data with message status
  const chats = [
    {
      id: 1,
      name: 'Vikas Sharma',
      username: 'alex.vibe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      lastMessage: 'That sunset post was incredible! 🌅',
      timestamp: '2 min',
      unread: 2,
      online: true,
      messages: [
        { 
          id: 1, 
          text: 'Hey! How\'s it going?', 
          sender: 'other', 
          senderName: 'Vikas Sharma',
          timestamp: '10:30 AM', 
          type: 'text',
          status: 'read'
        },
        { 
          id: 2, 
          text: 'Great! Just posted a new photo. Check it out!', 
          sender: 'me', 
          timestamp: '10:32 AM', 
          type: 'text',
          status: 'read',
          replyTo: { id: 1, text: 'Hey! How\'s it going?', sender: 'other' }
        },
        { 
          id: 3, 
          sender: 'other', 
          senderName: 'Vikas Sharma',
          timestamp: '10:33 AM', 
          type: 'file',
          status: 'delivered',
          file: {
            name: 'sunset-photo.jpg',
            type: 'image/jpeg',
            size: 1024000,
            url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80'
          }
        },
        { 
          id: 4, 
          text: 'Wow, that sunset looks amazing! 🌅', 
          sender: 'other', 
          senderName: 'Vikas Sharma',
          timestamp: '10:35 AM', 
          type: 'text',
          status: 'read',
          replyTo: { id: 3, type: 'file', sender: 'other', file: { name: 'sunset-photo.jpg' } }
        },
        { 
          id: 5, 
          text: 'Thanks! I was waiting for the perfect moment', 
          sender: 'me', 
          timestamp: '10:36 AM', 
          type: 'text',
          status: 'sent'
        },
      ]
    },
    {
      id: 2,
      name: 'Kshitija Shinde',
      username: 'sarah.mood',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      lastMessage: 'See you at the art gallery tomorrow!',
      timestamp: '15 min',
      unread: 0,
      online: false,
      lastSeen: '1 hour ago',
      messages: [
        { id: 1, text: 'Don\'t forget about the art exhibition tomorrow', sender: 'other', timestamp: '9:15 AM', type: 'text' },
        { id: 2, text: 'Wouldn\'t miss it! What time again?', sender: 'me', timestamp: '9:16 AM', type: 'text' },
        { id: 3, text: '6 PM. Meet you at the entrance?', sender: 'other', timestamp: '9:17 AM', type: 'text' },
        { id: 4, text: 'Perfect! Can\'t wait to see your new pieces', sender: 'me', timestamp: '9:18 AM', type: 'text' },
        { 
          id: 5, 
          sender: 'other', 
          timestamp: '9:19 AM', 
          type: 'file',
          file: {
            name: 'exhibition-brochure.pdf',
            type: 'application/pdf',
            size: 2048000,
            url: '#'
          }
        },
        { id: 6, text: 'See you at the art gallery tomorrow!', sender: 'other', timestamp: '9:20 AM', type: 'text' },
      ]
    },
    {
      id: 3,
      name: 'Sarthak Desai',
      username: 'mike.chill',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      lastMessage: 'The hiking trail was epic! 🏔️',
      timestamp: '1 hour',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'Dude, you have to check out this trail I found', sender: 'other', timestamp: '8:00 AM', type: 'text' },
        { id: 2, text: 'Oh nice! Where is it?', sender: 'me', timestamp: '8:05 AM', type: 'text' },
        { id: 3, text: 'Up in the mountains, about 2 hours drive', sender: 'other', timestamp: '8:06 AM', type: 'text' },
        { 
          id: 4, 
          sender: 'other', 
          timestamp: '8:07 AM', 
          type: 'file',
          file: {
            name: 'trail-video.mp4',
            type: 'video/mp4',
            size: 15728640,
            url: 'https://www.w3schools.com/html/mov_bbb.mp4'
          }
        },
        { id: 5, text: 'The hiking trail was epic! 🏔️', sender: 'other', timestamp: '8:10 AM', type: 'text' },
      ]
    },
    {
      id: 4,
      name: 'Deepak Srisant',
      username: 'luna.dreams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
      lastMessage: 'That meditation session was so peaceful',
      timestamp: '3 hours',
      unread: 0,
      online: false,
      lastSeen: '2 hours ago',
      messages: [
        { id: 1, text: 'Thanks for joining the meditation group today', sender: 'other', timestamp: 'Yesterday', type: 'text' },
        { id: 2, text: 'It was exactly what I needed!', sender: 'me', timestamp: 'Yesterday', type: 'text' },
        { id: 3, text: 'Same here. We should do it more often', sender: 'other', timestamp: 'Yesterday', type: 'text' },
        { id: 4, text: 'Absolutely! Maybe weekly?', sender: 'me', timestamp: 'Yesterday', type: 'text' },
        { 
          id: 5, 
          sender: 'other', 
          timestamp: 'Yesterday', 
          type: 'file',
          file: {
            name: 'relaxing-music.mp3',
            type: 'audio/mpeg',
            size: 5242880,
            url: '#'
          }
        },
        { id: 6, text: 'That meditation session was so peaceful', sender: 'other', timestamp: 'Yesterday', type: 'text' },
      ]
    }
  ]

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sent',
        ...(replyTo && { replyTo })
      }
      
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      }
      
      setSelectedChat(updatedChat)
      setMessage('')
      setReplyTo(null)
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji)
  }

  const handleFileSelect = (fileData) => {
    if (selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file',
        file: fileData
      }
      
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      }
      
      setSelectedChat(updatedChat)
    }
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    setShowEmojiPicker(false)
    setShowFileAttachment(false)
  }

  const handleBackToList = () => {
    setSelectedChat(null)
    setShowEmojiPicker(false)
    setShowFileAttachment(false)
  }

  const handleReply = (messageToReply) => {
    setReplyTo(messageToReply)
  }

  const handleForward = (messageToForward) => {
    setForwardMessage(messageToForward)
    setShowForwardModal(true)
  }

  const handleForwardSubmit = (message, selectedUsers) => {
    console.log('Forwarding message to:', selectedUsers)
    alert(`Message forwarded to ${selectedUsers.length} user(s)!`)
    setShowForwardModal(false)
    setForwardMessage(null)
  }

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = selectedChat.messages.filter(msg => msg.id !== messageId)
    setSelectedChat({ ...selectedChat, messages: updatedMessages })
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.emoji-picker-container') && !event.target.closest('.emoji-button')) {
        setShowEmojiPicker(false)
      }
      if (!event.target.closest('.file-attachment-container') && !event.target.closest('.attachment-button')) {
        setShowFileAttachment(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="pt-16 md:pt-20 pb-16 md:pb-20 h-screen overflow-hidden flex">
      {/* Chat List - Always visible on desktop, conditionally on mobile */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${
          isMobileView 
            ? selectedChat 
              ? 'hidden' 
              : 'w-full' 
            : 'w-80 min-w-[320px] border-r border-white/10'
        } bg-black/20 backdrop-blur-md flex flex-col h-full`}
      >
        {/* Chat List Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Messages</h1>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <UserPlus size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <Settings size={18} />
              </motion.button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 cursor-pointer transition-all border-b border-white/5 ${
                selectedChat?.id === chat.id ? 'bg-neon-blue/10' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={chat.avatar} 
                    alt={chat.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white text-sm truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-400">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <div className="bg-neon-blue rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat Messages - Always visible on desktop, conditionally on mobile */}
      <div className={`${
        isMobileView 
          ? selectedChat 
            ? 'w-full' 
            : 'hidden' 
          : 'flex-1'
      } flex flex-col bg-black/10 h-full`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 sm:p-6 border-b border-white/10 backdrop-blur-md bg-black/20 flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Back button for mobile */}
                  {isMobileView && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBackToList}
                      className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </motion.button>
                  )}
                  
                  <div className="relative">
                    <img 
                      src={selectedChat.avatar} 
                      alt={selectedChat.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/20"
                    />
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-bold text-white text-sm sm:text-base">{selectedChat.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {selectedChat.online ? 'Online' : `Last seen ${selectedChat.lastSeen || '2 hours ago'}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-3 glass rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-3 glass rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <Video size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-3 glass rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <AnimatePresence>
                {selectedChat.messages.map((msg, index) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isMe={msg.sender === 'me'}
                    onReply={handleReply}
                    onForward={handleForward}
                    onDelete={handleDeleteMessage}
                    chatPartner={selectedChat.name}
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            <ReplyPreview 
              replyTo={replyTo} 
              onCancelReply={() => setReplyTo(null)} 
            />

            {/* Message Input */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 sm:p-6 border-t border-white/10 backdrop-blur-md bg-black/20 flex-shrink-0 relative"
            >
              {/* File Attachment Modal */}
              <div className="file-attachment-container">
                <FileAttachment 
                  isOpen={showFileAttachment}
                  onClose={() => setShowFileAttachment(false)}
                  onFileSelect={handleFileSelect}
                />
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFileAttachment(!showFileAttachment)}
                  className="attachment-button p-2 sm:p-3 glass rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Paperclip size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all text-sm sm:text-base"
                  />
                </div>
                
                <div className="relative emoji-picker-container">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="emoji-button p-2 sm:p-3 glass rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <Smile size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                  
                  <EmojiPicker 
                    isOpen={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onEmojiSelect={handleEmojiSelect}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendMessage}
                  className="p-2 sm:p-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white transition-all hover:from-neon-purple hover:to-neon-pink"
                >
                  <Send size={18} className="sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </motion.div>
          </>
        ) : (
          /* No Chat Selected - Only show on desktop */
          !isMobileView && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <MessageCircle size={40} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Forward Message Modal */}
      <ForwardMessageModal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        message={forwardMessage}
        onForward={handleForwardSubmit}
      />
    </div>
  )
} 