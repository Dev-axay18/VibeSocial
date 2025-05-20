import React, { useEffect, useState, useCallback } from "react";
import {
  Heart,
  Share,
  Eye,
  MessageCircle,
  Bookmark,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import axios from "axios";
import { CommentSection } from "../components/shared";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/videos";

const randomCaptions = [
  "Nature vibes 🌿✨ #peaceful",
  "Lost in the wild 🌲 #adventure",
  "Sunset dreams 🌅 #goldenhour",
  "Catch the breeze 🌬️ #freedom",
  "Mountain magic 🏔️ #explore",
  "Fresh air, fresh mind 💨 #naturelover",
  "Ocean waves 🌊 #serenity",
  "Into the forest 🍃 #wanderlust",
  "Chasing light 🌞 #photography",
  "Calm & quiet 🌙 #nightvibes",
];

const randomUsernames = [
  "wildwanderer",
  "nature_nerd",
  "sunset_seeker",
  "forest.fairy",
  "mountain_mystic",
  "ocean_soul",
  "urban_explorer",
  "sky_chaser",
  "green.guru",
  "moonlight_meadow",
];

// Generate a random int between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a random username + profile image URL from pravatar.cc or unsplash
const generateUserData = () => {
  const idx = randomInt(0, randomUsernames.length - 1);
  return {
    username: randomUsernames[idx],
    profilePic: `https://i.pravatar.cc/48?img=${randomInt(1, 70)}`, // Random avatar image
    caption: randomCaptions[randomInt(0, randomCaptions.length - 1)],
  };
};

const VibeReelsPage = () => {
  const [videos, setVideos] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [followedMap, setFollowedMap] = useState({}); // Track follow per video
  const [userDataMap, setUserDataMap] = useState({}); // Track user data per video ID

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${PEXELS_API_URL}/search?query=nature&per_page=10`,
          {
            headers: { Authorization: PEXELS_API_KEY },
          }
        );
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Generate random user data for each video once videos loaded
  useEffect(() => {
    if (videos.length === 0) return;

    const newUserDataMap = {};
    videos.forEach((video) => {
      newUserDataMap[video.id] = generateUserData();
    });
    setUserDataMap(newUserDataMap);
  }, [videos]);

  // Toggle follow status for a specific video/user
  const toggleFollow = useCallback(
    (videoId) => {
      setFollowedMap((prev) => ({
        ...prev,
        [videoId]: !prev[videoId],
      }));
    },
    [setFollowedMap]
  );

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((video, idx) => {
        const user = userDataMap[video.id] || {};
        const isFollowed = followedMap[video.id];

        return (
          <div
            key={video.id}
            className="h-screen w-full relative snap-start"
            style={{ scrollSnapAlign: "start" }}
          >
            <video
              src={video.video_files[0]?.link}
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
            />

            {/* Bottom-left user info */}
            <div
              className="absolute bottom-6 left-4 z-30 flex items-center gap-4
                bg-black bg-opacity-70 backdrop-blur-md rounded-3xl px-6 py-4
                max-w-xs md:max-w-md animate-fadeIn shadow-lg"
            >
              <img
                src={user.profilePic}
                alt={`${user.username} profile`}
                className="w-14 h-14 rounded-full border-2 border-white shadow-xl flex-shrink-0"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span
                    className="text-white font-extrabold text-xl truncate max-w-[180px]"
                    title={user.username}
                  >
                    @{user.username || "loading..."}
                  </span>
                  <CheckCircle className="text-blue-400 w-5 h-5" />
                </div>
                <p
                  className="text-gray-300 text-base mt-1 max-w-[180px] truncate"
                  title={user.caption}
                >
                  {user.caption}
                </p>

                <button
                  onClick={() => toggleFollow(video.id)}
                  className={`mt-4 flex items-center gap-3 justify-center
                    rounded-full px-5 py-2 text-base font-semibold transition
                    select-none cursor-pointer
                    ${
                      isFollowed
                        ? "bg-white text-black hover:bg-gray-300"
                        : "bg-transparent border border-white text-white hover:bg-white hover:text-black"
                    } shadow-md`}
                  aria-pressed={isFollowed}
                  aria-label={isFollowed ? "Following user" : "Follow user"}
                >
                  <UserPlus
                    className={`w-5 h-5 transition-transform ${
                      isFollowed ? "rotate-45" : "rotate-0"
                    }`}
                  />
                  {isFollowed ? "Following" : "VibeUp"}
                </button>
              </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

            {/* Right side icons */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
              <Heart className="text-white hover:scale-110 transition cursor-pointer shadow-md" />
              <MessageCircle
                className="text-white hover:scale-110 transition cursor-pointer shadow-md"
                onClick={() => setCommentOpen(true)}
              />
              <Share className="text-white hover:scale-110 transition cursor-pointer shadow-md" />
              <Bookmark className="text-white hover:scale-110 transition cursor-pointer shadow-md" />
              <Eye className="text-white shadow-md" />
            </div>
          </div>
        );
      })}

      {/* Comment Popup */}
      <CommentSection isOpen={commentOpen} onClose={() => setCommentOpen(false)} />

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            0% {opacity: 0; transform: translateY(15px);}
            100% {opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default VibeReelsPage;
