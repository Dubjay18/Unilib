import React, { useState, useEffect } from 'react'
import { useLibrary, type Book } from '@/context/LibraryContext'
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
import { useQuery } from '@tanstack/react-query'
import { recommendationApi, libraryItemApi, type LibraryItemDto } from '@/lib/api'

// Lookups for visual jackets
const bookCovers: Record<string, string> = {
  "the elements of computing systems": "https://lh3.googleusercontent.com/aida-public/AB6AXuC3JQfZ_QbE9leqfjx-V1cl6sqGpO3QrGUTvYKRLz7lir7yOa-2QyHwFwVzEpm5SOZAJdFL3tOlcjzbTlUi5frw4IWfmZgWgHClETF9SZrG5qc9vpT0MEeRToeD0vbV-Nmhb2GcUVEp9tjs1yfc0P-yzOGH1LYGziILUqgnBmAHbGSDrDzEmiuDMdeFdeqyaYN5aMqXF6vHbicsngF3KZnmdefsNtl_JprjhLybQZjcBMmKBYQeGMT4DCCulPwajNQQPWrn2X4-lrE",
  "a brief history of time": "https://lh3.googleusercontent.com/aida-public/AB6AXuBhLnJzkDNMaiTQBp5QcbkhZQK_0jw6ZFrhv0Dxsec7FmM_BA0hl8B9BCaBtQVV4s4lvdrzGAGIfxDBgImNx-1LrHA1H4CMgfO1sjQJRXBrFlZu696DSRtMXTAw3Elh-I3olyk3HLXykkxGFT8d9Zk52G9f6onQQ50wZFkn-7ljnD7W3kBsEE3buwvIKN6knwXYkGuLkMNlxN4C_CEAp-FPNEC6d8dzwkMzH5i-wVGdc0zhvH9Lpyh3NEOkAxb180JPBlf5_Cm8ffk",
  "the design of everyday things": "https://lh3.googleusercontent.com/aida-public/AB6AXuAEP_qp6th3i2112lrD9gj1xuYWvX24IzgMCAztXQYCxXxlpisF9pjNPjR9aA7LDaQmhLEziIanPHLXBLuhfcNWhVPHb27Bpp53Oo5-kwazVV2Uw0u3Yybis1WDKEx86UKG2aZ_k8QTFzNycSYqotmTVzXKegM3hhhBHxqARHNb3T7YsxvNMy8mBGVcGoScRlEZAt6a2reLEKNRidXdlENM2IJdumVmygKWS964vtkPFuc4x0k4fSv24-dP9BPWABfsgeE1SEdVp68",
  "the dispossessed": "https://lh3.googleusercontent.com/aida-public/AB6AXuCOxUTo5iJcEtKGodi5LSxBxaud5_XDeOvdzGWL2n-1xZEdf2v29nE27vV96CwrwfVSMqsbjekyasd-lZuFHACRGz09N3SVDveH926FO0EMM3okf7qT9i2KPfYggh8maAjVnikKeQgwRvaIl5AhzNgGEKV0s38dXgvBzuEiSws7cxAlAmvhSAdwQ2kphWrV6IuDgjrvlGbIR6FxMvYE-wMUaQFusrU63ycRH2r9kuVni8jX04zRcCIZqdhVxlRg8mk1ViwLBRmh0uY",
  "red mars": "https://lh3.googleusercontent.com/aida-public/AB6AXuBspqHOqMRyXUYILbdikkzXqLzHkXWhhoL8ea8k3lH60ISsgm5r0KnxKuQPFCW6Ho7oCJbsDvd-8X8D3D9GJ32ePyOhR0NG7AvS_FoucD_fdC-arhDa-Jhl4CpUkTn_KElTrOdVLozQBtyOTx3zftQAY1cL6MiM_XNBirPzHgnwNv-2Sc6Zd0OOOrZrulb2E2Y18gWkVrlftQnjOXs_DCS_AwIHM3EiAso2cNC81CDYSEmo9BdKoMYC69JdbSIqpWuk5xQLCfEV0uE",
  "foundation": "https://lh3.googleusercontent.com/aida-public/AB6AXuAyzdgoPAmz4k7tQTYtSJh9Qpv64MEzcrY91_IsDHueMuNhzbF1D4eUI5u8VcSBFaQ2j_rr8owqAu-PpMHNjtmnU_mK67ZjNZkU8cNHOM0smS8mFdzGjEeTAxoiA-_apak84tRtAJaTD54ouNbi8SPZ3ujfFj66UzoqUoyqXrH2Inl8p4W_fQZz0g1CBjCAQshtV6TWXFOu8kYHtRLkoGKWiEWk5x3IpG5orNY4pD8wjZMvicTvRcm75M5N1-iPnPztCQcyupVGr30",
  "the structure of scientific revolutions": "https://lh3.googleusercontent.com/aida-public/AB6AXuDpneiPmk0R7UtfwpWQIumvcAXX7mxu6RppyBMVR6pUQKigTbFvPhRwhWKu4-rS7l5exa_MW1YS-AB8H_e8F0DzF4CJAKYas0hpRqhHSb_cQfPcoN8kUjqfC9ChsppGYAZunlU5RG-Az2CTxQTreRWh9oTcwsKm4CW7hwcZavh8FBKH7eW2mHVJPT2c-A-u8WY3V9w1Iqk-4QAAOmiFwvwl4-Ju6LoN_crMEbeP8uk8L0LDV1cN9jV9KAiZjUi2dykBB6aCP2DyWUg",
  "advanced macroeconomics": "https://lh3.googleusercontent.com/aida-public/AB6AXuCvD1KupNwi1XH53HW4Ugcz3NTaW6RPYjbcLuJ-C2DzeJvnFGVDbWapIhhJwOPlJJ4ysgWBSt8Mkn_MJNO_Ce4rWRR7pvpcIhiPYUUWTmPqiUkLpMo45aiwGoW8GC9r0qt_n2wut-1UURdaqfuTw0zjp_NIU4Pe3lLH8ujlyXlJgZb4lEC-AYEfllChJ1QXdezEVJOcDfWUhPqdjQuJoz2-WVBquJ0VVNPVroNalgiMC5AbAlwyiOerooTRnpKpzc5vI-6Oec0iFMA",
  "clean code": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
  "introduction to algorithms": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=300"
}

// Typewriter placeholders cycling loop
const placeholders = [
  "sci-fi like Dune exploring ecological themes...",
  "foundational texts on quantum mechanics and particle physics...",
  "philosophical journals on existentialism post-1950...",
  "computer architectures from first principles..."
]

export const AISearchScreen: React.FC = () => {
  const { setSelectedBook, role } = useLibrary()
  const navigate = useNavigate()
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  // Placeholder loop
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
        setTimeout(() => {
          setPlaceholderIndex(prev => (prev + 1) % placeholders.length)
        }, 3000)
      }
    }, 70)

    return () => clearInterval(typeInterval)
  }, [placeholderIndex])

  // Query: Recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: recommendationApi.get,
  })

  // Query: Natural language Search
  const { data: searchResultsData, isFetching: isSearchingNL } = useQuery({
    queryKey: ['naturalSearch', submittedQuery],
    queryFn: () => libraryItemApi.naturalSearch({ query: submittedQuery }),
    enabled: !!submittedQuery,
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedQuery(searchQuery)
  }

  // DTO mapping helper
  const mapDtoToBook = (dto: LibraryItemDto): Book => {
    const titleKey = dto.title.toLowerCase().trim()
    const coverUrl = bookCovers[titleKey] || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'
    
    return {
      id: dto.id,
      title: dto.title,
      subtitle: dto.edition ? `${dto.edition} Edition` : undefined,
      author: dto.author,
      category: dto.categoryName || 'General',
      floor: dto.shelfName.startsWith('CS') ? 'Floor 2' : dto.shelfName.startsWith('PHYS') ? 'Floor 3' : 'Floor 1',
      shelf: dto.shelfName || 'GEN-101',
      status: dto.availableCopies > 0 ? 'available' : 'checked-out',
      rating: titleKey.includes('everyday') ? 4.0 : titleKey.includes('time') ? 5.0 : 4.5,
      reviewsCount: titleKey.includes('everyday') ? 84 : titleKey.includes('time') ? 512 : 120,
      published: dto.publicationYear ? `${dto.publicationYear} (${dto.publisher})` : dto.publisher,
      isbn: dto.isbn || '978-0000000000',
      description: dto.description || 'Synopsis unavailable in system.',
      coverUrl,
      coverAlt: `Spine jacket of ${dto.title}`,
      type: dto.type || 'Book',
      aiMatch: true
    }
  }

  // Results compiling
  const showResults = !!submittedQuery
  const isSearching = isSearchingNL
  const activeBooks: Array<{ book: Book; reason: string; score: number }> = showResults
    ? (searchResultsData?.results || []).map(r => ({
        book: mapDtoToBook(r.item),
        reason: r.reason,
        score: r.relevanceScore
      }))
    : (recommendationsData?.recommendations || []).map(r => ({
        book: mapDtoToBook(r.item),
        reason: r.reason,
        score: r.relevanceScore
      }))

  // Dynamic interpretation box content
  const interpretationTitle = showResults
    ? (searchResultsData?.usedNaturalLanguage ? 'AI Query Interpretation (Natural Language)' : 'Fallback Keyword Match')
    : 'Scholar Profile Analysis'

  const interpretationDesc = showResults
    ? (searchResultsData?.interpretedQuery 
        ? `Searched: "${submittedQuery}". Parsed as: ${searchResultsData.interpretedQuery}. Found ${searchResultsData.totalMatches} catalog matches.`
        : 'Analyzing search parameters and cross-referencing archives databases.')
    : (recommendationsData?.readerProfile || 'Analyzing borrowings timeline to assemble academic reading preferences.')

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
          {submittedQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSubmittedQuery('')
              }}
              className="text-[10px] uppercase font-bold text-on-surface-variant mr-2 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
            >
              Clear
            </button>
          )}
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
        <AnimatePresence mode="wait">
          {(!showResults && recommendationsData) || (showResults && searchResultsData) ? (
            <motion.div
              key={showResults ? 'search-desc' : 'rec-desc'}
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
                  {interpretationTitle}
                </p>
                <p className="font-body-md text-xs leading-relaxed text-on-surface dark:text-zinc-350">
                  {interpretationDesc}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      {/* Curated Recommendations Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-secondary flex items-center justify-center">
            <Sparkle size={24} weight="fill" />
          </span>
          <h2 className="font-h2 text-xl md:text-2xl text-primary font-bold">
            {showResults ? 'Search Discoveries' : 'Curated Recommendations'}
          </h2>
        </div>

        {/* Bento Recommendation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBooks.map(({ book, reason, score }) => {
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
                <div className="accent-bar accent-bar-ai" />
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
                    
                    <div className="absolute top-2 right-2 bg-surface-bright/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-secondary border border-secondary flex items-center gap-1">
                      <Brain size={12} weight="fill" /> 
                      <span>Score: {Math.round(score * 100)}%</span>
                    </div>
                  </div>

                  <h3 className="font-h3 text-base text-on-surface font-bold mb-1 leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="font-meta text-xs text-on-surface-variant font-medium mb-2">
                    {book.author}
                  </p>
                  
                  {reason && (
                    <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed italic border-l-2 border-primary/20 pl-2 py-0.5 mb-4">
                      "{reason}"
                    </p>
                  )}
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
                    {book.shelf}
                  </span>
                </div>
              </motion.article>
            )
          })}
        </div>

        {activeBooks.length === 0 && !isSearching && (
          <div className="text-center py-16 border-2 border-dashed border-border-parchment dark:border-zinc-850 rounded-2xl bg-white/40">
            <Compass size={40} className="text-on-surface-variant mx-auto mb-3" />
            <h4 className="font-bold text-sm text-on-surface">No books matched your criteria</h4>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto">
              Try keyword descriptors like "ecological themes", "first principles", or search blank to restore default recommendations.
            </p>
          </div>
        )}
      </section>

    </div>
  )
}
