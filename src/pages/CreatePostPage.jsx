import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, Music, Palette, Type, X, Camera, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CreatePostPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [backgroundMusic, setBackgroundMusic] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const moods = [
    { id: 'golden', label: '🌅 Golden Hour', color: 'from-yellow-400 to-orange-500' },
    { id: 'dreamy', label: '💫 Dreamy', color: 'from-purple-400 to-pink-400' },
    { id: 'chill', label: '🧘 Chill Vibes', color: 'from-blue-400 to-cyan-400' },
    { id: 'creative', label: '🎨 Creative Flow', color: 'from-green-400 to-blue-500' },
    { id: 'energetic', label: '⚡ Energetic', color: 'from-red-400 to-yellow-500' },
    { id: 'minimal', label: '🔘 Minimal', color: 'from-gray-400 to-gray-600' },
    { id: 'nature', label: '🌿 Nature', color: 'from-green-500 to-emerald-600' },
    { id: 'midnight', label: '🌙 Midnight', color: 'from-indigo-500 to-purple-600' },
  ]

  const filters = [
    { id: 'none', label: 'Original' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'noir', label: 'Noir' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'bright', label: 'Bright' },
    { id: 'contrast', label: 'Contrast' },
    { id: 'fade', label: 'Fade' },
  ]

  const musicTracks = [
    { id: 'chill-beats', label: 'Chill Beats', duration: '2:34' },
    { id: 'ambient-dreams', label: 'Ambient Dreams', duration: '3:12' },
    { id: 'lo-fi-vibes', label: 'Lo-Fi Vibes', duration: '2:45' },
    { id: 'nature-sounds', label: 'Nature Sounds', duration: '4:20' },
    { id: 'synth-wave', label: 'Synth Wave', duration: '3:45' },
  ]

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedFile({
          file,
          preview: e.target.result,
          type: file.type.startsWith('video/') ? 'video' : 'image'
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePost = async () => {
    if (!selectedFile || !caption.trim()) {
      toast.error('Please add content and caption')
      return
    }

    setIsPosting(true)
    
    try {
      // Simulate post creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Post shared successfully! ✨')
      navigate('/home')
    } catch (error) {
      toast.error('Failed to share post')
    } finally {
      setIsPosting(false)
    }
  }

  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'vintage':
        return 'sepia(0.8) contrast(1.2) brightness(1.1)'
      case 'noir':
        return 'grayscale(1) contrast(1.5)'
      case 'warm':
        return 'hue-rotate(15deg) saturate(1.2)'
      case 'cool':
        return 'hue-rotate(-15deg) saturate(1.1) brightness(1.1)'
      case 'bright':
        return 'brightness(1.3) contrast(1.1)'
      case 'contrast':
        return 'contrast(1.5) saturate(1.2)'
      case 'fade':
        return 'brightness(1.1) contrast(0.8) saturate(0.9)'
      default:
        return 'none'
    }
  }

  return (
    <div className="pt-20 pb-20 max-w-lg mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text mb-2">Create Post</h1>
          <p className="text-gray-400">Share your vibe with the world</p>
        </div>

        {/* File Upload Area */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-dark rounded-2xl overflow-hidden"
        >
          {selectedFile ? (
            <div className="relative">
              {selectedFile.type === 'video' ? (
                <video
                  src={selectedFile.preview}
                  className="w-full aspect-square object-cover"
                  style={{ filter: getFilterStyle(selectedFilter) }}
                  controls
                />
              ) : (
                <img
                  src={selectedFile.preview}
                  alt="Selected"
                  className="w-full aspect-square object-cover"
                  style={{ filter: getFilterStyle(selectedFilter) }}
                />
              )}
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center cursor-pointer group hover:bg-white/5 transition-colors"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload size={28} className="text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Add Photo or Video</h3>
              <p className="text-gray-400 text-sm text-center">
                Tap here to select from your library
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center text-gray-400">
                  <Camera size={18} className="mr-1" />
                  <span className="text-sm">Photo</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Video size={18} className="mr-1" />
                  <span className="text-sm">Video</span>
                </div>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </motion.div>

        {/* Filters */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Palette className="mr-2" size={20} />
              Filters
            </h3>
            <div className="flex overflow-x-auto space-x-3 pb-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                      : 'glass text-gray-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mood Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Type className="mr-2" size={20} />
            Choose Your Mood
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-4 rounded-xl transition-all ${
                  selectedMood === mood.id
                    ? `bg-gradient-to-r ${mood.color} text-white`
                    : 'glass-dark text-gray-300 hover:text-white'
                }`}
              >
                <span className="font-medium">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Background Music */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Music className="mr-2" size={20} />
            Background Music (Optional)
          </h3>
          <div className="space-y-2">
            {musicTracks.map((track) => (
              <motion.button
                key={track.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBackgroundMusic(track.id)}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                  backgroundMusic === track.id
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50'
                    : 'glass-dark hover:bg-white/5'
                }`}
              >
                <span className="text-white font-medium">{track.label}</span>
                <span className="text-gray-400 text-sm">{track.duration}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">Caption</h3>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share your thoughts, tag friends, or add hashtags..."
            className="w-full h-32 p-4 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all resize-none"
            maxLength={500}
          />
          <div className="text-right">
            <span className="text-gray-400 text-sm">{caption.length}/500</span>
          </div>
        </motion.div>

        {/* Post Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePost}
          disabled={isPosting || !selectedFile || !caption.trim()}
          className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-neon-purple hover:to-neon-pink transition-all"
        >
          {isPosting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sharing...
            </div>
          ) : (
            'Share Post'
          )}
        </motion.button>
      </motion.div>
    </div>
  )
} 