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
    <div className={depth > 0 ? "ml-6 mt-4 border-l border-white/10 pl-4" : "mt-6"}>
      <div className="rounded-xl border border-line bg-white/[0.02] p-5">
        <p className="mb-2 font-medium text-fg">{comment.content}</p>

        <div className="mb-4 flex items-center gap-3 text-[13px] text-fg-muted">
          <span>{comment.isAnonymous ? 'Anonymous' : comment.author}</span>
          <span>•</span>
          <span>{comment.upvotes} upvote{comment.upvotes !== 1 ? 's' : ''}</span>
        </div>

        <div className="-ml-2 flex gap-1">
          <button
            onClick={() => onUpvoteComment(comment.id)}
            className="btn-ghost btn-sm"
          >
            <ArrowUp size={15} />
            Upvote
          </button>
          <button
            onClick={() => setShowReply(!showReply)}
            className="btn-ghost btn-sm"
          >
            <MessageSquare size={15} />
            Reply
          </button>
          <button className="btn-ghost btn-sm">
            <Share2 size={15} />
            Share
          </button>
        </div>

        {showReply && (
          <div className="mt-5">
            <div className="tabs mb-3">
              <button onClick={() => setMode('Public')} className={`tab ${mode === 'Public' ? 'tab-active' : ''}`}>
                Public
              </button>
              <button onClick={() => setMode('Anonymous')} className={`tab ${mode === 'Anonymous' ? 'tab-active' : ''}`}>
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