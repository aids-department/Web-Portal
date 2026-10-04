import React from 'react';
import { ArrowUp, MessageCircle, Share2 } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';

const PostCard = ({ post, onOpen, onUpvote }) => {
  return (
    <SpotlightCard interactive>
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-fg">{post.title}</h3>
          <span className="text-[13px] text-fg-muted">
            {post.isAnonymous ? 'Anonymous' : post.author}
          </span>
        </div>

        <p className="mb-4 text-[14px] leading-relaxed text-fg-muted">{post.content}</p>

        {post.media && post.media.length > 0 && (
          <div className="my-4 grid grid-cols-2 gap-3">
            {post.media.map((m, i) =>
              m.type === 'image' ?
                <img key={i} src={m.preview} alt="" className="max-h-64 rounded-xl border border-line object-cover" /> :
                <video key={i} src={m.preview} controls className="w-full rounded-xl border border-line" />
            )}
          </div>
        )}

        <div className="-ml-2 flex gap-1">
          <button onClick={onUpvote} className="btn-ghost btn-sm">
            <ArrowUp size={16} /> {post.upvotes}
          </button>
          <button onClick={onOpen} className="btn-ghost btn-sm">
            <MessageCircle size={16} /> {post.comments.length}
          </button>
          <button className="btn-ghost btn-sm">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default PostCard;
