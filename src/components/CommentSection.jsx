import React, { useState, useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { AnimatePresence, motion } from "framer-motion";
import { Pin } from "lucide-react";
import { Heart, CornerDownRight, X, Trash2, Paperclip } from "react-feather";

const stickers = [
  "https://i.imgur.com/1Q9Z1ZP.png",
  "https://i.imgur.com/O3DHIA5.png",
  "https://i.imgur.com/J4F1jlb.png",
];

const initialComments = [
  {
    id: 1,
    user: "alice",
    avatar: "https://i.pravatar.cc/40?img=1",
    comment: "This is an awesome post!",
    liked: false,
    pinned: false,
    replies: [
      {
        id: 11,
        user: "bob",
        avatar: "https://i.pravatar.cc/40?img=2",
        comment: "I agree with you!",
        liked: false,
      },
    ],
  },
  {
    id: 2,
    user: "charlie",
    avatar: "https://i.pravatar.cc/40?img=3",
    comment: "Great content, keep it coming!",
    liked: false,
    pinned: false,
    replies: [],
  },
];

const CommentSection = ({ isOpen, onClose }) => {
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const handlePostComment = (e) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;

    if (replyTo) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyTo
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: Date.now(),
                    user: "akshay_kale",
                    avatar: "https://i.pravatar.cc/40?img=7",
                    comment: trimmed,
                    liked: false,
                  },
                ],
              }
            : c
        )
      );
    } else {
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: "akshay_kale",
          avatar: "https://i.pravatar.cc/40?img=7",
          comment: trimmed,
          liked: false,
          pinned: false,
          replies: [],
        },
      ]);
    }
    setComment("");
    setReplyTo(null);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };
  const toggleLike = (commentId, replyId = null) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          if (replyId) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === replyId ? { ...r, liked: !r.liked } : r
              ),
            };
          } else {
            return { ...c, liked: !c.liked };
          }
        }
        return c;
      })
    );
  };
  const togglePin = (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, pinned: !c.pinned } : c
      )
    );
  };

  const deleteComment = (commentId, replyId = null) => {
    if (replyId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies.filter((r) => r.id !== replyId),
              }
            : c
        )
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };
  const addStickerToComment = (url) => {
    setComment((prev) => prev + ` [sticker:${url}] `);
    inputRef.current?.focus();
  };

  const renderCommentText = (text) => {
    const parts = text.split(/(\[sticker:(https?:\/\/[^\]]+)\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[sticker:")) {
        const url = part.match(/\[sticker:(https?:\/\/[^\]]+)\]/)[1];
        return (
          <img
            key={i}
            src={url}
            alt="sticker"
            className="inline w-6 h-6 mx-0.5"
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };
  const sortedComments = [...comments].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
  useEffect(() => {
    if (!isOpen) {
      setShowEmojiPicker(false);
      setReplyTo(null);
      setComment("");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="comments-title"
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <header className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2
                id="comments-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Comments
              </h2>
              <button
                onClick={onClose}
                aria-label="Close comments"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {sortedComments.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No comments yet. Be the first!
                </p>
              )}

              {sortedComments.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-3">
                      <img
                        src={c.avatar}
                        alt={`@${c.user} avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        @{c.user}
                      </span>
                      {c.pinned && (
                        <Pin
                          size={14}
                          className="text-yellow-500"
                          title="Pinned comment"
                          aria-label="Pinned comment"
                        />
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleLike(c.id)}
                        aria-label={c.liked ? "Unlike" : "Like"}
                        title={c.liked ? "Unlike" : "Like"}
                        className="flex items-center text-gray-500 hover:text-red-500 transition"
                      >
                        <motion.div
                          animate={{ scale: c.liked ? 1.2 : 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        >
                          <Heart
                            size={16}
                            className={c.liked ? "text-red-500" : "text-gray-500"}
                          />
                        </motion.div>
                      </button>

                      <button
                        onClick={() => setReplyTo(c.id)}
                        title="Reply"
                        aria-label={`Reply to @${c.user}`}
                        className="text-gray-500 hover:text-blue-600 transition"
                      >
                        <CornerDownRight size={16} />
                      </button>

                      <button
                        onClick={() => togglePin(c.id)}
                        title={c.pinned ? "Unpin comment" : "Pin comment"}
                        aria-label={c.pinned ? "Unpin comment" : "Pin comment"}
                        className={`text-yellow-500 hover:text-yellow-400 transition ${
                          c.pinned ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        <Pin size={16} />
                      </button>

                      <button
                        onClick={() => deleteComment(c.id)}
                        title="Delete comment"
                        aria-label="Delete comment"
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-800 dark:text-gray-200 mb-2 break-words">
                    {renderCommentText(c.comment)}
                  </p>
                  {c.replies.length > 0 && (
                    <div className="ml-10 border-l border-gray-300 dark:border-gray-600 pl-4 space-y-3">
                      {c.replies.map((r) => (
                        <div key={r.id} className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <img
                                src={r.avatar}
                                alt={`@${r.user} avatar`}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                @{r.user}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleLike(c.id, r.id)}
                                aria-label={r.liked ? "Unlike reply" : "Like reply"}
                                title={r.liked ? "Unlike reply" : "Like reply"}
                                className="flex items-center text-gray-500 hover:text-red-500 transition"
                              >
                                <motion.div
                                  animate={{ scale: r.liked ? 1.2 : 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                  <Heart
                                    size={14}
                                    className={r.liked ? "text-red-500" : "text-gray-500"}
                                  />
                                </motion.div>
                              </button>

                              <button
                                onClick={() => setReplyTo(c.id)}
                                title="Reply"
                                aria-label={`Reply to @${r.user}`}
                                className="text-gray-500 hover:text-blue-600 transition"
                              >
                                <CornerDownRight size={14} />
                              </button>

                              <button
                                onClick={() => deleteComment(c.id, r.id)}
                                title="Delete reply"
                                aria-label="Delete reply"
                                className="text-red-600 hover:text-red-800 transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm break-words">
                            {renderCommentText(r.comment)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-20 left-6 z-50"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      setComment((prev) => prev + emoji.native);
                      setShowEmojiPicker(false);
                      inputRef.current?.focus();
                    }}
                    theme="dark"
                    previewPosition="none"
                    perLine={8}
                    emojiSize={20}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-6 py-2 border-t dark:border-gray-700 flex gap-3 overflow-x-auto bg-gray-100 dark:bg-gray-800">
              {stickers.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="sticker"
                  className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform rounded"
                  onClick={() => addStickerToComment(url)}
                  title="Add sticker"
                />
              ))}
            </div>
            <form
              onSubmit={handlePostComment}
              className="border-t dark:border-gray-700 px-6 py-3 flex items-center gap-3 bg-white dark:bg-gray-900 sticky bottom-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={replyTo ? "Reply to comment..." : "Add a comment..."}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2 text-black dark:text-white outline-none"
                onFocus={() => setShowEmojiPicker(false)}
                aria-label={replyTo ? "Reply input" : "Comment input"}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                title="Emoji Picker"
                aria-label="Toggle emoji picker"
                className="text-2xl"
              >
                😊
              </button>
              <button
                type="submit"
                disabled={!comment.trim()}
                className="bg-blue-600 text-white px-5 py-2 rounded-full disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;
