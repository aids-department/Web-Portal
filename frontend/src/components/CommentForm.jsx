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
        className="field flex-1 py-3"
      />
      <button type="submit" className="btn-primary">
        Send
      </button>
    </form>
  );
};

export default CommentForm;