import { motion } from 'framer-motion'
import { X, Reply } from 'lucide-react'

export default function ReplyPreview({ replyTo, onCancelReply }) {
  if (!replyTo) return null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="px-4 py-3 border-t border-white/10 bg-black/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Reply size={16} className="text-neon-blue" />
          <span className="text-sm text-gray-400">Replying to</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancelReply}
          className="p-1 rounded-full hover:bg-white/10"
        >
          <X size={16} className="text-gray-400" />
        </motion.button>
      </div>
      <div className="bg-white/5 rounded-lg p-3 border-l-2 border-neon-blue">
        <p className="text-xs text-gray-400 mb-1">@{replyTo.sender === 'me' ? 'You' : replyTo.senderName}</p>
        <p className="text-white text-sm truncate">
          {replyTo.type === 'file' ? `📎 ${replyTo.file.name}` : replyTo.text}
        </p>
      </div>
    </motion.div>
  )
} 