import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Users, Heart, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-neon-pink/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-neon-blue to-neon-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">V</span>
            </div>
            <span className="gradient-text font-bold text-xl sm:text-2xl">VibeSocial</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex space-x-3 sm:space-x-4"
          >
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 sm:px-6 sm:py-3 glass rounded-full text-white font-medium hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                Sign In
              </motion.button>
            </Link>
            <Link to="/auth?mode=signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white font-medium hover:from-neon-purple hover:to-neon-pink transition-all text-sm sm:text-base"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-6 sm:mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
                Share Your{' '}
                <span className="gradient-text">Vibes</span>
                <br />
                Express Your{' '}
                <span className="gradient-text">Energy</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Connect with like-minded souls, share your aesthetic moments, and build meaningful relationships in a platform designed for authentic self-expression.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-12"
            >
              <Link to="/auth?mode=signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white font-semibold text-lg hover:from-neon-purple hover:to-neon-pink transition-all flex items-center justify-center group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 glass rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-16"
            >
              {[
                { icon: Sparkles, title: "Aesthetic Vibes", description: "Share your mood with beautiful visuals" },
                { icon: Users, title: "Vibe Communities", description: "Connect with your tribe" },
                { icon: Heart, title: "Authentic Connections", description: "Build meaningful relationships" },
                { icon: Zap, title: "Real-time Energy", description: "Live interactions that matter" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="glass-enhanced p-4 sm:p-6 rounded-2xl text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center p-4 sm:p-6 lg:p-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-gray-400 text-sm sm:text-base"
          >
            © 2024 VibeSocial. Designed for the aesthetic generation.
          </motion.p>
        </footer>
      </div>
    </div>
  )
} 