import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Camera, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function EditProfile({ isOpen, onClose }) {
  const { currentUser, setCurrentUser } = useAuth()
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || 'John Doe',
    username: currentUser?.username || 'john.vibe',
    email: currentUser?.email || 'john@example.com',
    phone: currentUser?.phone || '+1 234 567 8900',
    bio: currentUser?.bio || 'Living my best life ✨ | Spreading good vibes 🌟',
    website: currentUser?.website || 'https://johnvibe.com',
    location: currentUser?.location || 'New York, USA',
    avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  })

  const [isPrivate, setIsPrivate] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, avatar: previewUrl }))

      // In a real app, you would upload to your server/cloud storage here
      // For demo purposes, we'll simulate an upload
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate getting back a permanent URL
      const uploadedUrl = previewUrl // In real app, this would be the uploaded file URL
      setFormData(prev => ({ ...prev, avatar: uploadedUrl }))
      
      console.log('File uploaded successfully:', file.name)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
      // Revert on error
      setFormData(prev => ({ ...prev, avatar: currentUser?.avatar || '' }))
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Validate password if changed
    if (password && password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // Save the profile
    const profileData = {
      ...formData,
      isPrivate,
      ...(password && { password })
    }

    setCurrentUser(profileData)
    localStorage.setItem('currentUser', JSON.stringify(profileData))
    toast.success('Profile updated successfully!')
    onClose()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Profile Picture Upload */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 p-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white shadow-lg"
                >
                  <Camera size={20} />
                </motion.button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <p className="text-gray-400 text-sm mt-2">Click the camera icon to upload a new photo</p>
              <p className="text-gray-500 text-xs">Max 5MB • JPG, PNG, GIF</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full pl-8 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all resize-none"
                  rows={3}
                  maxLength={150}
                  placeholder="Tell people about yourself..."
                />
                <p className="text-gray-500 text-xs mt-1">{formData.bio.length}/150</p>
              </div>

              {/* Website */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                  placeholder="City, Country"
                />
              </div>

              {/* Privacy Settings */}
              <div className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center space-x-3">
                  <Lock className="text-gray-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Private Account</p>
                    <p className="text-gray-400 text-sm">Only approved followers can see your posts</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    isPrivate ? 'bg-neon-blue' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: isPrivate ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full"
                  />
                </motion.button>
              </div>

              {/* Password Change */}
              <div className="space-y-3">
                <h3 className="text-white font-medium">Change Password</h3>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex space-x-3">
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
              className="flex-1 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-medium hover:from-neon-purple hover:to-neon-pink transition-all"
            >
              Save Changes
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 