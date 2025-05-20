import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

const CommentModal = ({ isOpen, onClose, postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'user1', text: 'This is a sample comment!', time: '2h ago' },
    { id: 2, user: 'user2', text: 'Nice post!', time: '1h ago' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: 'currentUser',
        text: comment,
        time: 'Just now'
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div 
              className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comments</h3>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length > 0 ? (
                  comments.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                      <div>
                        <div className="bg-gray-800 rounded-2xl px-4 py-2">
                          <p className="font-semibold text-sm">@{item.user}</p>
                          <p className="text-sm">{item.text}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-2">{item.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No comments yet</p>
                )}
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    disabled={!comment.trim()}
                    className="p-2 text-blue-500 disabled:text-gray-600"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentModal;
