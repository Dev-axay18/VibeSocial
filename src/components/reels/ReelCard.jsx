import { useState } from "react";
import { Heart, HeartFilled, Bookmark, BookmarkCheck } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const ReelCard = ({ username, profilePic, videoSrc }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <video src={videoSrc} autoPlay loop muted className="object-cover w-full h-full absolute z-0" />

      {/* Gradient Overlay Bottom */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
        <div className="flex items-center gap-3 mb-2">
          <img src={profilePic} alt="profile" className="w-10 h-10 rounded-full border-2 border-white" />
          <p className="font-semibold text-lg">{username}</p>

          <button
            onClick={() => setFollowing(!following)}
            className="ml-auto text-sm bg-white text-black px-3 py-1 rounded-full font-semibold hover:bg-gray-300 transition"
          >
            {following ? "Vibing" : "+Vibe"}
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Like Button */}
          <motion.div
            whileTap={{ scale: 1.4 }}
            className="cursor-pointer"
            onClick={() => setLiked(!liked)}
          >
            <AnimatePresence>
              {liked ? (
                <motion.div
                  key="liked"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <HeartFilled className="text-pink-600 w-7 h-7" />
                </motion.div>
              ) : (
                <Heart className="text-white w-7 h-7" />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Save Button */}
          <motion.div
            whileTap={{ scale: 1.2 }}
            className="cursor-pointer"
            onClick={() => setSaved(!saved)}
          >
            <AnimatePresence>
              {saved ? (
                <motion.div
                  key="saved"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <BookmarkCheck className="text-yellow-400 w-7 h-7" />
                </motion.div>
              ) : (
                <Bookmark className="text-white w-7 h-7" />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
