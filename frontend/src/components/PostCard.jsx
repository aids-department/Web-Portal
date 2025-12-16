import React from 'react';
import { ArrowUp, MessageCircle, Share2 } from 'lucide-react';

const PostCard = ({ post, onOpen, onUpvote }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
        <span className="text-sm text-gray-500">
          {post.isAnonymous ? 'Anonymous' : post.author}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{post.content}</p>

      {post.media && post.media.length > 0 && (
        <div className="grid grid-cols-2 gap-3 my-4">
          {post.media.map((m, i) => 
            m.type === 'image' ? 
              <img key={i} src={m.preview} alt="" className="rounded-lg max-h-64 object-cover" /> :
              <video key={i} src={m.preview} controls className="rounded-lg w-full" />
          )}
        </div>
      )}

      <div className="flex gap-6 text-gray-600">
        <button onClick={onUpvote} className="flex items-center gap-2 hover:text-blue-600 font-medium">
          <ArrowUp size={20} /> {post.upvotes}
        </button>
        <button onClick={onOpen} className="flex items-center gap-2 hover:text-blue-600 font-medium">
          <MessageCircle size={20} /> {post.comments.length}
        </button>
        <button className="flex items-center gap-2 hover:text-blue-600 font-medium">
          <Share2 size={20} /> Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;