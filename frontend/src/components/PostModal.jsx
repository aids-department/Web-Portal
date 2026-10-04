import React, { useState } from 'react';
import { X, Upload, XCircle } from 'lucide-react';
import Modal from './ui/Modal';

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
    <Modal z="z-50" className="max-h-screen max-w-2xl overflow-y-auto">
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Create Post</h2>
          <button onClick={onClose} aria-label="Close" className="btn-icon"><X size={20} /></button>
        </div>

        <div className="tabs mb-6">
          <button onClick={() => setMode('Public')} className={`tab ${mode === 'Public' ? 'tab-active' : ''}`}>Public</button>
          <button onClick={() => setMode('Anonymous')} className={`tab ${mode === 'Anonymous' ? 'tab-active' : ''}`}>Anonymous</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="field mb-4 py-3" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" className="field mb-4 h-32 py-3" />

          {media.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3">
              {media.map((m, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg border border-line">
                  {m.type === 'image' ? <img src={m.preview} className="w-full" /> : <video src={m.preview} controls className="w-full" />}
                  <button type="button" onClick={() => removeMedia(i)} aria-label="Remove" className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-canvas/80 text-fg backdrop-blur hover:text-rose-300">
                    <XCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="mb-6 block cursor-pointer rounded-xl border border-dashed border-white/15 p-8 text-center text-fg-muted transition-colors hover:border-line-accent hover:bg-accent/[0.04] hover:text-fg">
            <Upload size={32} className="mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm">Click or drag images/videos</p>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button type="submit" className="btn-primary btn-lg w-full">
            Post
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default PostModal;
