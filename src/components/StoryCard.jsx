import { motion } from 'framer-motion';

export default function StoryCard({ story }) {
  const { username, avatar, hasStory, isViewed } = story;

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer relative group transition-all duration-300"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`relative ${
          hasStory && !isViewed
            ? 'p-[2px] bg-gradient-to-tr from-pink-500 via-blue-500 to-purple-500 rounded-full'
            : 'p-[2px]'
        }`}
      >
        <div className="bg-black p-[2px] rounded-full">
          <motion.img
            src={avatar}
            alt={username}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-700 object-cover shadow-md"
          />
        </div>

        {/* Glowing animated aura */}
        {hasStory && !isViewed && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow:
                '0 0 12px rgba(255, 0, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1.1, 0.95],
            }}
            transition={{
              duration: 1.8,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        )}
      </motion.div>

      {/* Username */}
      <motion.span
        className="text-white text-xs mt-2 truncate max-w-[72px] group-hover:scale-105 transition-transform duration-200"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {username}
      </motion.span>
    </motion.div>
  );
}
