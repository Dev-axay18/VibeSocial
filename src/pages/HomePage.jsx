import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

import StoryCard from '../components/StoryCard'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import CommentSection from '../components/CommentSection'

const adjectives = ['brave', 'cosmic', 'lazy', 'noisy', 'vibing', 'weird', 'happy', 'loopy', 'edgy', 'mellow']
const nouns = ['panda', 'wizard', 'viking', 'owl', 'sloth', 'ninja', 'ghost', 'robot', 'artist', 'alien']
const captions = [
  'This vibe hits different 🔥',
  'Lost in the moment 💭',
  'Just a random day in paradise 🌴',
  'Felt cute might delete later 😎',
  'Late night thoughts 🤯',
  'Aesthetic overload 🌈',
  'No caption needed ✌️',
  'Guess what happened today...',
  'Unfiltered reality 💥',
  'POV: Me just being me'
]
const topics = ['cyberpunk', 'fashion', 'aesthetic', 'colorful', 'streetwear', 'design', 'minimal', 'grunge', 'nature', 'technology', 'music', 'city', 'art', 'food', 'travel', 'sports', 'gaming', 'photography', 'vintage', 'abstract']

const generateRandomUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 1000)
  return `${adj}_${noun}${number}`
}

const generateAvatar = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
const generateCaption = () => captions[Math.floor(Math.random() * captions.length)]

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [activePostId, setActivePostId] = useState(null)

  const observer = useRef()
  const loadingRef = useRef(false)
  const postIdRef = useRef(0)

  // 🔥 Fetch real images from Pexels once
  const fetchImagesFromPexels = async (count = 15) => {
    try {
      const topic = topics[Math.floor(Math.random() * topics.length)]
      const res = await fetch(`https://api.pexels.com/v1/search?query=${topic}&per_page=${count}`, {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY
        }
      })
      const data = await res.json()
      return data.photos.map(photo => photo.src.large)
    } catch (error) {
      console.error('Failed to fetch images:', error)
      return []
    }
  }

  const generatePost = (id = 0, image) => {
    const username = generateRandomUsername()
    return {
      id,
      user: {
        username,
        fullName: username.replace('_', ' '),
        avatar: generateAvatar(username),
      },
      image,
      caption: generateCaption(),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 200),
      timestamp: `${Math.floor(Math.random() * 12 + 1)}h ago`,
      isLiked: false,
      hasMusic: Math.random() > 0.5,
      musicTrack: `Track #${Math.floor(Math.random() * 50 + 1)} 🎶`
    }
  }

  const loadInitialPosts = async () => {
    setLoading(true)
    const images = await fetchImagesFromPexels(10)
    const initialPosts = images.map(img => generatePost(postIdRef.current++, img))
    setPosts(initialPosts)
    setLoading(false)
  }

  const loadMorePosts = async () => {
    if (loadingMore) return
    loadingRef.current = true
    setLoadingMore(true)
    const images = await fetchImagesFromPexels(5)
    const newPosts = images.map(img => generatePost(postIdRef.current++, img))
    setPosts(prev => [...prev, ...newPosts])
    setLoadingMore(false)
    loadingRef.current = false
  }

  const lastPostRef = useCallback(node => {
    if (loadingRef.current) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMorePosts()
      }
    }, { threshold: 1.0 })

    if (node) observer.current.observe(node)
  }, [])

  const handleLike = (postId) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    )
  }

  const openComments = (postId) => {
    setActivePostId(postId)
    setCommentOpen(true)
  }

  const closeComments = () => {
    setActivePostId(null)
    setCommentOpen(false)
  }

  useEffect(() => {
    loadInitialPosts()
  }, [])

  useEffect(() => {
    document.body.style.overflow = commentOpen ? 'hidden' : 'auto'
  }, [commentOpen])

  if (loading) return <LoadingSpinner />

  return (
    <div className="pt-16 pb-20 max-w-md mx-auto px-4 relative">
      <AnimatePresence>
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="relative">
                <PostCard post={post} onLike={handleLike} />
                <button
                  onClick={() => openComments(post.id)}
                  className="absolute bottom-4 right-4 text-white bg-black/50 p-2 rounded-full backdrop-blur"
                >
                  <MessageCircle />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
        </div>
      )}

      <CommentSection isOpen={commentOpen} onClose={closeComments} postId={activePostId} />
    </div>
  )
}
