import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Eye, 
  FileText, 
  Image, 
  Video, 
  Music, 
  File,
  Play,
  Pause
} from 'lucide-react'

export default function FilePreview({ file, isMe = false }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image
    if (type.startsWith('video/')) return Video
    if (type.startsWith('audio/')) return Music
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText
    return File
  }

  const renderFileContent = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative rounded-lg overflow-hidden max-w-xs">
          <img 
            src={file.url} 
            alt={file.name}
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-black/50 rounded-full"
            >
              <Eye size={20} className="text-white" />
            </motion.button>
          </div>
        </div>
      )
    }

    if (file.type.startsWith('video/')) {
      return (
        <div className="relative rounded-lg overflow-hidden max-w-xs">
          <video 
            src={file.url}
            className="w-full h-auto rounded-lg"
            controls
            preload="metadata"
          />
        </div>
      )
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 max-w-xs">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
          >
            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
          </motion.button>
          <div className="flex-1">
            <p className="text-white text-sm font-medium truncate">{file.name}</p>
            <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
          </div>
          <audio src={file.url} />
        </div>
      )
    }

    // Default file preview for documents, etc.
    const FileIcon = getFileIcon(file.type)
    return (
      <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 max-w-xs">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
          <FileIcon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium truncate">{file.name}</p>
          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <Download size={18} />
        </motion.button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${isMe ? 'ml-auto' : 'mr-auto'}`}
    >
      {renderFileContent()}
    </motion.div>
  )
} 