import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function MessageStatus({ status, timestamp }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return (
          <div className="flex items-center space-x-1">
            <Eye size={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
        )
      case 'delivered':
        return (
          <div className="flex items-center space-x-1">
            <div className="flex">
              <Eye size={12} className="text-blue-400" />
              <Eye size={12} className="text-blue-400 -ml-1" />
            </div>
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
        )
      case 'read':
        return (
          <div className="flex items-center space-x-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="flex"
            >
              <Eye size={12} className="text-neon-blue fill-current" />
              <Eye size={12} className="text-neon-blue fill-current -ml-1" />
            </motion.div>
            <span className="text-xs text-blue-300">{timestamp}</span>
          </div>
        )
      default:
        return <span className="text-xs text-gray-500">{timestamp}</span>
    }
  }

  return <div className="mt-1">{getStatusIcon()}</div>
} 