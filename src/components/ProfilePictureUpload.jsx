import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Crop, Check, X, RotateCw } from 'lucide-react'

export default function ProfilePictureUpload({ currentImage, onImageChange, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(currentImage)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(file)
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  } 

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSave = async () => {
    if (!selectedImage) return
    
    setUploading(true)
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would upload to your server/cloud storage here
      onImageChange(previewUrl)
      onClose()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-dark rounded-3xl p-6 w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Update Profile Picture</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Current/Preview Image */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <motion.img
                src={previewUrl}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                whileHover={{ scale: 1.05 }}
              />
              <motion.div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.05 }}
              >
                <Camera size={24} className="text-white" />
              </motion.div>
            </div>
          </div>

          {/* Upload Area */}
          <motion.div
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDragging
                ? 'border-neon-blue bg-neon-blue/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              className="text-center"
            >
              <Upload size={40} className="mx-auto mb-4 text-gray-400" />
              <p className="text-white mb-2">Drop your image here</p>
              <p className="text-gray-400 text-sm mb-4">or</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-medium hover:from-neon-purple hover:to-neon-pink transition-all"
              >
                Choose File
              </motion.button>
            </motion.div>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-3 glass rounded-xl text-white font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!selectedImage || uploading}
              className="flex-1 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-medium hover:from-neon-purple hover:to-neon-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check size={18} className="mr-2" />
                  Save
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 