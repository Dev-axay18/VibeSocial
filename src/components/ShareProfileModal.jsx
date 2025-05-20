import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Copy, 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageCircle,
  Link,
  Check
} from 'lucide-react'

export default function ShareProfileModal({ isOpen, onClose, profile }) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `${window.location.origin}/profile/${profile?.username}`
  const shareText = `Check out ${profile?.fullName}'s profile on VibeSocial!`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareOptions = [
    { 
      name: 'Copy Link', 
      icon: copied ? Check : Copy, 
      action: copyToClipboard,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`),
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`),
      color: 'from-blue-400 to-blue-500'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`),
      color: 'from-blue-600 to-blue-700'
    }
  ]

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
          className="glass-dark rounded-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share Profile</h2>
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

          {/* Profile Preview */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img 
                src={profile?.avatar} 
                alt={profile?.fullName}
                className="w-12 h-12 rounded-full border-2 border-white/20"
              />
              <div>
                <p className="text-white font-medium">{profile?.fullName}</p>
                <p className="text-gray-400 text-sm">@{profile?.username}</p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={option.action}
                    className="flex flex-col items-center p-4 glass rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-2`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{option.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 