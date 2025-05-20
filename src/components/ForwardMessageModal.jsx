import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Search, 
  Check, 
  Send,
  Users,
  FileText,
  Image,
  Video
} from 'lucide-react'

export default function ForwardMessageModal({ isOpen, onClose, message, onForward }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  // Mock users data
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

  const handleForward = () => {
    if (selectedUsers.length > 0) {
      onForward(message, selectedUsers)
      onClose()
      setSelectedUsers([])
      setSearchQuery('')
    }
  }

  const renderMessagePreview = () => {
    if (message.type === 'file') {
      const getFileIcon = () => {
        if (message.file.type.startsWith('image/')) return Image
        if (message.file.type.startsWith('video/')) return Video
        return FileText
      }
      const FileIcon = getFileIcon()

      return (
        <div className="flex items-center space-x-3 p-3 glass rounded-lg">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <FileIcon size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium truncate">{message.file.name}</p>
            <p className="text-gray-400 text-xs">File</p>
          </div>
        </div>
      )
    }

    return (
      <div className="p-3 glass rounded-lg">
        <p className="text-white text-sm">{message.text}</p>
      </div>
    )
  }

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
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Forward Message</h2>
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

          {/* Message Preview */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            {renderMessagePreview()}
          </div>

          {/* Search */}
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

          {/* User List */}
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

          {/* Forward Button */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleForward}
              disabled={selectedUsers.length === 0}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                selectedUsers.length > 0
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-pink'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
              <span>
                Forward {selectedUsers.length > 0 && `to ${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''}`}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 