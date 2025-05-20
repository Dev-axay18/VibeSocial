import React, { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';
import PostCard from '../components/PostCard';

export default function TestHomePage() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simple mock data
  const generateMockPosts = (count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      user: {
        username: `user${i + 1}`,
        fullName: `User ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`
      },
      image: `https://picsum.photos/500/500?random=${i}`,
      mood: `Feeling good`,
      caption: `This is a test post ${i + 1}`,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 10),
      timestamp: 'Just now',
      hasMusic: false,
      isLiked: false
    }));
  };

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStories([
        { id: 1, username: 'test.user', avatar: 'https://i.pravatar.cc/150?img=1', hasStory: true, isViewed: false },
      ]);
      
      setPosts(generateMockPosts(3));
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-r-pink-500 border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="pt-16 pb-20 max-w-md mx-auto px-4">
      {/* Stories */}
      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-3">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                <div className="bg-gray-900 rounded-full p-0.5">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-1">{story.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{post.user.username}</p>
                  <p className="text-xs text-gray-400">{post.mood}</p>
                </div>
              </div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
            
            <img
              src={post.image}
              alt="Post"
              className="w-full rounded-lg mb-3"
            />
            
            <div className="flex items-center space-x-4 mb-2">
              <button 
                onClick={() => handleLike(post.id)}
                className={`${post.isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
            
            <p className="font-medium">{post.likes} likes</p>
            <p><span className="font-medium">{post.user.username}</span> {post.caption}</p>
            <p className="text-sm text-gray-400 mt-1">View all {post.comments} comments</p>
            <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
