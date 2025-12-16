import React, { useState } from 'react';
import { X, Upload, XCircle } from 'lucide-react';

const PostModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('Public');
  const [media, setMedia] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(f => ({
      preview: URL.createObjectURL(f),
      type: f.type.startsWith('image') ? 'image' : 'video'
    }));
    setMedia([...media, ...newMedia]);
  };

  const removeMedia = (i) => setMedia(media.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: Date.now(),
      title,
      content,
      author: mode === 'Anonymous' ? 'Anonymous' : 'CurrentUser',
      isAnonymous: mode === 'Anonymous',
      upvotes: 0,
      comments: [],
      media
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Post</h2>
          <button onClick={onClose}><X size={28} /></button>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setMode('Public')} className={`px-4 py-2 rounded-xl ${mode === 'Public' ? 'bg-blue-900 text-white' : 'bg-gray-100'}`}>Public</button>
          <button onClick={() => setMode('Anonymous')} className={`px-4 py-2 rounded-xl ${mode === 'Anonymous' ? 'bg-blue-900 text-white' : 'bg-gray-100'}`}>Anonymous</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 border rounded-xl mb-4" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" className="w-full px-4 py-3 border rounded-xl h-32 mb-4" />

          {media.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {media.map((m, i) => (
                <div key={i} className="relative">
                  {m.type === 'image' ? <img src={m.preview} className="rounded-lg" /> : <video src={m.preview} controls className="rounded-lg" />}
                  <button type="button" onClick={() => removeMedia(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                    <XCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer mb-6">
            <Upload size={40} className="mx-auto mb-2 text-gray-400" />
            <p>Click or drag images/videos</p>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;