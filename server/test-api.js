import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/videos';

if (!PEXELS_API_KEY) {
  console.error('Error: PEXELS_API_KEY is not set in environment variables');
  process.exit(1);
}

console.log('Using API key:', PEXELS_API_KEY.substring(0, 5) + '...');

async function testPexelsAPI() {
  try {
    console.log('Testing Pexels API with key:', PEXELS_API_KEY.substring(0, 5) + '...');
    
    const response = await axios.get(`${PEXELS_API_URL}/popular`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      },
      params: {
        page: 1,
        per_page: 5
      }
    });

    console.log('API Response:', {
      status: response.status,
      totalResults: response.data?.total_results,
      videosCount: response.data?.videos?.length
    });

    console.log('First video:', response.data.videos[0]);
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
}

testPexelsAPI();
