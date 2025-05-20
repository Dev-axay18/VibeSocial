import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image, 
  FileText, 
  Video, 
  Music, 
  File,
  X,
  Camera,
  Mic
} from 'lucide-react'

export default function FileAttachment({ isOpen, onClose, onFileSelect }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const attachmentOptions = [
    { 
      type: 'image', 
      label: 'Photo', 
      icon: Image, 
      accept: 'image/*',
      color: 'from-pink-500 to-red-500'
    },
    { 
      type: 'video', 
      label: 'Video', 
      icon: Video, 
      accept: 'video/*',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      type: 'document', 
      label: 'Document', 
      icon: FileText, 
      accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      type: 'audio', 
      label: 'Audio', 
      icon: Music, 
      accept: 'audio/*',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      type: 'camera', 
      label: 'Camera', 
      icon: Camera, 
      accept: 'image/*',
      capture: 'environment',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      type: 'any', 
      label: 'File', 
      icon: File, 
      accept: '*/*',
      color: 'from-gray-500 to-slate-500'
    }
  ]

  const handleFileSelection = (accept, capture = false) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    if (capture) input.capture = 'environment'
    input.multiple = true
    
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        const fileData = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          timestamp: new Date().toISOString()
        }
        onFileSelect(fileData)
      })
      onClose()
    }
    
    input.click()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => {
      const fileData = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        timestamp: new Date().toISOString()
      }
      onFileSelect(fileData)
    })
    onClose()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="absolute bottom-full left-0 mb-2 glass-dark rounded-2xl p-6 w-80 z-50 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Share Attachment</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 glass rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Attachment Options */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {attachmentOptions.map((option) => {
            const Icon = option.icon
            return (
              <motion.button
                key={option.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFileSelection(option.accept, option.capture)}
                className="flex flex-col items-center p-4 glass rounded-xl hover:bg-white/5 transition-all group"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">{option.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Drag & Drop Area */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging 
              ? 'border-neon-blue bg-neon-blue/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <Upload size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-white text-sm mb-1">Drop files here</p>
          <p className="text-gray-400 text-xs">or click to browse</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 