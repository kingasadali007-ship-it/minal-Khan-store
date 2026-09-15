import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Palette,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { HeroBanner, HomepageSectionConfig } from '../../../types';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../../../utils/seedData';

const WALLPAPER_PRESETS = [
  {
    name: 'Atelier Velvet Floral',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Blush Silk & Roses',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Midnight Berry Festive',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Gold Festive Shimmer',
    url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1920&q=80',
  },
];

export const AdminHomepageTab: React.FC = () => {
  const {
    storeSettings,
    updateHomepageSections,
    toggleHomepageSection,
    updateHomepageSectionConfig,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
  } = useStore();

  // --------------------------------------------------------------------------
  // HERO BANNERS MANAGEMENT
  // --------------------------------------------------------------------------
  const [editingBanner, setEditingBanner] = useState<Partial<HeroBanner> | null>(null);
  const banners = storeSettings.heroBanners || [];

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title || !editingBanner?.imageUrl) {
      alert('Please provide banner title and image URL');
      return;
    }

    try {
      if (editingBanner.id) {
        await updateHeroBanner(editingBanner.id, editingBanner);
      } else {
        await addHeroBanner({
          title: editingBanner.title,
          subtitle: editingBanner.subtitle || '',
          imageUrl: editingBanner.imageUrl,
          ctaText: editingBanner.ctaText || 'Shop Collection',
          ctaLink: editingBanner.ctaLink || '/shop',
          badge: editingBanner.badge || 'EXCLUSIVE',
          isActive: editingBanner.isActive !== undefined ? editingBanner.isActive : true,
          order: editingBanner.order || banners.length + 1,
        });
      }
      setEditingBanner(null);
    } catch (err: any) {
      alert('Failed to save banner: ' + err.message);
    }
  };

  // --------------------------------------------------------------------------
  // HOMEPAGE SECTIONS CONFIGURATION
  // --------------------------------------------------------------------------
  const sections: HomepageSectionConfig[] =
    storeSettings.homepageSections?.length
      ? storeSettings.homepageSections
      : DEFAULT_HOMEPAGE_SECTIONS;

  // Sorting
  const sortedSections = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [editingSection, setEditingSection] = useState<HomepageSectionConfig | null>(null);

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const newSections = [...sortedSections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Reassign order numbers
    const updated = newSections.map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));

    await updateHomepageSections(updated);
  };

  const handleSaveSectionConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    await updateHomepageSectionConfig(editingSection.id, editingSection);
    setEditingSection(null);
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#fae4e8]">
        <h2 className="font-display text-xl font-bold text-[#4a1525]">
          Homepage Layout, Wallpapers & Banner Manager
        </h2>
        <p className="text-xs text-stone-500">
          Control the exact layout and visual design of the MINAL KHAN storefront. Reorder sections, customize background wallpapers & overlays, toggle visibility, and update promotional hero banners.
        </p>
      </div>

      {/* 1. HERO SLIDER BANNERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#4a1525]">
              Hero Slider Banners ({banners.length})
            </h3>
            <p className="text-xs text-stone-500">
              High-resolution promotional banners displayed on the top of the homepage.
            </p>
          </div>
          <button
            onClick={() =>
              setEditingBanner({
                title: '',
                subtitle: '',
                imageUrl: '',
                ctaText: 'Explore Gifts',
                ctaLink: '/shop',
                badge: 'MINAL KHAN',
                isActive: true,
                order: banners.length + 1,
              })
            }
            className="px-3.5 py-2 bg-[#4a1525] text-[#fce7eb] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#360f1b] shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hero Banner</span>
          </button>
        </div>

        {/* Modal / Editor for Banner */}
        {editingBanner && (
          <form
            onSubmit={handleSaveBanner}
            className="p-5 bg-[#fff9fa] rounded-2xl border border-[#d4af37]/40 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#fae4e8] pb-3">
              <h4 className="font-bold text-xs text-[#4a1525] uppercase tracking-wider">
                {editingBanner.id ? 'Edit Hero Banner' : 'New Hero Banner'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  Banner Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
                  placeholder="e.g. Exquisite Gifting, Thoughtfully Curated"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  Banner Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  placeholder="Pakistan’s premier atelier for luxury perfumes, couple watches, fine leather wallets..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Image URL (Unsplash or direct URL) *
                </label>
                <input
                  type="url"
                  required
                  value={editingBanner.imageUrl || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, imageUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={editingBanner.badge || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, badge: e.target.value })
                  }
                  placeholder="e.g. LUXURY COLLECTION 2025"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Button Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={editingBanner.ctaText || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, ctaText: e.target.value })
                  }
                  placeholder="e.g. Explore Collection"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Button Target (e.g. /shop, /gift-box, /occasions)
                </label>
                <input
                  type="text"
                  value={editingBanner.ctaLink || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, ctaLink: e.target.value })
                  }
                  placeholder="/shop"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerIsActive"
                  checked={editingBanner.isActive !== false}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, isActive: e.target.checked })
                  }
                  className="rounded text-[#4a1525] focus:ring-[#4a1525]"
                />
                <label htmlFor="bannerIsActive" className="font-semibold text-stone-800">
                  Active (visible on customer homepage slider)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#fae4e8]">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#4a1525] text-[#fce7eb] rounded-xl text-xs font-bold hover:bg-[#360f1b] cursor-pointer"
              >
                Save Hero Banner
              </button>
            </div>
          </form>
        )}

        {/* Banners List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col"
            >
              <div className="relative h-32 bg-stone-100 overflow-hidden">
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.isActive ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                  }`}
                >
                  {b.isActive ? 'Active' : 'Hidden'}
                </span>
                {b.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[#1b3022] text-[10px] font-bold">
                    {b.badge}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{b.title}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{b.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-stone-400">
                    CTA: {b.ctaText} ({b.ctaLink})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingBanner(b)}
                      className="p-1.5 text-stone-600 hover:text-[#1b3022] rounded-lg hover:bg-stone-100"
                      title="Edit banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete banner "${b.title}"?`)) {
                          await deleteHeroBanner(b.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                      title="Delete banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HOMEPAGE SECTIONS REORDER & TOGGLE */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <div>
          <h3 className="font-display text-base font-bold text-[#1b3022]">
            Storefront Section Order & Visibility
          </h3>
          <p className="text-xs text-stone-500">
            Use the arrows to reorder homepage sections. Turn off any section toggle to hide it from customer view.
          </p>
        </div>

        {/* Section Config Modal */}
        {editingSection && (
          <form
            onSubmit={handleSaveSectionConfig}
            className="p-5 sm:p-6 bg-[#fff9fa] rounded-2xl border border-[#d4af37]/50 space-y-5 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-[#fae4e8] pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#4a1525] uppercase tracking-wider">
                  Customize Section: {editingSection.name}
                </h4>
                <p className="text-[11px] text-stone-500">Section ID: {editingSection.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Typography & Text */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs text-[#4a1525] flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5 text-[#c96f86]" />
                <span>Headlines & Copy</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Section Headline Title
                  </label>
                  <input
                    type="text"
                    value={editingSection.title || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Section Eyebrow / Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingSection.badge || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Section Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={editingSection.subtitle || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Action Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSection.ctaText || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, ctaText: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Action Button Target Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSection.ctaLink || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, ctaLink: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                </div>
              </div>
            </div>

            {/* Visual Wallpaper & Background Styling */}
            <div className="space-y-3 pt-3 border-t border-[#fae4e8]">
              <h5 className="font-bold text-xs text-[#4a1525] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Visual Wallpaper & Background Aesthetics</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-stone-700">
                      Background Wallpaper Image URL
                    </label>
                    {editingSection.backgroundImageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSection({
                            ...editingSection,
                            backgroundImageUrl: '',
                          })
                        }
                        className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove Wallpaper
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={editingSection.backgroundImageUrl || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, backgroundImageUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/... or choose preset below"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-stone-400 self-center">Quick presets:</span>
                    {WALLPAPER_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() =>
                          setEditingSection({
                            ...editingSection,
                            backgroundImageUrl: p.url,
                            backgroundOverlayOpacity: editingSection.backgroundOverlayOpacity || 0.85,
                            backgroundOverlayColor: editingSection.backgroundOverlayColor || '#280a13',
                            textColor: 'light',
                          })
                        }
                        className="px-2 py-0.5 bg-white border border-[#f4d5dc] hover:border-[#d4af37] text-[10px] text-[#4a1525] rounded-md transition-colors cursor-pointer"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Overlay Opacity: {Math.round((editingSection.backgroundOverlayOpacity ?? 0.85) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={editingSection.backgroundOverlayOpacity ?? 0.85}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        backgroundOverlayOpacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-[#4a1525] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>0% (Transparent)</span>
                    <span>100% (Solid Tint)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Overlay Tint Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingSection.backgroundOverlayColor || '#280a13'}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          backgroundOverlayColor: e.target.value,
                        })
                      }
                      className="w-9 h-9 p-0.5 bg-white border border-stone-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSection.backgroundOverlayColor || '#280a13'}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          backgroundOverlayColor: e.target.value,
                        })
                      }
                      placeholder="#280a13"
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Background Alignment / Position
                  </label>
                  <select
                    value={editingSection.backgroundPosition || 'center'}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        backgroundPosition: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Text Contrast Override
                  </label>
                  <select
                    value={editingSection.textColor || ''}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        textColor: e.target.value as 'light' | 'dark' | undefined,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="">Auto (Follows Theme & Wallpaper)</option>
                    <option value="light">Light Text (For Dark Wallpapers)</option>
                    <option value="dark">Dark Text (For Cream/Blush Backgrounds)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Bar */}
              {editingSection.backgroundImageUrl && (
                <div className="relative h-20 rounded-xl overflow-hidden border border-stone-300 flex items-center justify-center text-center p-3">
                  <div
                    className="absolute inset-0 bg-cover"
                    style={{
                      backgroundImage: `url(${editingSection.backgroundImageUrl})`,
                      backgroundPosition: editingSection.backgroundPosition || 'center',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: editingSection.backgroundOverlayColor || '#280a13',
                      opacity: editingSection.backgroundOverlayOpacity ?? 0.85,
                    }}
                  />
                  <div className="relative z-10">
                    <span
                      className={`font-display text-sm font-bold ${
                        editingSection.textColor === 'dark' ? 'text-stone-900' : 'text-[#fce7eb]'
                      }`}
                    >
                      {editingSection.title || editingSection.name}
                    </span>
                    <p
                      className={`text-[10px] ${
                        editingSection.textColor === 'dark' ? 'text-stone-700' : 'text-[#fce7eb]/80'
                      }`}
                    >
                      Live background & overlay preview
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#fae4e8]">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#4a1525] text-[#fce7eb] rounded-xl text-xs font-bold hover:bg-[#360f1b] cursor-pointer"
              >
                Save Section Customization
              </button>
            </div>
          </form>
        )}

        {/* Sections List */}
        <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
          {sortedSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                sec.isEnabled === false ? 'bg-stone-50/70 opacity-60' : 'hover:bg-[#fff9fa]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#fce7eb] text-[#4a1525] flex items-center justify-center text-[11px] font-mono font-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-stone-900">{sec.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-500">
                      ID: {sec.id}
                    </span>
                    {sec.backgroundImageUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#fce7eb] text-[#4a1525] font-semibold border border-[#f4d5dc]">
                        <ImageIcon className="w-3 h-3 text-[#c96f86]" />
                        <span>Custom Wallpaper</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {sec.title ? `Title: "${sec.title}"` : 'Default title'}
                    {sec.subtitle ? ` • ${sec.subtitle}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Reorder Buttons */}
                <button
                  onClick={() => moveSection(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move section up"
                >
                  <MoveUp className="w-3.5 h-3.5 text-stone-700" />
                </button>
                <button
                  onClick={() => moveSection(idx, 'down')}
                  disabled={idx === sortedSections.length - 1}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move section down"
                >
                  <MoveDown className="w-3.5 h-3.5 text-stone-700" />
                </button>

                {/* Edit Config */}
                <button
                  onClick={() => setEditingSection(sec)}
                  className="p-1.5 rounded-lg border border-[#f4d5dc] bg-[#fff9fa] hover:bg-[#fce7eb] text-[#4a1525] cursor-pointer"
                  title="Customize title, subtitle & wallpaper"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Visibility */}
                <button
                  onClick={async () => {
                    await toggleHomepageSection(sec.id, sec.isEnabled === false ? true : false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    sec.isEnabled !== false
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                >
                  {sec.isEnabled !== false ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
