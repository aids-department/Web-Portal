import React, { useState } from 'react';

const CommentForm = ({ onSubmit, placeholder }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
        Send
      </button>
    </form>
  );
};

export default CommentForm;