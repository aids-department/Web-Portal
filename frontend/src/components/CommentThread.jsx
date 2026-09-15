// components/CommentThread.jsx
// Shared, recursive comment/reply renderer used by both the feed's inline
// thread view and the standalone /posts/:postId page. Consolidates two
// previously-duplicated (and slightly inconsistent) implementations.
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

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
    depth > 0 ? 'border-l-2 border-brand-edge pl-4 ml-2 pt-3.5 pb-3.5' : 'border-b border-brand-row pt-3.5 pb-3.5';

  if (comment.content === '[deleted]') {
    return (
      <div className={`flex flex-col gap-2 ${wrapperClass}`}>
        <p className="m-0 text-[12.5px] italic text-brand-ink-faint">[deleted]</p>
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
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`w-[22px] h-[22px] grid place-items-center text-[9px] font-semibold ${
            comment.isAnonymous ? 'bg-brand-ink-faint text-white' : 'bg-brand-navy text-white'
          }`}
        >
          {initials}
        </span>
        <span className="text-[12.5px] font-medium text-brand-navy">{displayName}</span>
        {comment.createdAt && (
          <span className="text-[11.5px] text-brand-ink-soft">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        )}
        <span className="text-[11.5px] text-brand-ink-soft tabular-nums">
          {comment.upvotes?.length || 0} points
        </span>
        {comment.isEdited && <span className="text-[11px] italic text-brand-ink-faint">(edited)</span>}
      </div>

      <p className="m-0 max-w-[74ch] text-[13.5px] leading-[1.7] text-[#3a3838]">{comment.content}</p>

      <div className="flex gap-3.5 flex-wrap">
        <button
          onClick={() => (depth === 0 ? onUpvoteComment(comment._id) : onUpvoteReply(comment._id))}
          className={`text-[11.5px] font-medium ${hasUpvoted ? 'text-brand-blue' : 'text-brand-ink-soft'}`}
        >
          {hasUpvoted ? 'Upvoted' : 'Upvote'}
        </button>
        {depth === 0 && (
          <button onClick={() => setShowReply((s) => !s)} className="text-[11.5px] font-medium text-brand-blue">
            Reply
          </button>
        )}
        {isOwner && (
          <button
            onClick={() => (depth === 0 ? onDeleteComment(comment._id) : onDeleteReply(comment._id))}
            className="text-[11.5px] font-medium text-brand-red"
          >
            Delete
          </button>
        )}
      </div>

      {showReply && (
        <form onSubmit={handleReply} className="flex flex-col gap-2 max-w-[520px]">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="border border-brand-ink-faint px-3 py-2 text-[12.5px] text-brand-ink outline-none focus:border-brand-navy"
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-2">
              {['Public', 'Anonymous'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1.5 text-[11px] font-medium ${
                    mode === m ? 'bg-brand-navy text-white' : 'border border-brand-edge text-brand-ink-soft'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button type="submit" className="px-3.5 py-2 bg-brand-navy text-white text-[11.5px] font-semibold">
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
