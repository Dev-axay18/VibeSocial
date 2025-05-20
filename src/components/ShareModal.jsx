import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Search, 
  Check, 
  Send,
  Users,
  MessageCircle 
} from 'lucide-react'

export default function ShareModal({ isOpen, onClose, content, onShare }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [shareMessage, setShareMessage] = useState('')

  // Mock users/chats data (in real app, this would come from props or context)
  const users = [
    {
      id: 1,
      name: 'Alex Rivera',
      username: 'alex.vibe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      online: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      username: 'sarah.mood',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      online: false
    },
    {
      id: 3,
      name: 'Mike Johnson',
      username: 'mike.chill',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      online: true
    },
    {
      id: 4,
      name: 'Luna Martinez',
      username: 'luna.dreams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
      online: false
    },
    {
      id: 5,
      name: 'David Kim',
      username: 'david.zen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      online: true
    },
    {
      id: 6,
      name: 'Emma Wilson',
      username: 'emma.flow',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      online: true
    }
  ]

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserSelect = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id)
      if (isSelected) {
        return prev.filter(u => u.id !== user.id)
      } else {
        return [...prev, user]
      }
    })
  }

  const handleShare = () => {
    if (selectedUsers.length > 0) {
      const shareData = {
        content,
        selectedUsers,
        message: shareMessage,
        timestamp: new Date().toISOString()
      }
      onShare(shareData)
      onClose()
      setSelectedUsers([])
      setShareMessage('')
      setSearchQuery('')
    }
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([])
      setShareMessage('')
      setSearchQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-dark rounded-2xl w-full max-w-md h-[90vh] max-h-[600px] flex flex-col overflow-hidden"
        >
          {/* Header - Fixed */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share {content?.type}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>

          {/* Content Preview - Fixed */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 glass rounded-lg">
              {content?.type === 'post' && content.image && (
                <img 
                  src={content.image} 
                  alt="Post" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              {content?.type === 'reel' && content.video && (
                <video 
                  src={content.video}
                  className="w-12 h-12 rounded-lg object-cover"
                  muted
                />
              )}
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {content?.type === 'post' ? content.caption || 'Post' : 'Reel'}
                </p>
                <p className="text-gray-400 text-xs">by @{content?.username}</p>
              </div>
            </div>
          </div>

          {/* Search - Fixed */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Selected Users - Fixed height if present */}
          {selectedUsers.length > 0 && (
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto scrollbar-hide">
                {selectedUsers.map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-2 bg-neon-blue/20 rounded-full px-3 py-1"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white text-sm truncate max-w-[80px]">{user.name}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUserSelect(user)}
                      className="text-white/70 hover:text-white flex-shrink-0"
                    >
                      <X size={14} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* User List - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleUserSelect(user)}
                className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                    {user.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-gray-400 text-sm truncate">@{user.username}</p>
                  </div>
                </div>
                
                <motion.div
                  animate={{ 
                    scale: selectedUsers.find(u => u.id === user.id) ? 1 : 0.8,
                    opacity: selectedUsers.find(u => u.id === user.id) ? 1 : 0.5 
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    selectedUsers.find(u => u.id === user.id)
                      ? 'bg-neon-blue border-neon-blue'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedUsers.find(u => u.id === user.id) && (
                    <Check size={14} className="text-white" />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Message Input & Share Button - Fixed at bottom */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="mb-3">
              <input
                type="text"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Add a message... (optional)"
                className="w-full px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all text-sm"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              disabled={selectedUsers.length === 0}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                selectedUsers.length > 0
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-pink'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
              <span>
                Share {selectedUsers.length > 0 && `to ${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''}`}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 