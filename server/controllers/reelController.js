import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/videos';

// @desc    Get random reels
// @route   GET /api/reels
// @access  Public
export const getRandomReels = async (req, res, next) => {
  try {
    const { page = 1, per_page = 10 } = req.query;
    
    // First check if we have a valid API key
    if (!PEXELS_API_KEY) {
      console.error('Pexels API key is not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Pexels API key is not configured. Please check your .env file.'
      });
    }

    console.log('Making request to Pexels API with key:', PEXELS_API_KEY.substring(0, 5) + '...');
    console.log('Request URL:', `${PEXELS_API_URL}/popular?page=${page}&per_page=${per_page}`);

    try {
      const response = await axios.get(`${PEXELS_API_URL}/popular`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        },
        params: {
          page,
          per_page,
          min_duration: 5, // Minimum 5 seconds
          max_duration: 60, // Maximum 60 seconds
          size: 'medium' // To ensure we get reasonable quality
        },
        timeout: 10000 // Set a reasonable timeout
      });

      console.log('Pexels API Response:', {
        status: response.status,
        totalResults: response.data?.total_results,
        videosCount: response.data?.videos?.length
      });

      // Format the response to include only necessary data
      const reels = response.data.videos.map(video => ({
        id: video.id,
        width: video.width,
        height: video.height,
        duration: video.duration,
        image: video.image,
        video_files: video.video_files.map(file => ({
          id: file.id,
          quality: file.quality,
          file_type: file.file_type,
          width: file.width,
          height: file.height,
          link: file.link
        })),
        user: {
          id: video.user.id,
          name: video.user.name,
          url: video.user.url
        }
      }));

      res.json({
        success: true,
        data: reels,
        total: response.data.total_results,
        page: response.data.page,
        per_page: response.data.per_page
      });
    } catch (apiError) {
      console.error('Pexels API Error Details:', {
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message
      });
      
      if (apiError.response?.status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Pexels API key. Please check your API key configuration.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to fetch reels from Pexels API. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred'
    });
  }
};

// @desc    Search reels by query
// @route   GET /api/reels/search
// @access  Public
export const searchReels = async (req, res, next) => {
  try {
    const { query, page = 1, per_page = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query'
      });
    }

    console.log('Making search request to Pexels API with key:', PEXELS_API_KEY.substring(0, 5) + '...');
    console.log('Search Query:', query);

    try {
      const response = await axios.get(`${PEXELS_API_URL}/search`, {
        headers: {
          'Authorization': `Bearer ${PEXELS_API_KEY}`
        },
        params: {
          query,
          page,
          per_page,
          min_duration: 5,
          max_duration: 60,
          size: 'medium'
        },
        timeout: 10000 // Set a reasonable timeout
      });

      console.log('Pexels API Search Response:', {
        status: response.status,
        totalResults: response.data?.total_results,
        videosCount: response.data?.videos?.length
      });

      // Format the response
      const reels = response.data.videos.map(video => ({
        id: video.id,
        width: video.width,
        height: video.height,
        duration: video.duration,
        image: video.image,
        video_files: video.video_files.map(file => ({
          id: file.id,
          quality: file.quality,
          file_type: file.file_type,
          width: file.width,
          height: file.height,
          link: file.link
        })),
        user: {
          id: video.user.id,
          name: video.user.name,
          url: video.user.url
        }
      }));

      res.json({
        success: true,
        data: reels,
        total: response.data.total_results,
        page: response.data.page,
        per_page: response.data.per_page
      });
    } catch (apiError) {
      console.error('Pexels API Search Error Details:', {
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message
      });
      
      if (apiError.response?.status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Pexels API key. Please check your API key configuration.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to search reels from Pexels API. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred'
    });
  }
};
