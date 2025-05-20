import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Reply, Forward, Copy, Trash2, Edit } from 'lucide-react'
import MessageStatus from './MessageStatus'
import FilePreview from './FilePreview'

export default function MessageBubble({ message, isMe, onReply, onForward, onDelete, chatPartner }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  const handleCopyMessage = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text)
      alert('Message copied to clipboard!')
    }
    setShowMenu(false)
  }

  const handleReply = () => {
    onReply(message)
    setShowMenu(false)
  }

  const handleForward = () => {
    onForward(message)
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id)
    }
    setShowMenu(false)
  }

  const menuItems = [
    { icon: Reply, label: 'Reply', action: handleReply },
    { icon: Forward, label: 'Forward', action: handleForward },
    ...(message.type === 'text' ? [{ icon: Copy, label: 'Copy', action: handleCopyMessage }] : []),
    ...(isMe ? [{ icon: Trash2, label: 'Delete', action: handleDelete, danger: true }] : [])
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex relative group ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs sm:max-w-sm lg:max-w-md ${isMe ? 'order-1' : 'order-2'}`}>
        {/* Reply Reference */}
        {message.replyTo && (
          <div className={`mb-2 ${isMe ? 'ml-8' : 'mr-8'}`}>
            <div className="bg-white/5 rounded-lg p-2 border-l-2 border-neon-blue">
              <p className="text-xs text-gray-400 mb-1">
                @{message.replyTo.sender === 'me' ? 'You' : chatPartner}
              </p>
              <p className="text-gray-300 text-xs truncate">
                {message.replyTo.type === 'file' ? `📎 ${message.replyTo.file?.name}` : message.replyTo.text}
              </p>
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={`relative ${
          message.type === 'file' ? '' : 
          isMe
            ? 'bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl p-3 sm:p-4'
            : 'glass-dark rounded-2xl p-3 sm:p-4'
        }`}>
          {message.type === 'file' ? (
            <FilePreview file={message.file} isMe={isMe} />
          ) : (
            <>
              <p className="text-white text-sm sm:text-base break-words">{message.text}</p>
              <MessageStatus status={message.status} timestamp={message.timestamp} />
            </>
          )}

          {/* Message Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10 ${
              isMe ? 'left-2' : 'right-2'
            }`}
          >
            <MoreVertical size={16} className="text-gray-400" />
          </motion.button>
        </div>

        {/* Message Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute z-10 mt-2 glass-dark rounded-lg border border-white/10 py-2 min-w-[120px] ${
                isMe ? 'right-0' : 'left-0'
              }`}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={item.action}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                      item.danger ? 'text-red-400 hover:text-red-300' : 'text-white hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  )
} 