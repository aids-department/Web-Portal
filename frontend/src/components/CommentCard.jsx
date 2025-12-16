// frontend/src/components/CommentCard.jsx
import React, { useState } from 'react';
import { ArrowUp, MessageSquare, Share2 } from 'lucide-react';
import CommentForm from './CommentForm';

const CommentCard = ({ comment, postId, depth = 0, onAddReply, onUpvoteComment }) => {
  const [showReply, setShowReply] = useState(false);
  const [mode, setMode] = useState('Public');

  const handleReply = (text) => {
    const reply = {
      id: Date.now() + Math.random(),
      content: text,
      author: mode === 'Anonymous' ? 'Anonymous' : 'You',
      isAnonymous: mode === 'Anonymous',
      upvotes: 0,
      replies: []
    };
    onAddReply(postId, comment.id, reply);
    setShowReply(false);
  };

  return (
    <div className={depth > 0 ? "ml-8 mt-5 border-l-2 border-gray-200 pl-4" : "mt-6"}>
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="font-medium text-gray-800 mb-2">{comment.content}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{comment.isAnonymous ? 'Anonymous' : comment.author}</span>
          <span>•</span>
          <span>{comment.upvotes} upvote{comment.upvotes !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex gap-6 text-sm">
          <button
            onClick={() => onUpvoteComment(comment.id)}
            className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowUp size={18} />
            Upvote
          </button>
          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-800 transition"
          >
            <MessageSquare size={18} />
            Reply
          </button>
          <button className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-800 transition">
            <Share2 size={18} />
            Share
          </button>
        </div>

        {showReply && (
          <div className="mt-5">
            <div className="flex gap-2 mb-3">
              <button onClick={() => setMode('Public')} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${mode === 'Public' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}>
                Public
              </button>
              <button onClick={() => setMode('Anonymous')} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${mode === 'Anonymous' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}>
                Anonymous
              </button>
            </div>
            <CommentForm onSubmit={handleReply} placeholder="Write a reply..." />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-5">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                postId={postId}
                depth={depth + 1}
                onAddReply={onAddReply}
                onUpvoteComment={onUpvoteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;