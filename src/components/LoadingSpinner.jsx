import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            className="absolute w-1 h-1 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Spinner */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-full"
          style={{
            background: `conic-gradient(from 0deg, #00f5ff, #8338ec, #ff006e, #00f5ff)`,
            borderRadius: '50%',
            padding: '4px'
          }}
        >
          <div className="w-full h-full bg-gray-900 rounded-full" />
        </motion.div>
        
        {/* Pulsing Center */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-1/3 text-center"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400 text-lg"
        >
          Loading your vibes...
        </motion.p>
      </motion.div>
    </div>
  )
} 