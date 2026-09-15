import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Calendar,
  Clock,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { BlogPost } from '../../../types';

export const AdminBlogsTab: React.FC = () => {
  const { blogs, addBlogPost, updateBlogPost, deleteBlogPost } = useStore();

  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.content) {
      alert('Please provide article title and content');
      return;
    }

    try {
      if (editingBlog.id) {
        await updateBlogPost(editingBlog.id, editingBlog);
      } else {
        await addBlogPost({
          title: editingBlog.title,
          excerpt: editingBlog.excerpt || '',
          content: editingBlog.content,
          category: editingBlog.category || 'Gifting Etiquette',
          readTime: editingBlog.readTime || '4 min read',
          imageUrl:
            editingBlog.imageUrl ||
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=900&auto=format&fit=crop',
          date:
            editingBlog.date ||
            new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
        });
      }
      setEditingBlog(null);
    } catch (err: any) {
      alert('Failed to save journal post: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1ece4]">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1b3022]">
            Gifting Journal & Articles ({blogs.length})
          </h2>
          <p className="text-xs text-stone-500">
            Publish educational luxury gift guides, perfume notes, anniversary recommendations, and wedding etiquette.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingBlog({
              title: '',
              excerpt: '',
              content: '',
              category: 'Gifting Etiquette',
              readTime: '4 min read',
              imageUrl: '',
            })
          }
          className="px-3.5 py-2 bg-[#1b3022] text-[#f7e7ce] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#25422f] shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* MODAL / EDITOR */}
      {editingBlog && (
        <form
          onSubmit={handleSaveBlog}
          className="p-5 bg-[#faf8f5] rounded-2xl border border-[#d4af37]/40 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h4 className="font-bold text-xs text-[#1b3022] uppercase tracking-wider">
              {editingBlog.id ? 'Edit Journal Article' : 'Compose New Journal Article'}
            </h4>
            <button
              type="button"
              onClick={() => setEditingBlog(null)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={editingBlog.title || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                placeholder="e.g. The Art of Luxury Fragrance Layering: An Oriental Guide"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1b3022]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <input
                type="text"
                value={editingBlog.category || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                placeholder="e.g. Perfumery, Wedding Gifts, Corporate Gifting"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Read Time Estimate</label>
              <input
                type="text"
                value={editingBlog.readTime || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                placeholder="e.g. 5 min read"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Featured Cover Image URL
              </label>
              <input
                type="url"
                value={editingBlog.imageUrl || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Short Excerpt / Summary</label>
              <textarea
                rows={2}
                value={editingBlog.excerpt || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                placeholder="A brief overview displayed on the journal index card..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Article Body Content *</label>
              <textarea
                rows={6}
                required
                value={editingBlog.content || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                placeholder="Write the full body of the article here..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none font-sans leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setEditingBlog(null)}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold hover:bg-[#25422f]"
            >
              Publish Article
            </button>
          </div>
        </form>
      )}

      {/* BLOGS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-[#1b3022] text-[10px] font-bold shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-stone-400">ID: {post.id}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingBlog(post)}
                  className="p-1.5 text-stone-600 hover:text-[#1b3022] rounded-lg hover:bg-stone-100"
                  title="Edit article"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Delete article "${post.title}"?`)) {
                      await deleteBlogPost(post.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
