import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share, MoreVertical, Music, Play, Bookmark, Send } from 'lucide-react'
import CommentSection from './CommentSection'
import { useState } from 'react'
import ShareModal from './ShareModal'

export default function PostCard({ post, onLike }) {
  const {
    id,
    user,
    image,
    mood,
    caption,
    likes,
    comments,
    timestamp,
    hasMusic,
    musicTrack,
    isLiked
  } = post

  const [showComments, setShowComments] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleLike = () => {
    onLike(id)
  }

  const handleDoubleClick = () => {
    if (!isLiked) {
      onLike(id)
    }
  }

  const handleShare = (shareData) => {
    console.log('Sharing post:', shareData)
    // In a real app, this would send the shared content to the selected users
    // You could integrate this with your chat system or backend
    alert(`Shared post to ${shareData.selectedUsers.length} user(s)!`)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="glass-dark rounded-2xl sm:rounded-3xl overflow-hidden group"
        style={{
          background: `
            linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%),
            radial-gradient(ellipse at top, rgba(0, 245, 255, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ x: 4 }}
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gradient-to-r from-neon-blue to-neon-purple"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm sm:text-base">{user.fullName}</h3>
              <p className="text-gray-400 text-xs sm:text-sm">@{user.username}</p>
            </div>
          </motion.div>
          <motion.button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors group-hover:bg-white/5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical size={18} className="text-gray-400" />
          </motion.button>
        </div>

        {/* Mood Tag */}
        {mood && (
          <div className="px-3 sm:px-4 pb-2">
            <motion.span 
              className="inline-block px-3 py-1 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full text-xs sm:text-sm text-white border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              {mood}
            </motion.span>
          </div>
        )}

        {/* Image */}
        <div className="relative overflow-hidden group/image">
          <motion.img
            src={image}
            alt="Post"
            className="w-full aspect-square object-cover"
            whileHover={{ scale: 1.02 }}
            onDoubleClick={handleDoubleClick}
            transition={{ duration: 0.3 }}
          />
          
          {/* Double-tap heart animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isLiked ? { scale: [0, 1.2, 0], opacity: [0, 1, 0] } : {}}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart size={60} className="sm:w-20 sm:h-20 text-red-500 fill-current" />
          </motion.div>

          {/* Music Player */}
          {hasMusic && (
            <motion.div 
              className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-2 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            >
              <Music size={14} className="text-white" />
              <span className="text-white text-xs sm:text-sm">{musicTrack}</span>
              <motion.div
                animate={isPlayingMusic ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Play size={12} className="text-white" />
              </motion.div>
            </motion.div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Actions */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`p-2 rounded-full transition-all ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={20} className={`sm:w-6 sm:h-6 ${isLiked ? 'fill-current' : ''}`} />
                </motion.div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowComments(true)}
                className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
              >
                <MessageCircle size={20} className="sm:w-6 sm:h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareModal(true)}
                className="p-3 rounded-full hover:bg-white/5 transition-all group"
              >
                <Send 
                  size={24} 
                  className="text-gray-400 group-hover:text-neon-blue transition-colors" 
                />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-all ${
                isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <Bookmark size={20} className={`sm:w-6 sm:h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Likes and comments */}
          <div className="space-y-2">
            <motion.p 
              className="text-white font-medium text-sm sm:text-base"
              whileHover={{ x: 4 }}
            >
              {likes.toLocaleString()} likes
            </motion.p>
            <p className="text-white text-sm sm:text-base">
              <span className="font-medium">@{user.username}</span>{' '}
              <span className="text-gray-300">{caption}</span>
            </p>
            {comments > 0 && (
              <motion.p 
                className="text-gray-400 text-xs sm:text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => setShowComments(true)}
                whileHover={{ x: 4 }}
              >
                View all {comments} comments
              </motion.p>
            )}
            <p className="text-gray-400 text-xs">{timestamp}</p>
          </div>
        </div>

        <CommentSection 
          postId={id} 
          isOpen={showComments} 
          onClose={() => setShowComments(false)} 
        />
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        content={{
          type: 'post',
          id: post.id,
          caption: post.caption,
          image: post.image,
          username: post.username
        }}
        onShare={handleShare}
      />
    </>
  )
} 