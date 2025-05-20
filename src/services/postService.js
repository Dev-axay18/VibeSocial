import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export const fetchPosts = async (page = 1, perPage = 12) => {
  if (!PEXELS_API_KEY) {
    throw new Error('Pexels API key is not configured');
  }

  try {
    const response = await axios.get(`${PEXELS_API_URL}/curated`, {
      params: {
        per_page: perPage,
        page,
      },
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
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
      comments: Math.floor(Math.random() * 1000),
      isLiked: false,
      isBookmarked: false,
      timestamp: `${Math.floor(Math.random() * 24)}h`,
      user: {
        id: `user-${photo.photographer_id}`,
        username: photo.photographer.toLowerCase().replace(/\s+/g, '').slice(0, 12),
        fullName: photo.photographer,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${photo.photographer}`,
        isVerified: Math.random() > 0.7
      }
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchMoods = async (page = 1, perPage = 12) => {
  return fetchPosts(page, perPage);
};

export const fetchPeoplePosts = async (page = 1, perPage = 12) => {
  return fetchPosts(page, perPage);
};
