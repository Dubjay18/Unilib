import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { X, Sparkle, Barcode, MapPin, Calendar, FileText } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export const NewBookModal: React.FC = () => {
  const { isNewBookModalOpen, setIsNewBookModalOpen, addCatalogueBook, isAddingCatalogueBook } = useLibrary()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('Computer Science')
  const [floor, setFloor] = useState('Floor 2')
  const [shelf, setShelf] = useState('')
  const [published, setPublished] = useState('')
  const [isbn, setIsbn] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [description, setDescription] = useState('')

  if (!isNewBookModalOpen) return null

  const handleAutoFill = () => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    setTitle(`Introduction to Quantum Networks v${randomSuffix}`)
    setSubtitle('Core architectural principles for qubits and quantum routing')
    setAuthor('Prof. Angela Okoye')
    setCategory('Science & Math')
    setFloor('Floor 3')
    setShelf('PHYS-309')
    setPublished('2026 (Oxford Academic)')
    setIsbn(`978-${Math.floor(1000000000000 + Math.random() * 9000000000000)}`)
    setCoverUrl('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=300')
    setDescription('A breakthrough study detailing the transport protocols of quantum states across fiber networks, establishing error-correction thresholds, and describing standard node handshakes for quantum repeaters.')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !author) return
    addCatalogueBook(
      title,
      subtitle,
      author,
      category,
      floor,
      shelf || 'GEN-101',
      published || '2026',
      isbn || '978-0000000000',
      description || 'No description provided.',
      coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'
    )
    // Reset form fields
    setTitle('')
    setSubtitle('')
    setAuthor('')
    setCategory('Computer Science')
    setFloor('Floor 2')
    setShelf('')
    setPublished('')
    setIsbn('')
    setCoverUrl('')
    setDescription('')
  }

  return (
    <AnimatePresence>
      {isNewBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNewBookModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-background border border-border-parchment dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 mx-4 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-parchment dark:border-zinc-800 flex justify-between items-center bg-surface-bright dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Sparkle size={18} weight="fill" />
                </span>
                <div>
                  <h2 className="font-h2 text-sm font-bold text-on-surface">Catalog New Physical Volume</h2>
                  <p className="text-[10px] text-on-surface-variant font-medium">Record a new title in the physical campus registry.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleAutoFill}
                  className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold bg-primary/10 text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Auto-Fill Mock Data
                </button>
                <button 
                  onClick={() => setIsNewBookModalOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:bg-surface-container dark:hover:bg-zinc-850 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none text-xs font-semibold text-on-surface-variant">
              
              {/* Row 1: Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Book Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Introduction to Algorithms"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Subtitle (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. A Creative Approach"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
              </div>

              {/* Row 2: Author & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Author *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Thomas H. Cormen"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Science & Math">Science & Math</option>
                    <option value="Arts & Design">Arts & Design</option>
                    <option value="Literature">Literature</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Floor, Shelf & Publisher/Published */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface flex items-center gap-1">
                    <MapPin size={12} />
                    <span>Floor</span>
                  </label>
                  <select 
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Shelf Location</label>
                  <input 
                    type="text"
                    placeholder="e.g. CS-104"
                    value={shelf}
                    onChange={(e) => setShelf(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Published / Press</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 2021 (MIT Press)"
                    value={published}
                    onChange={(e) => setPublished(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
              </div>

              {/* Row 4: ISBN & Cover URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface flex items-center gap-1">
                    <Barcode size={12} />
                    <span>ISBN / Standard Number</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 9780262033848"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Cover Image URL</label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>
              </div>

              {/* Row 5: Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface flex items-center gap-1">
                  <FileText size={12} />
                  <span>Volume Synopsis & description</span>
                </label>
                <textarea 
                  rows={4}
                  placeholder="Provide an overview of the book's contents, index tags, and target subjects..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-border-parchment dark:border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setIsNewBookModalOpen(false)}
                  disabled={isAddingCatalogueBook}
                  className="px-4 py-2 border border-border-parchment dark:border-zinc-800 rounded-lg font-bold text-[10px] uppercase hover:bg-surface-container dark:hover:bg-zinc-850 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!title || !author || isAddingCatalogueBook}
                  className="bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-bold text-[10px] uppercase px-5 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {isAddingCatalogueBook ? (
                    <>
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save & Index Book</span>
                  )}
                </button>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
