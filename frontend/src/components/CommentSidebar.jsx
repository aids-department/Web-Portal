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
    <div className="fixed right-0 top-0 z-50 h-full w-96 overflow-y-auto border-l border-line bg-canvas-elevated/95 shadow-popover backdrop-blur-xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas-elevated/90 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Comments</h2>
        <button onClick={onClose} className="btn-icon">
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6 rounded-xl border border-line bg-white/[0.03] p-5">
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-fg">{post.title}</h3>
          <p className="mb-3 text-fg/80">{post.content}</p>
          <p className="text-[13px] text-fg-muted">
            — {post.isAnonymous ? 'Anonymous' : post.author}
          </p>
        </div>

        <div className="tabs mb-5">
          <button
            onClick={() => setMode('Public')}
            className={`tab ${mode === 'Public' ? 'tab-active' : ''}`}
          >
            Public
          </button>
          <button
            onClick={() => setMode('Anonymous')}
            className={`tab ${mode === 'Anonymous' ? 'tab-active' : ''}`}
          >
            Anonymous
          </button>
        </div>

        <CommentForm onSubmit={handleNewComment} placeholder="Add a comment..." />

        <div className="mt-8">
          {post.comments.length === 0 ? (
            <p className="py-12 text-center text-fg-muted">No comments yet. Be the first!</p>
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