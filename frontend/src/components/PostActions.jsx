// components/PostActions.jsx
// Upvote control and inline action links shared by the posts feed,
// the inline thread view and the /posts/:postId page.
import { ArrowBigUp } from 'lucide-react';

export const UpvoteButton = ({ active, count, onClick, size = 'md' }) => (
  <button
    onClick={onClick}
    title={active ? "Remove upvote" : "Upvote post"}
    aria-pressed={!!active}
    className={`flex flex-col items-center gap-0.5 rounded-lg transition-[background-color,color,box-shadow] duration-200 active:scale-[0.96] ${
      size === 'lg' ? 'px-2.5 py-2' : 'px-2 py-1.5'
    } ${
      active
        ? 'bg-accent/15 text-indigo-200 shadow-[inset_0_0_0_1px_rgba(94,106,210,0.45),0_0_16px_rgba(94,106,210,0.25)]'
        : 'text-fg-muted hover:bg-white/[0.06] hover:text-fg'
    }`}
  >
    <ArrowBigUp size={size === 'lg' ? 22 : 18} strokeWidth={1.75} className={active ? 'fill-current' : ''} />
    <span className={`font-mono font-medium tabular-nums ${size === 'lg' ? 'text-[14px]' : 'text-[12.5px]'}`}>{count}</span>
  </button>
);

export const ActionLink = ({ onClick, children, danger = false, active = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] font-medium transition-colors duration-150 ${
      danger
        ? 'text-fg-muted hover:bg-rose-500/10 hover:text-rose-300'
        : active
        ? 'text-accent-bright hover:bg-white/[0.05]'
        : 'text-fg-muted hover:bg-white/[0.05] hover:text-fg'
    }`}
  >
    {children}
  </button>
);
