import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BlogPost } from '../types';

interface BlogsPageProps {
  setCurrentView: (view: string) => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ setCurrentView }) => {
  const { blogs } = useStore();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in">
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#1b3022] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#8b7355] text-xs font-bold uppercase tracking-wider">
            <span>{selectedPost.category}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b3022] leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pb-4 border-b border-stone-200">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{selectedPost.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedPost.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedPost.readTime}</span>
            </span>
          </div>
        </div>

        <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-sm">
          <img
            src={selectedPost.imageUrl}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4 text-sm sm:text-base">
          <p className="text-base sm:text-lg font-serif italic text-stone-800 border-l-4 border-[#d4af37] pl-4 py-1">
            "{selectedPost.excerpt}"
          </p>
          <p className="whitespace-pre-line">{selectedPost.content}</p>
        </div>

        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-3 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f]"
          >
            Explore MINAL KHAN Gifts
          </button>
          <button
            onClick={() => setSelectedPost(null)}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Read More Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b7355]">
          The Gifting Journal
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Latest From Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Expert gift guides, luxury packaging stories, fragrance etiquette, and celebrations in Pakistan.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group cursor-pointer bg-white rounded-3xl border border-[#e8dfd3] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#1b3022] shadow-xs">
                {post.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#8b7355] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-[#1b3022] group-hover:text-[#8b7355] transition-colors gap-1">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
