// frontend/src/components/CommentSidebar.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

const CommentSidebar = ({ post, onClose, onAddComment, onAddReply, onUpvoteComment }) => {
  const [mode, setMode] = useState('Public');

  const handleNewComment = (text) => {
    const comment = {
      id: Date.now(),
      content: text,
      author: mode === 'Anonymous' ? 'Anonymous' : 'You',
      isAnonymous: mode === 'Anonymous',
      upvotes: 0,
      replies: []
    };
    onAddComment(post.id, comment);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-50">
      <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
        <h2 className="text-2xl font-bold">Comments</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={28} />
        </button>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3">{post.content}</p>
          <p className="text-sm text-gray-500">
            — {post.isAnonymous ? 'Anonymous' : post.author}
          </p>
        </div>

        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setMode('Public')}
            className={`px-5 py-2 rounded-xl font-medium ${mode === 'Public' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
          >
            Public
          </button>
          <button
            onClick={() => setMode('Anonymous')}
            className={`px-5 py-2 rounded-xl font-medium ${mode === 'Anonymous' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
          >
            Anonymous
          </button>
        </div>

        <CommentForm onSubmit={handleNewComment} placeholder="Add a comment..." />

        <div className="mt-8">
          {post.comments.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No comments yet. Be the first!</p>
          ) : (
            post.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                postId={post.id}
                depth={0}
                onAddReply={onAddReply}
                onUpvoteComment={(id) => onUpvoteComment(post.id, id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSidebar;