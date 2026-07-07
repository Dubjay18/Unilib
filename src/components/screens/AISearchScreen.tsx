import React, { useState, useEffect } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  Sparkle, 
  Brain, 
  BookOpen, 
  Compass, 
  Clock,
  CheckCircle,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Typewriter placeholders cycling loop
const placeholders = [
  "sci-fi like Dune exploring ecological themes...",
  "foundational texts on quantum mechanics and particle physics...",
  "philosophical journals on existentialism post-1950...",
  "computer architectures from first principles..."
]

export const AISearchScreen: React.FC = () => {
  const { books, setSelectedBook, role } = useLibrary()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showInterpretation, setShowInterpretation] = useState(true)
  const [interpretation, setInterpretation] = useState({
    title: 'AI Interpretation',
    desc: 'Searching for narrative fiction in the Science Fiction genre with central themes of Ecology, Politics, and Resource Scarcity. Prioritizing seminal works post-1960.'
  })

  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [currentPlaceholder, setCurrentPlaceholder] = useState('')
  
  useEffect(() => {
    let charIdx = 0
    let text = placeholders[placeholderIndex]
    setCurrentPlaceholder('')
    
    const typeInterval = setInterval(() => {
      setCurrentPlaceholder(prev => prev + text.charAt(charIdx))
      charIdx++
      if (charIdx >= text.length) {
        clearInterval(typeInterval)
        // Wait 3 seconds and type next
        setTimeout(() => {
          setPlaceholderIndex(prev => (prev + 1) % placeholders.length)
        }, 3000)
      }
    }, 70)

    return () => clearInterval(typeInterval)
  }, [placeholderIndex])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setShowInterpretation(true)
      
      // Dynamic interpretation depending on search query
      if (searchQuery.trim()) {
        setInterpretation({
          title: 'Dynamic AI Query Parsing',
          desc: `Interpreting keywords: "${searchQuery}". Extracting intellectual subjects, cross-referencing university inventory shelves, and filtering for highly-rated academic volumes.`
        })
      } else {
        setInterpretation({
          title: 'AI Interpretation',
          desc: 'Searching for narrative fiction in the Science Fiction genre with central themes of Ecology, Politics, and Resource Scarcity. Prioritizing seminal works post-1960.'
        })
      }
    }, 600)
  }

  // Filter books list according to search queries or show AI matches by default
  const filteredRecommendations = books.filter(b => {
    if (!searchQuery) return b.aiMatch || b.category === 'Literature'
    const term = searchQuery.toLowerCase()
    return b.title.toLowerCase().includes(term) ||
           b.author.toLowerCase().includes(term) ||
           b.category.toLowerCase().includes(term) ||
           b.description.toLowerCase().includes(term)
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      
      {/* Search Hero Section */}
      <section className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-h1 text-h1-mobile md:text-h1 text-primary mb-6 leading-none"
        >
          Discover Knowledge
        </motion.h1>

        {/* AI Glow Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full ai-glow bg-white dark:bg-zinc-900 rounded-xl flex items-center p-2 mb-6 transition-all focus-within:shadow-lg focus-within:scale-[1.01]">
          <span className="p-2 text-secondary flex items-center justify-center">
            <Compass size={22} weight="fill" className="animate-spin-slow" />
          </span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-body-lg text-on-surface placeholder-on-surface-variant/60 py-3.5 px-2 outline-none"
            placeholder={currentPlaceholder || "Type research interests..."}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-3 px-6 rounded-lg ml-2 transition-colors crimson-shadow flex items-center gap-1.5"
          >
            {isSearching ? (
              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <MagnifyingGlass size={16} weight="bold" />
            )}
            <span>Search</span>
          </button>
        </form>

        {/* Dynamic Interpretation Box */}
        <AnimatePresence>
          {showInterpretation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-left bg-surface-container-low dark:bg-zinc-900/60 rounded-xl p-5 border border-border-parchment dark:border-zinc-800 flex items-start gap-4"
            >
              <span className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-lg text-secondary mt-0.5">
                <Brain size={20} weight="fill" />
              </span>
              <div>
                <p className="font-meta text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                  {interpretation.title}
                </p>
                <p className="font-body-md text-xs leading-relaxed text-on-surface dark:text-zinc-350">
                  {interpretation.desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Curated Recommendations Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-secondary flex items-center justify-center">
            <Sparkle size={24} weight="fill" />
          </span>
          <h2 className="font-h2 text-xl md:text-2xl text-primary font-bold">Curated Recommendations</h2>
        </div>

        {/* Bento Recommendation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map(book => {
            const isAvailable = book.status === 'available'
            return (
              <motion.article 
                key={book.id}
                layoutId={`book-card-${book.id}`}
                onClick={() => {
                  setSelectedBook(book)
                  navigate(role === 'student' ? '/catalogue' : '/staff/catalogue')
                }}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 p-5 pl-[22px] card-lift transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div className={`accent-bar ${book.aiMatch ? 'accent-bar-ai' : 'accent-bar-green'}`} />
                <div>
                  {/* Book Spine Mock */}
                  <div className="h-44 mb-4 rounded-lg bg-surface-container dark:bg-zinc-950 overflow-hidden border border-border-parchment/65 dark:border-zinc-800 relative">
                    {book.coverUrl ? (
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        alt={book.coverAlt} 
                        src={book.coverUrl} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <BookOpen size={48} />
                      </div>
                    )}
                    
                    {book.aiMatch && (
                      <div className="absolute top-2 right-2 bg-surface-bright/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-secondary border border-secondary flex items-center gap-1">
                        <Brain size={12} weight="fill" /> 
                        <span>AI Match</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-h3 text-base text-on-surface font-bold mb-1 leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="font-meta text-xs text-on-surface-variant font-medium mb-4">
                    {book.author}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-parchment/60 dark:border-zinc-800 flex justify-between items-center text-xs">
                  {isAvailable ? (
                    <span className="bg-[#e2f0d9] dark:bg-emerald-950/30 text-[#005323] dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle size={12} weight="fill" />
                      <span>Available</span>
                    </span>
                  ) : (
                    <span className="bg-[#fce8e6] dark:bg-rose-950/30 text-[#ba1a1a] dark:text-rose-450 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Clock size={12} weight="fill" />
                      <span>Checked Out</span>
                    </span>
                  )}
                  
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    {isAvailable ? (book.floor || 'Floor 3') : `Due ${book.dueDate || 'Nov 12'}`}
                  </span>
                </div>
              </motion.article>
            )
          })}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-border-parchment dark:border-zinc-850 rounded-2xl bg-white/40">
            <Compass size={40} className="text-on-surface-variant mx-auto mb-3" />
            <h4 className="font-bold text-sm text-on-surface">No books matched your criteria</h4>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto">Try search keywords like "Dune", "physics", "computing", or search blank to restore default recommendations.</p>
          </div>
        )}
      </section>

    </div>
  )
}
