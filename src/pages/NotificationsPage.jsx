import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, Share, Zap } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const loadNotifications = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setNotifications([
        {
          id: 1,
          type: 'like',
          user: {
            username: 'alex.vibe',
            fullName: 'Alex Rivera',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
          },
          post: {
            id: 123,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&q=80'
          },
          text: 'liked your post',
          timestamp: '2m ago',
          isRead: false
        },
        {
          id: 2,
          type: 'comment',
          user: {
            username: 'sarah.mood',
            fullName: 'Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
          },
          post: {
            id: 456,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=80'
          },
          text: 'commented: "This is absolutely beautiful! ✨"',
          timestamp: '15m ago',
          isRead: false
        },
        {
          id: 3,
          type: 'follow',
          user: {
            username: 'mike.chill',
            fullName: 'Mike Johnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
          },
          text: 'started following you',
          timestamp: '1h ago',
          isRead: true
        },
        {
          id: 4,
          type: 'share',
          user: {
            username: 'luna.dreams',
            fullName: 'Luna Martinez',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna'
          },
          post: {
            id: 789,
            image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&q=80'
          },
          text: 'shared your post to their story',
          timestamp: '3h ago',
          isRead: true
        },
        {
          id: 5,
          type: 'like',
          user: {
            username: 'ray.energy',
            fullName: 'Ray Green',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ray'
          },
          post: {
            id: 101,
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80'
          },
          text: 'and 23 others liked your post',
          timestamp: '6h ago',
          isRead: true
        },
        {
          id: 6,
          type: 'mention',
          user: {
            username: 'jade.minimal',
            fullName: 'Jade Wong',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jade'
          },
          text: 'mentioned you in a comment',
          timestamp: '1d ago',
          isRead: true
        }
      ])
      
      setLoading(false)
    }

    loadNotifications()
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />
      case 'comment':
        return <MessageCircle size={20} className="text-blue-500" />
      case 'follow':
        return <UserPlus size={20} className="text-green-500" />
      case 'share':
        return <Share size={20} className="text-purple-500" />
      case 'mention':
        return <Zap size={20} className="text-yellow-500" />
      default:
        return <Heart size={20} className="text-gray-500" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.isRead
    return notification.type === filter
  })

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'like', label: 'Likes' },
    { id: 'comment', label: 'Comments' },
    { id: 'follow', label: 'Follows' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-20 pb-20 max-w-2xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Notifications</h1>
        <p className="text-gray-400">Stay updated with your vibes</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8 overflow-x-auto"
      >
        <div className="glass rounded-full p-1 flex min-w-max">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`relative px-4 py-2 rounded-full transition-all text-sm ${
                filter === filterItem.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filterItem.label}
              {filter === filterItem.id && (
                <motion.div
                  layoutId="notification-filter-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`glass-dark p-4 rounded-2xl flex items-center space-x-4 group cursor-pointer transition-all ${
              !notification.isRead ? 'ring-1 ring-neon-blue/20' : ''
            }`}
          >
            {/* Notification Icon */}
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>

            {/* User Avatar */}
            <div className="flex-shrink-0">
              <img
                src={notification.user.avatar}
                alt={notification.user.fullName}
                className="w-10 h-10 rounded-full"
              />
            </div>

            {/* Notification Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-medium hover:text-neon-blue transition-colors cursor-pointer">
                      {notification.user.fullName}
                    </span>
                    {' '}
                    <span className="text-gray-300">{notification.text}</span>
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{notification.timestamp}</p>
                </div>

                {/* Post Thumbnail */}
                {notification.post && (
                  <div className="flex-shrink-0 ml-4">
                    <img
                      src={notification.post.image}
                      alt="Post"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Unread Indicator */}
            {!notification.isRead && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-neon-blue rounded-full" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
            <Heart size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
          <p className="text-gray-400">Your notifications will appear here</p>
        </motion.div>
      )}

      {/* Mark All as Read */}
      {filteredNotifications.some(n => !n.isRead) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            }}
            className="px-6 py-3 glass rounded-full text-white hover:bg-white/10 transition-all"
          >
            Mark All as Read
          </motion.button>
        </motion.div>
      )}
    </div>
  )
} 