import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const usePexelsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReels = useCallback(async (query = '', params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = query ? '/search' : '';
      const response = await axios.get(`/api/reels${endpoint}`, {
        params: {
          per_page: 10,
          query,
          ...params,
        },
      });
      
      // Transform Pexels API response to our format
      const reels = response.data.videos?.map(video => ({
        id: video.id,
        url: video.url,
        user: {
          name: video.user.name,
          url: video.user.url,
          avatar: video.user.picture,
        },
        video_files: video.video_files,
        video_pictures: video.video_pictures,
        duration: video.duration,
        width: video.width,
        height: video.height,
        likes: video.likes || 0,
        comments: video.comments || 0,
        shares: video.shares || 0,
        created_at: video.created_at,
      })) || [];
      
      return reels;
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to fetch reels';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Re-throw to allow handling in the component
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchReels,
  };
};

export default usePexelsApi;
