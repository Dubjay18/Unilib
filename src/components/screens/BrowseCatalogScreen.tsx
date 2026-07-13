import React, { useState, useRef, useEffect } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  Heart, 
  Star, 
  ShoppingCartSimple, 
  BookmarkSimple, 
  ListBullets,
  CalendarCheck,
  BookOpen,
  Trash,
  Pencil
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi, categoryApi } from '@/lib/api'

export const BrowseCatalogScreen: React.FC = () => {
  const queryClient = useQueryClient()
  const { 
    books, 
    selectedBook, 
    setSelectedBook, 
    borrowBook, 
    reserveBook,
    isBorrowingBook,
    borrowingBookId,
    isReservingBook,
    reservingBookId,
    showToast,
    role,
    loans
  } = useLibrary()

  const hasBorrowed = role === 'student' && loans.some((l) => l.bookId === selectedBook?.id)

  const [activeCategory, setActiveCategory] = useState('All Subjects')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Relevance')
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    '3': true // Default "Design of Everyday Things" favorited in HTML screen
  })

  const detailSectionRef = useRef<HTMLDivElement>(null)

  // Reviews Queries and Mutations
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [isEditingReview, setIsEditingReview] = useState(false)

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', selectedBook?.id],
    queryFn: () => reviewsApi.getByItem(selectedBook!.id),
    enabled: !!selectedBook?.id
  })

  const { data: myReview } = useQuery({
    queryKey: ['myReview', selectedBook?.id],
    queryFn: () => reviewsApi.getMyReviewForItem(selectedBook!.id),
    enabled: !!selectedBook?.id
  })

  const createReviewMutation = useMutation({
    mutationFn: reviewsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', selectedBook?.id] })
      queryClient.invalidateQueries({ queryKey: ['myReview', selectedBook?.id] })
      setReviewComment('')
      setReviewRating(5)
      showToast('Review submitted successfully!', 'success')
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || err.message || 'Failed to submit review.', 'error')
    }
  })

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, rating, comment }: { id: string; rating: number; comment?: string | null }) =>
      reviewsApi.update(id, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', selectedBook?.id] })
      queryClient.invalidateQueries({ queryKey: ['myReview', selectedBook?.id] })
      setIsEditingReview(false)
      setReviewComment('')
      setReviewRating(5)
      showToast('Review updated successfully!', 'success')
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || err.message || 'Failed to update review.', 'error')
    }
  })

  const deleteReviewMutation = useMutation({
    mutationFn: reviewsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', selectedBook?.id] })
      queryClient.invalidateQueries({ queryKey: ['myReview', selectedBook?.id] })
      showToast('Review deleted successfully!', 'success')
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || err.message || 'Failed to delete review.', 'error')
    }
  })

  // Auto-scroll to selected book details
  useEffect(() => {
    if (selectedBook && detailSectionRef.current) {
      detailSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedBook])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Query: Categories from API
  const { data: apiCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories({ view: 'top-level' })
  })

  const categories = [
    { name: 'All Subjects', count: books.length },
    ...apiCategories.map((cat: { name: string; itemCount: number }) => ({
      name: cat.name,
      count: cat.itemCount || books.filter(b => b.category === cat.name).length
    }))
  ]

  // Filter book items
  const filteredBooks = books.filter(book => {
    const matchesCategory = activeCategory === 'All Subjects' || 
      book.category === activeCategory

    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Sort book items
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'Title (A-Z)') return a.title.localeCompare(b.title)
    if (sortBy === 'Newest Additions') return b.published.localeCompare(a.published)
    return b.rating - a.rating // Default relevance by stars
  })

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 !== 0

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} weight="fill" className="text-amber-500" />)
      } else if (i === fullStars + 1 && hasHalf) {
        // Converted half star to Phosphor representation
        stars.push(<Star key={i} size={14} weight="duotone" className="text-amber-500" />)
      } else {
        stars.push(<Star key={i} size={14} className="text-border-parchment" />)
      }
    }
    return stars
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-6 gap-6 transition-colors duration-300">
      
      {/* Category Aside Filters */}
      <aside className="w-full md:w-60 flex-shrink-0">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-border-parchment dark:border-zinc-800 sticky top-20 shadow-sm">
          <h3 className="font-h3 text-base text-on-surface font-bold mb-4 flex items-center gap-2">
            <ListBullets size={18} />
            <span>Browse</span>
          </h3>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat.name}>
                <button
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCategory === cat.name
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-zinc-800 hover:text-primary'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.name
                      ? 'bg-primary-fixed-dim/20 text-on-primary-container'
                      : 'bg-surface-container dark:bg-zinc-850 text-on-surface-variant'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Catalog View Container */}
      <div className="flex-grow flex flex-col gap-8 min-w-0">
        
        {/* Search header controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border-parchment dark:border-zinc-800 pb-4 gap-4">
          <div>
            <h2 className="font-h2 text-2xl text-on-surface font-bold">Catalogue</h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              Showing results for '{activeCategory}'
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-44"
            />
            
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Relevance</option>
              <option>Newest Additions</option>
              <option>Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Catalog Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBooks.map(book => {
            const isAvailable = book.status === 'available'
            const isFavorited = !!favorites[book.id]
            return (
              <article
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className={`bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 relative overflow-hidden flex flex-col justify-between card-lift h-full cursor-pointer pl-[22px] p-5 ${
                  selectedBook?.id === book.id ? 'ring-2 ring-secondary' : ''
                }`}
              >
                {/* Available Accent Left line indicator */}
                <div className={`accent-bar ${isAvailable ? 'accent-bar-green' : 'accent-bar-red'}`}></div>
                
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      isAvailable 
                        ? 'bg-[#e2f0d9] dark:bg-emerald-950/20 text-[#005323] dark:text-emerald-400' 
                        : 'bg-[#fce8e6] dark:bg-rose-950/20 text-[#ba1a1a] dark:text-rose-400'
                    }`}>
                      {isAvailable ? 'Available' : 'Checked Out'}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(book.id, e)}
                      className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800"
                      title={isFavorited ? 'Remove from reading list' : 'Add to reading list'}
                    >
                      <Heart 
                        size={16} 
                        weight={isFavorited ? 'fill' : 'regular'} 
                        className={isFavorited ? 'text-primary' : 'text-on-surface-variant'} 
                      />
                    </button>
                  </div>

                  <h3 className="font-h3 text-base text-on-surface font-bold leading-snug mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="font-meta text-xs text-on-surface-variant font-medium mb-3">
                    {book.author}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center mb-3">
                    {renderStars(book.rating)}
                    <span className="font-meta text-[10px] text-on-surface-variant ml-1.5 font-bold">
                      ({book.rating.toFixed(1)})
                    </span>
                  </div>
                  
                  {/* Book cover mock thumbnail */}
                  <div className="w-full bg-surface-container-low dark:bg-zinc-950 h-28 rounded-lg overflow-hidden border border-border-parchment/65 dark:border-zinc-800/80 relative">
                    {book.coverUrl ? (
                      <img 
                        alt="Book cover spine detail" 
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity" 
                        src={book.coverUrl} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <BookOpen size={32} />
                      </div>
                    )}
                    {book.aiMatch && (
                      <span className="absolute top-1.5 right-1.5 text-[8px] bg-primary/10 text-primary dark:text-primary-fixed-dim border border-primary/20 px-1.5 py-0.5 rounded font-bold">
                        AI Matches
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {sortedBooks.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border-parchment dark:border-zinc-800 rounded-xl bg-white/40">
            <h4 className="font-bold text-sm">No Catalogue entries found</h4>
            <p className="text-xs text-on-surface-variant mt-1">Try resetting filters or search strings.</p>
          </div>
        )}

        {/* Selected Record Detail Panel */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              ref={detailSectionRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="border-t border-border-parchment dark:border-zinc-800 pt-8"
            >
              <h2 className="font-h2 text-xl md:text-2xl text-on-surface font-bold mb-6">Selected Record</h2>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-parchment dark:border-zinc-800 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
                
                {/* Accent bar color based on availability */}
                <div className={`accent-bar ${selectedBook.status === 'available' ? 'accent-bar-green' : 'accent-bar-red'} w-2.5`}></div>
                
                {/* Detail Spine Cover */}
                <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 flex flex-col items-center pl-3">
                  <div className="w-full aspect-[2/3] max-w-[200px] bg-surface-container dark:bg-zinc-950 rounded-xl shadow-md border border-border-parchment dark:border-zinc-800 overflow-hidden mb-4">
                    {selectedBook.coverUrl ? (
                      <img 
                        alt="High resolution book spine cover illustration" 
                        className="w-full h-full object-cover" 
                        src={selectedBook.coverUrl} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <BookOpen size={64} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 justify-center w-full">
                    <span className={`inline-flex items-center px-3 py-1 rounded text-[10px] font-bold border ${
                      selectedBook.status === 'available'
                        ? 'bg-[#e2f0d9] text-[#005323] border-[#b2d8a3]'
                        : 'bg-[#fce8e6] text-[#ba1a1a] border-[#f5b8b3]'
                    }`}>
                      {selectedBook.status === 'available' ? '3 Copies Available' : 'Waitlist Active'}
                    </span>
                  </div>
                </div>

                {/* Metadata & Description Actions */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div>
                        <h1 className="font-h1 text-xl md:text-2xl text-on-surface font-bold leading-tight mb-1">
                          {selectedBook.title}
                        </h1>
                        {selectedBook.subtitle && (
                          <p className="font-h3 text-xs md:text-sm text-on-surface-variant font-medium mb-1">
                            {selectedBook.subtitle}
                          </p>
                        )}
                        <p className="font-body-lg text-xs font-semibold text-primary">
                          {selectedBook.author}
                        </p>
                      </div>
                      
                      {/* Close detail selection */}
                      <button 
                        onClick={() => setSelectedBook(null)}
                        className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold px-2.5 py-1 bg-surface-container dark:bg-zinc-800 rounded-lg"
                      >
                        Dismiss
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-4 pb-3 border-b border-border-parchment dark:border-zinc-800 text-xs">
                      <div className="flex items-center">
                        {renderStars(selectedBook.rating)}
                        <span className="font-body-md text-xs text-on-surface ml-2 font-bold">
                          {selectedBook.rating.toFixed(1)}
                        </span>
                        <span className="font-meta text-[10px] text-on-surface-variant ml-1 font-medium">
                          ({selectedBook.reviewsCount} Reviews)
                        </span>
                      </div>
                      <span className="text-outline">|</span>
                      <span className="font-meta text-[10px] text-on-surface-variant font-medium">
                        Published: {selectedBook.published}
                      </span>
                      <span className="text-outline">|</span>
                      <span className="font-meta text-[10px] text-on-surface-variant font-medium font-mono">
                        ISBN: {selectedBook.isbn}
                      </span>
                    </div>

                    <div className="prose max-w-none text-xs text-on-surface-variant dark:text-zinc-350 leading-relaxed mb-6">
                      <p>{selectedBook.description}</p>
                    </div>
                  </div>

                  {/* Operational Triggers */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-border-parchment/60 dark:border-zinc-800 mt-auto">
                    {/* Borrow Button Container */}
                    <div className="relative group">
                      {selectedBook.status === 'available' ? (
                        <button
                          onClick={() => borrowBook(selectedBook.id)}
                          disabled={isBorrowingBook || isReservingBook || hasBorrowed}
                          className="bg-primary hover:bg-primary-container disabled:opacity-75 disabled:cursor-not-allowed text-on-primary font-bold text-xs py-3 px-6 rounded-lg shadow-md transition-all hover:scale-[0.99] active:scale-[0.97] flex items-center gap-1.5"
                        >
                          {isBorrowingBook && borrowingBookId === selectedBook.id ? (
                            <>
                              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Borrowing...</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCartSimple size={16} weight="bold" />
                              <span>Borrow Copy</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 font-bold text-xs py-3 px-6 rounded-lg flex items-center gap-1.5 cursor-not-allowed"
                        >
                          <CalendarCheck size={16} />
                          <span>Already Checked Out</span>
                        </button>
                      )}
                      
                      {hasBorrowed && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-sm text-white text-[10px] font-bold py-1.5 px-3 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                          You currently have an active loan for this book.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95"></div>
                        </div>
                      )}
                    </div>

                    {/* Reserve Button Container */}
                    <div className="relative group">
                      <button
                        onClick={() => reserveBook(selectedBook.id)}
                        disabled={isBorrowingBook || isReservingBook || hasBorrowed}
                        className="bg-surface-container dark:bg-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-on-surface font-bold text-xs py-3 px-6 rounded-lg border border-border-parchment dark:border-zinc-700 transition-all flex items-center gap-1.5"
                      >
                        {isReservingBook && reservingBookId === selectedBook.id ? (
                          <>
                            <span className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin"></span>
                            <span>Reserving...</span>
                          </>
                        ) : (
                          <>
                            <BookmarkSimple size={16} weight="bold" />
                            <span>Reserve hold</span>
                          </>
                        )}
                      </button>

                      {hasBorrowed && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-sm text-white text-[10px] font-bold py-1.5 px-3 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                          You currently have an active loan for this book.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="mt-8 border-t border-border-parchment dark:border-zinc-800 pt-6">
                    <h3 className="font-h3 text-base text-on-surface font-bold mb-4 flex items-center gap-1.5">
                      <Star size={18} weight="fill" className="text-amber-500" />
                      <span>Scholar Reviews</span>
                    </h3>

                    {/* Display user's own review info/edit panel */}
                    {myReview ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-xs text-primary">Your Review</p>
                            <div className="flex gap-0.5 mt-1">
                              {renderStars(myReview.rating)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setReviewRating(myReview.rating)
                                setReviewComment(myReview.comment || '')
                                setIsEditingReview(true)
                              }}
                              className="text-on-surface-variant hover:text-primary p-1.5 bg-white dark:bg-zinc-850 rounded border border-border-parchment/60 transition-colors"
                              title="Edit Review"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => deleteReviewMutation.mutate(myReview.id)}
                              disabled={deleteReviewMutation.isPending}
                              className="text-on-surface-variant hover:text-error disabled:opacity-50 p-1.5 bg-white dark:bg-zinc-850 rounded border border-border-parchment/60 transition-colors flex items-center justify-center"
                              title="Delete Review"
                            >
                              {deleteReviewMutation.isPending ? (
                                <span className="h-3 w-3 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></span>
                              ) : (
                                <Trash size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                        {myReview.comment && (
                          <p className="text-xs text-on-surface-variant leading-relaxed italic">"{myReview.comment}"</p>
                        )}
                      </div>
                    ) : null}

                    {/* Write/Edit Review Form */}
                    {(!myReview || isEditingReview) && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (isEditingReview && myReview) {
                            updateReviewMutation.mutate({
                              id: myReview.id,
                              rating: reviewRating,
                              comment: reviewComment
                            })
                          } else {
                            createReviewMutation.mutate({
                              libraryItemId: selectedBook.id,
                              rating: reviewRating,
                              comment: reviewComment
                            })
                          }
                        }}
                        className="space-y-3 mb-6 bg-surface-container/30 dark:bg-zinc-950/20 p-4 rounded-xl border border-border-parchment/60 dark:border-zinc-800"
                      >
                        <h4 className="font-bold text-xs text-on-surface">
                          {isEditingReview ? 'Edit Your Review' : 'Write a Review'}
                        </h4>

                        {/* Rating stars selector */}
                        <div className="flex gap-1 items-center">
                          <span className="text-[10px] text-on-surface-variant mr-1">Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="text-amber-500 hover:scale-110 transition-transform p-0.5 bg-transparent border-none cursor-pointer"
                            >
                              <Star size={16} weight={star <= reviewRating ? 'fill' : 'regular'} />
                            </button>
                          ))}
                        </div>

                        {/* Comment text box */}
                        <div className="space-y-1">
                          <textarea
                            rows={3}
                            placeholder="Share your thoughts on this academic volume..."
                            value={reviewComment}
                            disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-on-surface resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          {isEditingReview && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingReview(false)
                                setReviewComment('')
                              }}
                              className="px-3 py-1.5 border border-border-parchment rounded-lg text-[10px] uppercase font-bold"
                            >
                              Cancel
                            </button>
                          )}
                           <button
                             type="submit"
                             disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
                             className="bg-primary hover:bg-primary-container disabled:opacity-75 text-on-primary font-bold text-[10px] uppercase px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5"
                           >
                             {createReviewMutation.isPending || updateReviewMutation.isPending ? (
                               <>
                                 <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                 <span>Submitting...</span>
                               </>
                             ) : (
                               <span>Submit Review</span>
                             )}
                           </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                        reviewsData.reviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="bg-surface-container-low/40 dark:bg-zinc-950/10 p-3 rounded-lg border border-border-parchment/40 dark:border-zinc-800/60 text-xs font-semibold text-on-surface-variant"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-on-surface text-xs">{rev.userName}</span>
                              <div className="flex gap-0.5">
                                {renderStars(rev.rating)}
                              </div>
                            </div>
                            {rev.comment && <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium mt-1">{rev.comment}</p>}
                            <span className="text-[9px] text-outline mt-2 block font-mono">
                              Posted: {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-on-surface-variant italic py-2">
                          No scholar reviews recorded yet. Be the first to add your perspective!
                        </p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
