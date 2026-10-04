// components/CommentThread.jsx
// Shared, recursive comment/reply renderer used by both the feed's inline
// thread view and the standalone /posts/:postId page. Consolidates two
// previously-duplicated (and slightly inconsistent) implementations.
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowBigUp, Reply, Trash2 } from 'lucide-react';
import { ActionLink } from './PostActions';

export default function CommentThread({
  comment,
  onAddReply,
  onUpvoteComment,
  onDeleteComment,
  onDeleteReply,
  onUpvoteReply,
  currentUser,
  depth = 0,
}) {
  const [showReply, setShowReply] = useState(false);
  const [mode, setMode] = useState('Public');
  const [replyText, setReplyText] = useState('');

  const displayName = comment.isAnonymous ? 'Anonymous' : comment.author?.username || 'Unknown';
  const hasUpvoted = comment.upvotes?.includes(currentUser.id);
  // _id is preserved even for anonymous comments/replies, so the real
  // author can still delete their own anonymous post.
  const isOwner =
    comment.author?._id?.toString() === currentUser.id?.toString() ||
    comment.author?.id?.toString() === currentUser.id?.toString();
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(comment._id, { content: replyText, isAnonymous: mode === 'Anonymous' });
    setReplyText('');
    setShowReply(false);
  };

  const wrapperClass =
    depth > 0
      ? 'ml-3 border-l border-white/10 pl-4 pt-3.5 pb-1 sm:ml-[11px]'
      : 'rounded-xl border border-line bg-white/[0.02] p-4 mb-2 transition-colors hover:border-line-hover';

  if (comment.content === '[deleted]') {
    return (
      <div className={`flex flex-col gap-2 ${wrapperClass}`}>
        <p className="text-[12.5px] italic text-fg-muted/70">[deleted]</p>
        {comment.replies?.map((reply) => (
          <CommentThread
            key={reply._id}
            comment={reply}
            onAddReply={onAddReply}
            onUpvoteComment={onUpvoteReply}
            onDeleteComment={onDeleteReply}
            onDeleteReply={onDeleteReply}
            onUpvoteReply={onUpvoteReply}
            currentUser={currentUser}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${wrapperClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`grid h-[22px] w-[22px] place-items-center rounded-full text-[9px] font-semibold ${
            comment.isAnonymous
              ? 'bg-white/10 text-fg-muted'
              : 'bg-gradient-to-b from-accent/70 to-accent/30 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)]'
          }`}
        >
          {initials}
        </span>
        <span className="text-[13px] font-medium text-fg">{displayName}</span>
        {comment.createdAt && (
          <span className="text-[12px] text-fg-muted">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        )}
        <span className="font-mono text-[11px] tabular-nums text-fg-muted">
          {comment.upvotes?.length || 0} points
        </span>
        {comment.isEdited && <span className="pill-neutral text-[10px]">edited</span>}
      </div>

      <p className="max-w-[74ch] text-[14px] leading-[1.7] text-fg/85">{comment.content}</p>

      <div className="-ml-2 flex flex-wrap gap-1">
        <ActionLink
          onClick={() => (depth === 0 ? onUpvoteComment(comment._id) : onUpvoteReply(comment._id))}
          active={hasUpvoted}
        >
          <ArrowBigUp size={14} className={hasUpvoted ? 'fill-current' : ''} />
          {hasUpvoted ? 'Upvoted' : 'Upvote'}
        </ActionLink>
        {depth === 0 && (
          <ActionLink onClick={() => setShowReply((s) => !s)} active={showReply}>
            <Reply size={13} />
            Reply
          </ActionLink>
        )}
        {isOwner && (
          <ActionLink
            onClick={() => (depth === 0 ? onDeleteComment(comment._id) : onDeleteReply(comment._id))}
            danger
          >
            <Trash2 size={13} />
            Delete
          </ActionLink>
        )}
      </div>

      {showReply && (
        <form onSubmit={handleReply} className="flex max-w-[520px] flex-col gap-2 animate-fade-in">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="field py-2 text-[13px]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="tabs p-0.5">
              {['Public', 'Anonymous'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`tab px-2.5 py-1 text-[12px] ${mode === m ? 'tab-active' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button type="submit" className="btn-primary btn-sm">
              Send
            </button>
          </div>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="flex flex-col">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply._id}
              comment={reply}
              onAddReply={onAddReply}
              onUpvoteComment={onUpvoteReply}
              onDeleteComment={onDeleteReply}
              onDeleteReply={onDeleteReply}
              onUpvoteReply={onUpvoteReply}
              currentUser={currentUser}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
