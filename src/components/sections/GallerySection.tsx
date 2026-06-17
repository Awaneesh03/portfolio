import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { supabase } from '@/lib/supabase'
import type { GalleryImage } from '@/types'

const FALLBACK_IMAGES: GalleryImage[] = [
  { id: '1', title: 'Hackathon 2025', caption: 'Team project during our first hackathon', category: 'events', image_url: '', order_index: 1, created_at: '' },
  { id: '2', title: 'Coding Session', caption: 'Late night debugging sessions', category: 'work', image_url: '', order_index: 2, created_at: '' },
  { id: '3', title: 'Project Demo', caption: 'Presenting IdeaForge to the panel', category: 'events', image_url: '', order_index: 3, created_at: '' },
  { id: '4', title: 'Campus Life', caption: 'Beautiful campus at Vedam', category: 'campus', image_url: '', order_index: 4, created_at: '' },
  { id: '5', title: 'Team Collaboration', caption: 'Working with amazing teammates', category: 'work', image_url: '', order_index: 5, created_at: '' },
  { id: '6', title: 'Open Source Day', caption: 'Contributing to the community', category: 'events', image_url: '', order_index: 6, created_at: '' },
]

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>(FALLBACK_IMAGES)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('*')
      .order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) setImages(data)
      })
  }, [])

  const categories = ['all', ...Array.from(new Set(images.map((img) => img.category)))]
  const filtered = activeCategory === 'all' ? images : images.filter((img) => img.category === activeCategory)

  const navigate = (dir: 1 | -1) => {
    if (lightbox === null) return
    const newIdx = (lightbox + dir + filtered.length) % filtered.length
    setLightbox(newIdx)
  }

  return (
    <section id="gallery" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Gallery"
          title="Moments & Memories"
          subtitle="A visual journey through my experiences, events, and milestones"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => setLightbox(i)}
            >
              <div className="glass rounded-xl overflow-hidden hover:border-amber-500/30 transition-all">
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-amber-900/20 to-blue-900/20 flex flex-col items-center justify-center p-6 gap-2">
                    <Image size={32} className="text-amber-500/40" />
                    <span className="text-gray-500 text-xs text-center">{img.title}</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-white text-sm font-medium">{img.title}</p>
                  {img.caption && <p className="text-gray-500 text-xs mt-0.5">{img.caption}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(-1) }} className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(1) }} className="absolute right-14 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronRight size={20} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-3xl w-full mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[lightbox]?.image_url ? (
                <img src={filtered[lightbox].image_url} alt={filtered[lightbox].title} className="w-full rounded-xl" />
              ) : (
                <div className="aspect-video glass rounded-xl flex items-center justify-center">
                  <Image size={64} className="text-amber-500/30" />
                </div>
              )}
              <div className="mt-4 text-center">
                <p className="text-white font-medium">{filtered[lightbox]?.title}</p>
                {filtered[lightbox]?.caption && <p className="text-gray-400 text-sm mt-1">{filtered[lightbox].caption}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
