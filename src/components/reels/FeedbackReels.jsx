import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share, MoreVertical, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';

const FeedbackReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingStates, setPlayingStates] = useState({});
  const [mutedStates, setMutedStates] = useState({});
  const videoRefs = useRef({});
  const observer = useRef();
  const containerRef = useRef();

  // Fetch random reels from Pexels API
  const fetchRandomReels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reels', {
        params: {
          per_page: 5, // Fetch 5 random reels for the feedback section
        },
      });
      setReels(response.data);
      
      // Initialize playing and muted states
      const initialPlayingStates = {};
      const initialMutedStates = {};
      response.data.forEach((reel) => {
        initialPlayingStates[reel.id] = false;
        initialMutedStates[reel.id] = true; // Start with muted videos
      });
      setPlayingStates(initialPlayingStates);
      setMutedStates(initialMutedStates);
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial reels
  useEffect(() => {
    fetchRandomReels();
  }, [fetchRandomReels]);

  // Setup intersection observer for auto-play
  useEffect(() => {
    if (reels.length === 0) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const reelId = entry.target.dataset.reelId;
        if (entry.isIntersecting) {
          // Pause all other videos
          Object.keys(playingStates).forEach((id) => {
            if (id !== reelId && videoRefs.current[id]) {
              videoRefs.current[id].pause();
            }
          });
          // Play current video
          if (videoRefs.current[reelId]) {
            videoRefs.current[reelId].play().catch(console.error);
            setPlayingStates((prev) => ({
              ...prev,
              [reelId]: true,
            }));
            setCurrentIndex(reels.findIndex((r) => r.id.toString() === reelId));
          }
        } else if (videoRefs.current[reelId]) {
          videoRefs.current[reelId].pause();
          setPlayingStates((prev) => ({
            ...prev,
            [reelId]: false,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    
    // Observe all reel containers
    reels.forEach((reel) => {
      const element = document.querySelector(`[data-reel-id="${reel.id}"]`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [reels, playingStates]);

  const togglePlay = (reelId) => {
    if (!videoRefs.current[reelId]) return;

    if (playingStates[reelId]) {
      videoRefs.current[reelId].pause();
    } else {
      videoRefs.current[reelId].play().catch(console.error);
    }

    setPlayingStates((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  const toggleMute = (reelId) => {
    if (!videoRefs.current[reelId]) return;

    videoRefs.current[reelId].muted = !mutedStates[reelId];
    setMutedStates((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">Feedback Reels</h2>
      
      <div 
        ref={containerRef}
        className="relative h-[500px] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {reels.map((reel) => (
          <div 
            key={reel.id}
            data-reel-id={reel.id}
            className="relative h-full w-full snap-start bg-black flex items-center justify-center"
          >
            {/* Video Player */}
            <video
              ref={(el) => (videoRefs.current[reel.id] = el)}
              src={reel.video_files?.[0]?.link || ''}
              className="h-full w-full object-cover"
              loop
              muted={mutedStates[reel.id]}
              onClick={() => togglePlay(reel.id)}
              playsInline
            />

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-white">
                <h3 className="font-bold">{reel.user?.name || 'User'}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {reel.user?.url || 'Check out this amazing content!'}
                </p>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="absolute right-2 bottom-20 flex flex-col space-y-4">
              {/* Like Button */}
              <button className="flex flex-col items-center text-white">
                <Heart size={24} className="mb-1" />
                <span className="text-xs">
                  {reel.likes || 0}
                </span>
              </button>

              {/* Comment Button */}
              <button className="flex flex-col items-center text-white">
                <MessageCircle size={24} className="mb-1" />
                <span className="text-xs">
                  {reel.comments || 0}
                </span>
              </button>


              {/* Share Button */}
              <button className="flex flex-col items-center text-white">
                <Share size={24} className="mb-1" />
                <span className="text-xs">Share</span>
              </button>

              {/* Mute/Unmute Button */}
              <button 
                onClick={() => toggleMute(reel.id)}
                className="flex flex-col items-center text-white"
              >
                {mutedStates[reel.id] ? (
                  <VolumeX size={24} className="mb-1" />
                ) : (
                  <Volume2 size={24} className="mb-1" />
                )}
              </button>
            </div>

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => togglePlay(reel.id)}
                className={`p-4 bg-black/50 rounded-full transition-opacity ${
                  playingStates[reel.id] ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                }`}
              >
                {playingStates[reel.id] ? (
                  <Pause size={48} className="text-white" />
                ) : (
                  <Play size={48} className="text-white" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackReels;
