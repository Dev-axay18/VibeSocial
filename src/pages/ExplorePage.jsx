import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share, Eye } from 'lucide-react';
import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';

const fetchRandomPhotosFromPexels = async (perPage = 20) => {
  if (!PEXELS_API_KEY) {
    console.error('Pexels API key is not configured in environment variables');
    return [];
  }

  try {
    const response = await axios.get(`${PEXELS_API_URL}/curated`, {
      params: {
        per_page: perPage,
        page: Math.floor(Math.random() * 10) + 1
      },
      headers: {
        'Authorization': PEXELS_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return response.data.photos.map(photo => ({
      id: `pexels-${photo.id}`,
      image: photo.src.large2x || photo.src.large || photo.src.medium,
      width: photo.width,
      height: photo.height,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      caption: photo.alt || photo.description || 'Beautiful image from Pexels',
      likes: Math.floor(Math.random() * 10000),
      shares: Math.floor(Math.random() * 5000),
      views: Math.floor(Math.random() * 50000),
      gridSpan: Math.random() > 0.8 ? 'col-span-2 row-span-2' : ''
    }));
  } catch (error) {
    console.error('Error fetching random photos from Pexels:', error.response?.data || error.message);
    return [];
  }
};

const PhotoFeed = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  const loadMorePosts = useCallback(async () => {
    try {
      const newPhotos = await fetchRandomPhotosFromPexels();
      if (newPhotos.length === 0) {
        setHasReachedEnd(true);
        return;
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError("Failed to load more posts. Please try again.");
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasReachedEnd) {
        loadMorePosts();
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasReachedEnd, loadMorePosts]);

  useEffect(() => {
    loadMorePosts();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-600 text-center mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neon-blue text-white rounded-full hover:bg-neon-blue/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[200px] sm:auto-rows-[220px] md:auto-rows-[250px] gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 transition-all ease-in-out duration-300">
      {photos.map(photo => (
        <motion.div 
          key={photo.id} 
          className={`relative rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 ${photo.gridSpan}`}
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src={photo.image} 
            alt={photo.caption} 
            className="w-full h-full object-cover rounded-lg transition-transform duration-500 hover:scale-110" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm transition-opacity duration-300"
          >
            <div className="text-center space-y-2 text-lg sm:text-xl md:text-2xl font-semibold">
              <div className="flex items-center justify-center gap-2"><Heart size={24} /> {photo.likes}</div>
              <div className="flex items-center justify-center gap-2"><Share size={24} /> {photo.shares}</div>
              <div className="flex items-center justify-center gap-2"><Eye size={24} /> {photo.views}</div>
            </div>
          </motion.div>
        </motion.div>
      ))}
      <div ref={observerRef} className="h-10 col-span-full" />
    </div>
  );
};

export default PhotoFeed;
