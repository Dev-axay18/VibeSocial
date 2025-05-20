import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, UserCheck, Search } from 'lucide-react'

export default function FollowersModal({ isOpen, onClose, type, userId }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [followingStates, setFollowingStates] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen, type, userId])

  const loadUsers = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate API response
      const mockUsers = [
        {
          id: 1,
          username: 'alex.vibe',
          fullName: 'Alex Rivera',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          isFollowing: type === 'followers' ? false : true,
          bio: '✨ Living the aesthetic life'
        },
        {
          id: 2,
          username: 'sarah.mood',
          fullName: 'Sarah Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          isFollowing: false,
          bio: '🎨 Digital artist & dreamer'
        },
        {
          id: 3,
          username: 'mike.chill',
          fullName: 'Mike Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
          isFollowing: true,
          bio: '🏔️ Adventure seeker'
        },
        {
          id: 4,
          username: 'luna.dreams',
          fullName: 'Luna Martinez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
          isFollowing: false,
          bio: '🌙 Nocturnal creative soul'
        },
        {
          id: 5,
          username: 'ray.energy',
          fullName: 'Ray Green',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ray',
          isFollowing: true,
          bio: '⚡ High energy vibes'
        }
      ]
      
      setUsers(mockUsers)
      
      // Initialize following states
      const states = {}
      mockUsers.forEach(user => {
        states[user.id] = user.isFollowing
      })
      setFollowingStates(states)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = (userId) => {
    setFollowingStates(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-dark rounded-3xl w-full max-w-md h-[70vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white capitalize">
              {type}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${type}...`}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-dark p-4 rounded-2xl flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-white font-medium group-hover:text-neon-blue transition-colors">
                          {user.fullName}
                        </h3>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                        <p className="text-gray-500 text-xs">{user.bio}</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFollow(user.id)}
                      className={`px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-2 ${
                        followingStates[user.id]
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-pink'
                      }`}
                    >
                      {followingStates[user.id] ? (
                        <>
                          <UserCheck size={16} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          <span>Follow</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 