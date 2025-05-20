import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  PlusCircle, 
  Heart, 
  MessageCircle,
  User as UserIcon,
  Compass,
  Youtube,
  Menu,
  X,
  MoreHorizontal
} from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showMoreItems, setShowMoreItems] = useState(false)

  // Hide navbar on landing and auth pages
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null
  }

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: Compass, path: '/explore', label: 'Explore' },
    { icon: PlusCircle, path: '/create', label: 'Create' },
    { icon: Youtube, path: '/vibe-reels', label: 'VibeReels' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: Heart, path: '/notifications', label: 'Notifications' },
    { icon: UserIcon, path: '/profile/me', label: 'Profile' },
  ]

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
    setShowMoreItems(false)
  }

  return (
    <>
      {/* Desktop/Tablet Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="gradient-text font-bold text-xl hidden sm:block">VibeSocial</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon

                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} />
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-xl -z-10"
                        />
                      )}
                      <span className="sr-only">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-black/30 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon

                  return (
                    <Link key={item.path} to={item.path} onClick={handleNavClick}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-t border-white/10">
        <div className="grid grid-cols-5 gap-1 p-2">
          {/* First 4 main items */}
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    isActive 
                      ? 'text-neon-blue' 
                      : 'text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}

          {/* More button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMoreItems(!showMoreItems)}
            className="flex flex-col items-center p-2 rounded-lg transition-all text-gray-400"
          >
            <MoreHorizontal size={20} />
            <span className="text-xs mt-1">More</span>
          </motion.button>
        </div>

        {/* Extended Bottom Menu */}
        <AnimatePresence>
          {showMoreItems && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-full left-0 right-0 backdrop-blur-md bg-black/30 border-t border-white/10"
            >
              <div className="grid grid-cols-4 gap-1 p-2">
                {navItems.slice(4).map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon

                  return (
                    <Link key={item.path} to={item.path} onClick={() => setShowMoreItems(false)}>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                          isActive 
                            ? 'text-neon-blue' 
                            : 'text-gray-400'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-xs mt-1">{item.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
} 