import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Hash, Users, X, Filter } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [results, setResults] = useState({
    users: [],
    posts: [],
    tags: []
  })
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setRecentSearches([
      { id: 1, type: 'user', text: '@alex.vibe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      { id: 2, type: 'tag', text: '#GoldenHour' },
      { id: 3, type: 'user', text: '@sarah.mood', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      { id: 4, type: 'tag', text: '#AestheticVibes' },
    ])
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      const searchWithDelay = setTimeout(() => {
        performSearch()
      }, 300)

      return () => clearTimeout(searchWithDelay)
    } else {
      setResults({ users: [], posts: [], tags: [] })
    }
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    
    // Simulate search API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setResults({
      users: [
        {
          id: 1,
          username: 'alex.vibe',
          fullName: 'Alex Rivera',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          followers: '12.5k',
          isVerified: true,
          bio: '✨ Living the aesthetic life'
        },
        {
          id: 2,
          username: 'sarah.mood',
          fullName: 'Sarah Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          followers: '8.9k',
          isVerified: false,
          bio: '🎨 Digital artist & dreamer'
        },
        {
          id: 3,
          username: 'luna.dreams',
          fullName: 'Luna Martinez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
          followers: '15.2k',
          isVerified: true,
          bio: '🌙 Nocturnal creative soul'
        }
      ],
      posts: [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
          user: { username: 'alex.vibe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
          mood: '🌅 Golden Hour',
          likes: 234
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
          user: { username: 'sarah.mood', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
          mood: '🎨 Creative',
          likes: 189
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
          user: { username: 'luna.dreams', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna' },
          mood: '✨ Aesthetic',
          likes: 456
        }
      ],
      tags: [
        { id: 1, name: '#GoldenHour', posts: '12.4k', trending: true },
        { id: 2, name: '#AestheticVibes', posts: '8.9k', trending: false },
        { id: 3, name: '#DreamyMood', posts: '15.2k', trending: true },
        { id: 4, name: '#CreativeFlow', posts: '6.7k', trending: false },
      ]
    })
    
    setLoading(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults({ users: [], posts: [], tags: [] })
  }

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'users', label: 'People' },
    { id: 'posts', label: 'Posts' },
    { id: 'tags', label: 'Tags' },
  ]

  return (
    <div className="pt-20 pb-20 max-w-2xl mx-auto px-4">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, posts, or tags..."
            className="w-full pl-12 pr-16 py-4 glass rounded-2xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all text-lg"
            autoFocus
          />
          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </motion.button>
          )}
        </div>
        
        {/* Filter Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 px-4 py-2 glass rounded-full text-gray-400 hover:text-white transition-colors flex items-center"
        >
          <Filter size={16} className="mr-2" />
          Filters
        </motion.button>
      </motion.div>

      {/* Tabs */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="glass rounded-full p-1">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-full transition-all ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="search-tab-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full -z-10"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : query ? (
        <div className="space-y-6">
          {/* Users Results */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {activeTab === 'all' && <h3 className="text-lg font-semibold text-white mb-4">People</h3>}
              <div className="space-y-3">
                {results.users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-dark p-4 rounded-2xl flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full"
                        />
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium group-hover:text-neon-blue transition-colors">
                          {user.fullName}
                        </h4>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                        <p className="text-gray-500 text-xs">{user.bio}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{user.followers} followers</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 px-4 py-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white text-sm font-medium hover:from-neon-purple hover:to-neon-pink transition-all"
                      >
                        Follow
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {activeTab === 'all' && <h3 className="text-lg font-semibold text-white mb-4">Posts</h3>}
              <div className="grid grid-cols-3 gap-2">
                {results.posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt={`Post by ${post.user.username}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">{post.mood}</p>
                      <p className="text-gray-300 text-xs">{post.likes} likes</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags Results */}
          {(activeTab === 'all' || activeTab === 'tags') && results.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {activeTab === 'all' && <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>}
              <div className="space-y-3">
                {results.tags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-dark p-4 rounded-2xl flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
                        <Hash size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium group-hover:text-neon-blue transition-colors">
                          {tag.name}
                        </h4>
                        <p className="text-gray-400 text-sm">{tag.posts} posts</p>
                      </div>
                    </div>
                    {tag.trending && (
                      <div className="px-3 py-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full">
                        <span className="text-white text-xs font-medium">Trending</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Recent Searches */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Searches</h3>
          <div className="space-y-3">
            {recentSearches.map((search, index) => (
              <motion.div
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setQuery(search.text)}
                className="glass-dark p-4 rounded-2xl flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {search.type === 'user' ? (
                    <img
                      src={search.avatar}
                      alt={search.text}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
                      <Hash size={20} className="text-white" />
                    </div>
                  )}
                  <span className="text-white group-hover:text-neon-blue transition-colors">
                    {search.text}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setRecentSearches(prev => prev.filter(s => s.id !== search.id))
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
} 