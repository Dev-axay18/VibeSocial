import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Settings, Share, MoreVertical, Grid, Heart, MessageCircle, Camera } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import EditProfile from '../components/EditProfile'
import FollowersModal from '../components/FollowersModal'
import ProfilePictureUpload from '../components/ProfilePictureUpload'

export default function ProfilePage() {
  const { id } = useParams()
  const { currentUser, setCurrentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [followersModalType, setFollowersModalType] = useState('followers')
  const [showPictureUpload, setShowPictureUpload] = useState(false)

  const isOwnProfile = id === 'me' || id === currentUser?.id

  useEffect(() => {
    const loadProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isOwnProfile) {
        setProfile(currentUser)
      } else {
        setProfile({
          id: id,
          username: 'jane.aesthetic',
          fullName: 'Jane Doe',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
          bio: '🌸 Aesthetic vibes only ✨\n📍 Based in NYC\n💫 Spreading good energy',
          followers: 2400,
          following: 892,
          posts: 156,
          website: 'jane-art.com',
          isVerified: true
        })
      }

      setPosts([
        { id: 1, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80', likes: 234, comments: 12 },
        { id: 2, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', likes: 189, comments: 8 },
        { id: 3, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', likes: 156, comments: 15 },
        { id: 4, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', likes: 298, comments: 23 },
        { id: 5, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', likes: 167, comments: 9 },
        { id: 6, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', likes: 203, comments: 18 },
      ])
      
      setLoading(false)
    }

    loadProfile()
  }, [id, currentUser, isOwnProfile])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // Update followers count
    setProfile(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    }))
  }

  const handleShowFollowers = (type) => {
    setFollowersModalType(type)
    setShowFollowersModal(true)
  }

  const handlePictureUpdate = (newImageUrl) => {
    const updatedProfile = { ...profile, avatar: newImageUrl }
    setProfile(updatedProfile)
    
    if (isOwnProfile) {
      setCurrentUser(updatedProfile)
      localStorage.setItem('currentUser', JSON.stringify(updatedProfile))
    }
  }

  const handleSaveProfile = (profileData) => {
    console.log('Saving profile:', profileData)
    // In a real app, you would send this to your backend
    // Update the user state with new data
    alert('Profile updated successfully!')
  }

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${profile.username}`
    const shareText = `Check out ${profile.fullName}'s profile on VibeSocial!`
    
    try {
      // Try using the Web Share API if available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: `${profile.fullName} - VibeSocial`,
          text: shareText,
          url: profileUrl
        })
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(profileUrl)
        alert('Profile link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Manual fallback
      const textArea = document.createElement('textarea')
      textArea.value = profileUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Profile link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-20 pb-16 md:pb-20 max-w-sm sm:max-w-md md:max-w-2xl mx-auto px-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        {/* Avatar */}
        <div className="relative inline-block mb-4 sm:mb-6">
          <div className="story-gradient p-1 rounded-full">
            <img
              src={profile?.avatar}
              alt={profile?.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-900"
            />
          </div>
          
          {/* Camera button for own profile */}
          {isOwnProfile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPictureUpload(true)}
              className="absolute bottom-0 right-0 p-2 sm:p-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-white shadow-lg"
            >
              <Camera size={16} className="sm:w-5 sm:h-5" />
            </motion.button>
          )}
          
          {profile?.isVerified && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm">✓</span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{profile?.fullName}</h1>
        <p className="text-gray-400 mb-1">@{profile?.username}</p>
        
        {/* Bio */}
        <div className="max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
          <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {profile?.bio}
          </p>
          {profile?.website && (
            <a href={`https://${profile.website}`} className="text-neon-blue hover:text-neon-purple transition-colors text-sm">
              {profile.website}
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-6 sm:space-x-8 mb-4 sm:mb-6">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-white">{profile?.posts}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Posts</div>
          </div>
          <motion.div 
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleShowFollowers('followers')}
          >
            <div className="text-lg sm:text-xl font-bold text-white">
              {profile?.followers?.toLocaleString()}
            </div>
            <div className="text-gray-400 text-xs sm:text-sm">Followers</div>
          </motion.div>
          <motion.div 
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleShowFollowers('following')}
          >
            <div className="text-lg sm:text-xl font-bold text-white">{profile?.following}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Following</div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {isOwnProfile ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEditProfile(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 glass rounded-full text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center"
              >
                <Settings size={16} className="mr-2" />
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareProfile}
                className="p-3 glass rounded-full text-white hover:bg-white/10 transition-all mx-auto sm:mx-0"
              >
                <Share size={18} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFollow}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-full font-medium transition-all ${
                  isFollowing
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-pink'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 glass rounded-full text-white font-medium hover:bg-white/10 transition-all"
              >
                Message
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 glass rounded-full text-white hover:bg-white/10 transition-all mx-auto sm:mx-0"
              >
                <MoreVertical size={18} />
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="glass rounded-full p-1 w-full sm:w-auto">
          <div className="flex">
            {[
              { id: 'posts', label: 'Posts', icon: Grid },
              { id: 'liked', label: 'Liked', icon: Heart },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-full transition-all flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="profile-tab-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full -z-10"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-3 gap-1 sm:gap-2"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
          >
            <img
              src={post.image}
              alt={`Post ${post.id}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center">
                  <Heart size={16} className="mr-1" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle size={16} className="mr-1" />
                  <span className="text-sm">{post.comments}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modals */}
      <EditProfile 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
        currentUser={profile}
        onSave={handleSaveProfile}
      />
      
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        type={followersModalType}
        userId={profile?.id}
      />
      
      {showPictureUpload && (
        <ProfilePictureUpload
          currentImage={profile?.avatar}
          onImageChange={handlePictureUpdate}
          onClose={() => setShowPictureUpload(false)}
        />
      )}
    </div>
  )
} 