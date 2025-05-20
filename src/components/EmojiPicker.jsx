import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EmojiPicker({ isOpen, onClose, onEmojiSelect }) {
  const [activeCategory, setActiveCategory] = useState('faces')

  const emojiCategories = {
    faces: {
      name: '😀',
      emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲']
    },
    gestures: {
      name: '👋',
      emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏']
    },
    hearts: {
      name: '❤️',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']
    },
    nature: {
      name: '🌱',
      emojis: ['🌱', '🌿', '🍀', '🍃', '🍂', '🍁', '🌾', '🌲', '🌳', '🌴', '🌵', '🌷', '🌸', '🌺', '🌻', '🌼', '🌽', '🍄', '🌰', '🦋', '🐛', '🐝', '🐞', '🦗']
    },
    food: {
      name: '🍎',
      emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕']
    },
    activities: {
      name: '⚽',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️‍♂️', '🤺', '🤸‍♀️', '🤸‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘‍♂️', '🏄‍♀️', '🏄‍♂️', '🏊‍♀️', '🏊‍♂️', '🤽‍♀️', '🤽‍♂️', '🚣‍♀️', '🚣‍♂️', '🧗‍♀️', '🧗‍♂️', '🚵‍♀️', '🚵‍♂️', '🚴‍♀️', '🚴‍♂️']
    }
  }

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="absolute bottom-full right-0 mb-2 glass-dark rounded-2xl p-4 w-80 h-80 z-50 border border-white/10"
      >
        {/* Category Tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
          {Object.entries(emojiCategories).map(([key, category]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveCategory(key)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                activeCategory === key 
                  ? 'bg-neon-blue/20 ring-2 ring-neon-blue' 
                  : 'hover:bg-white/5'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-8 gap-2">
            {emojiCategories[activeCategory].emojis.map((emoji, index) => (
              <motion.button
                key={`${activeCategory}-${index}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 