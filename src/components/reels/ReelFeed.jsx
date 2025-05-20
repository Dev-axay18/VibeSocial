import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Send, MoreHorizontal, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import usePexelsApi from '../../hooks/usePexelsApi';

// Format duration in seconds to MM:SS format
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ReelItem = ({ reel = {}, isActive = false, onVideoClick = () => {} }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const videoRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.8,
    triggerOnce: false,
  });

  // Format numbers for display (e.g., 1500 -> 1.5K)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Update progress bar
  const updateProgress = useCallback(() => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const newProgress = (currentTime / duration) * 100;
    setProgress(isNaN(newProgress) ? 0 : newProgress);
  }, []);

  // Handle video playback
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      progressInterval.current = setInterval(updateProgress, 100);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', () => setIsPlaying(false));
    
    if (isActive && inView) {
      video.play().catch(e => console.error('Error playing video:', e));
    } else {
      video.pause();
      handlePause();
    }
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', () => setIsPlaying(false));
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isActive, inView, updateProgress]);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Error toggling video:', err);
      toast.error('Failed to play video');
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Find the best quality video URL (prefer HD, then SD, then any available)
  const videoUrl = reel.video_files?.reduce((best, current) => {
    if (!best) return current.link;
    if (current.quality === 'hd') return current.link;
    if (best.quality !== 'hd' && current.quality === 'sd') return current.link;
    return best.link || current.link;
  }, reel.video_files[0]) || '';
  
  const formattedDuration = formatDuration(reel.duration || 0);

  return (
    <motion.div 
      ref={ref}
      className="relative h-full w-full flex items-center justify-center bg-black"
      onClick={onVideoClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="relative h-full w-full flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-contain"
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            onError={(e) => {
              console.error('Error loading video:', e);
              toast.error('Failed to load video');
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-900">
            <p className="text-gray-500">Video not available</p>
          </div>
        )}
        
        {/* Video Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div 
            className="h-full bg-blue-500 transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Video Duration */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {formattedDuration}
        </div>
      </div>

      {/* Overlay Controls */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium">{reel.user?.name?.charAt(0) || 'U'}</span>
            </div>
            <span className="font-medium text-sm">{reel.user?.name || 'User'}</span>
          </div>
          <button 
            className="text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
          {/* Like Button */}
          <motion.button 
            className="flex flex-col items-center group"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <motion.div
              animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                size={28} 
                className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-white/90 group-hover:text-white'} mb-1 transition-colors`} 
              />
            </motion.div>
            <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
              {formatNumber(reel.likes || 0)}
            </span>
          </motion.button>

          {/* Comment Button */}
          <motion.button 
            className="flex flex-col items-center group"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle 
              size={28} 
              className="text-white/90 group-hover:text-white mb-1 transition-colors" 
            />
            <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
              {formatNumber(reel.comments || 0)}
            </span>
          </motion.button>

          {/* Share Button */}
          <motion.button 
            className="flex flex-col items-center group"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Send 
              size={28} 
              className="text-white/90 group-hover:text-white mb-1 transition-colors" 
            />
            <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
              {formatNumber(reel.shares || 0)}
            </span>
          </motion.button>

          {/* Volume Toggle */}
          <motion.button 
            className="flex flex-col items-center group"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
          >
            {isMuted ? (
              <VolumeX size={24} className="text-white/90 group-hover:text-white transition-colors" />
            ) : (
              <Volume2 size={24} className="text-white/90 group-hover:text-white transition-colors" />
            )}
          </motion.button>
          
          {/* More Options */}
          <motion.button 
            className="flex flex-col items-center group"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // Add more options functionality here
            }}
          >
            <MoreHorizontal size={24} className="text-white/90 group-hover:text-white transition-colors" />
          </motion.button>
        </div>

        {/* Bottom Caption */}
        <div className="max-w-[80%] mt-auto mb-8">
          <p className="text-sm font-medium line-clamp-2">
            {reel.user?.name || 'User'} • {formattedDuration} • {reel.width || 0}x{reel.height || 0}
          </p>
          {reel.user?.url && (
            <a 
              href={reel.user.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-300 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View on Pexels
            </a>
          )}
        </div>
      </div>

      {/* Play/Pause Button */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isPlaying ? 0 : 1,
          scale: isPlaying ? 0.9 : 1
        }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      >
        <div className={`w-16 h-16 rounded-full ${isPlaying ? 'bg-black/30' : 'bg-black/50'} flex items-center justify-center backdrop-blur-sm transition-all`}>
          {isPlaying ? (
            <Pause size={32} className="text-white" />
          ) : (
            <Play size={32} className="text-white ml-1" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReelFeed = () => {
  const [reels, setReels] = useState([]);
  const [activeReel, setActiveReel] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const { loading, error, fetchReels } = usePexelsApi();

  const loadReels = useCallback(async (pageNum = 1, append = false) => {
    if ((!append && reels.length > 0 && !searchQuery) || !hasMore) return;
    
    try {
      const data = await fetchReels(searchQuery, { 
        page: pageNum,
        per_page: 10
      });
      
      if (data && data.length > 0) {
        setReels(prev => append ? [...prev, ...data] : data);
        setPage(pageNum);
        setHasMore(data.length >= 10);
      } else if (pageNum === 1) {
        setReels([]);
      }
    } catch (err) {
      console.error('Error loading reels:', err);
      if (pageNum === 1) setReels([]);
    }
  }, [fetchReels, hasMore, reels.length, searchQuery]);
  
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setReels([]);
    setPage(1);
    setHasMore(true);
    loadReels(1, false);
  }, [loadReels]);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setReels([]);
    setPage(1);
    setHasMore(true);
    loadReels(1, false);
  }, [loadReels]);

  useEffect(() => {
    loadReels(1, false);
  }, []);

  const loadMoreReels = useCallback(() => {
    if (!loading && hasMore) {
      loadReels(page + 1, true);
    }
  }, [loading, hasMore, page, loadReels]);

  // Add scroll event listener for infinite loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Load more when scrolled to 80% of the container
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMoreReels();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMoreReels]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const windowHeight = container.clientHeight;
    const currentIndex = Math.round(scrollPosition / windowHeight);
    
    if (currentIndex !== activeReel) {
      setActiveReel(currentIndex);
    }
  };

  if (loading && reels.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-300">Loading reels...</p>
      </div>
    );
  }

  if (error && reels.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg max-w-md text-center">
          <p className="font-medium">Failed to load reels</p>
          <p className="text-sm mt-1 text-red-200">{error}</p>
          <button 
            onClick={loadReels}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && reels.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
        <div className="text-center">
          <p className="text-gray-300 text-lg font-medium">No reels found</p>
          <button 
            onClick={() => loadReels(1, false)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Error handling UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Error Loading Reels</h2>
        <p className="text-red-400 mb-4">{error.message || 'Failed to load reels. Please try again later.'}</p>
        <button
          onClick={() => loadReels(1, false)}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 p-4 bg-black/80 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for reels..."
              className="w-full bg-gray-800 text-white pl-10 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {reels.map((reel, index) => (
          <div 
            key={`${reel.id}-${index}`} 
            className="h-screen w-full snap-start relative"
          >
            <ReelItem 
              reel={reel} 
              isActive={index === activeReel}
              onVideoClick={() => setActiveReel(index)}
            />
          </div>
        ))}
        
        {/* Loading indicator at the bottom */}
        {loading && reels.length > 0 && (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* End of feed message */}
        {!hasMore && reels.length > 0 && (
          <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
            You've reached the end
          </div>
        )}
      </div>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && reels.length === 0 && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-white">
                {searchQuery ? 'Searching for reels...' : 'Loading reels...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReelFeed;
