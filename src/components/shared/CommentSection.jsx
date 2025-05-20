import React, { useState, useEffect, useRef } from "react";
import { X, Heart, Send, Smile } from "lucide-react";
import clsx from "clsx";


const mockComments = [
  {
    id: 1,
    username: "nature_lover",
    avatar: "https://i.pravatar.cc/40?img=12",
    text: "This view is breathtaking! 😍",
    liked: false,
    likesCount: 14,
    timeAgo: "2h",
  },
  {
    id: 2,
    username: "adventure_seeker",
    avatar: "https://i.pravatar.cc/40?img=8",
    text: "Can't wait to visit this place!",
    liked: false,
    likesCount: 9,
    timeAgo: "1h",
  },
  {
    id: 3,
    username: "wild_explorer",
    avatar: "https://i.pravatar.cc/40?img=24",
    text: "Nature at its finest 🌿",
    liked: false,
    likesCount: 21,
    timeAgo: "30m",
  },
];

const CommentSection = ({ isOpen, onClose }) => {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likesCount: c.liked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c
      )
    );
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newEntry = {
      id: Date.now(),
      username: "you",
      avatar: "https://i.pravatar.cc/40?img=65",
      text: newComment.trim(),
      liked: false,
      likesCount: 0,
      timeAgo: "just now",
    };
    setComments((prev) => [newEntry, ...prev]);
    setNewComment("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md max-h-[80vh] bg-gray-900 rounded-t-3xl p-5 flex flex-col shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-xl">Comments</h2>
          <button
            aria-label="Close comments"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {comments.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              No comments yet. Be the first to comment!
            </p>
          )}
          {comments.map(({ id, username, avatar, text, liked, likesCount, timeAgo }) => (
            <div
              key={id}
              className="flex gap-3 items-start bg-gray-800 rounded-lg p-3"
            >
              <img
                src={avatar}
                alt={`${username}'s avatar`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold hover:underline cursor-pointer">
                      @{username}
                    </span>
                    <span className="text-gray-400 text-xs">{timeAgo}</span>
                  </div>
                  <button
                    aria-label={liked ? "Unlike comment" : "Like comment"}
                    onClick={() => toggleLike(id)}
                    className={clsx(
                      "flex items-center gap-1 text-sm transition-transform duration-200",
                      liked
                        ? "text-red-500 scale-125"
                        : "text-gray-500 hover:text-red-400"
                    )}
                  >
                    <Heart size={16} />
                    {likesCount > 0 && <span>{likesCount}</span>}
                  </button>
                </div>
                <p className="mt-1 text-gray-300 whitespace-pre-wrap">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="mt-4 flex items-center gap-3">
          <textarea
            ref={commentInputRef}
            rows={1}
            className="resize-none flex-1 rounded-md bg-gray-800 text-white p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 scrollbar-thin scrollbar-thumb-gray-700"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleAddComment}
            disabled={newComment.trim() === ""}
            aria-label="Send comment"
            className={clsx(
              "p-2 rounded-full transition-colors",
              newComment.trim() === ""
                ? "text-gray-600 cursor-not-allowed"
                : "text-violet-500 hover:bg-violet-700 hover:text-white"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
