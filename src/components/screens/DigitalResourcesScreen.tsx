import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  FilePdf, 
  BookOpen, 
  Wrench, 
  CheckCircle, 
  BookmarkSimple, 
  Trash, 
  Eye, 
  EyeSlash, 
  UploadSimple, 
  X, 
  CloudArrowUp,
  Tag,
  Funnel,
  Folders,
  Compass
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export const DigitalResourcesScreen: React.FC = () => {
  const {
    role,
    resources,
    uploadResource,
    deleteResource,
    toggleResourceVisibility,
    isUploadModalOpen,
    setIsUploadModalOpen
  } = useLibrary()

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCollection, setActiveCollection] = useState('Digital Resources')
  const [filterPdf, setFilterPdf] = useState(true)
  const [filterEpub, setFilterEpub] = useState(true)

  // Upload Form states
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newTags, setNewTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [fileFormat, setFileFormat] = useState<'PDF' | 'EPUB'>('PDF')
  const [mockDragActive, setMockDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null)

  const handleAddTag = () => {
    if (tagInput.trim() && !newTags.includes(tagInput.trim())) {
      setNewTags([...newTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleSuggestTag = (tag: string) => {
    if (!newTags.includes(tag)) {
      setNewTags([...newTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewTags(newTags.filter(t => t !== tag))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return
    
    const size = uploadedFile ? uploadedFile.size : '4.2 MB'
    uploadResource(newTitle, newAuthor, newTags, isPublic, fileFormat, size)

    // Reset Form
    setNewTitle('')
    setNewAuthor('')
    setNewTags([])
    setUploadedFile(null)
  }

  // Handle mock file selection
  const triggerMockFileSelect = () => {
    setUploadedFile({
      name: `${newTitle || 'research_paper'}_draft.${fileFormat.toLowerCase()}`,
      size: `${(Math.random() * 15 + 2).toFixed(1)} MB`
    })
  }

  const collections = [
    { name: 'Digital Resources', icon: Folders },
    { name: 'Special Archives', icon: BookOpen },
    { name: 'Journals', icon: FilePdf }
  ]

  // Filter resources list
  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFormat = (res.format === 'PDF' && filterPdf) || (res.format === 'EPUB' && filterEpub)
    
    // Non-staff can only see public resources
    const matchesVisibility = role === 'staff' || res.isPublic

    return matchesSearch && matchesFormat && matchesVisibility
  })

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 py-8 gap-6 transition-colors duration-300">
      
      {/* LEFT FILTER PANEL */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-5 shadow-sm sticky top-20">
          
          <h3 className="font-h3 text-base text-on-surface font-bold mb-4 flex items-center gap-2">
            <Folders size={18} />
            <span>Collections</span>
          </h3>
          <ul className="space-y-2 mb-6">
            {collections.map(col => {
              const Icon = col.icon
              return (
                <li key={col.name}>
                  <button
                    onClick={() => setActiveCollection(col.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      activeCollection === col.name
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-zinc-800 hover:text-primary'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{col.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="pt-5 border-t border-border-parchment dark:border-zinc-800">
            <h4 className="font-label-caps text-[10px] text-on-surface-variant font-bold mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Funnel size={14} />
              <span>Resource Type</span>
            </h4>
            <div className="space-y-2 text-xs font-semibold text-on-surface-variant">
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-primary">
                <input 
                  checked={filterPdf} 
                  onChange={e => setFilterPdf(e.target.checked)}
                  className="rounded text-primary focus:ring-primary dark:focus:ring-primary-fixed-dim bg-background border-border-parchment dark:border-zinc-700 h-4 w-4" 
                  type="checkbox"
                />
                <span>PDF Documents</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-primary">
                <input 
                  checked={filterEpub} 
                  onChange={e => setFilterEpub(e.target.checked)}
                  className="rounded text-primary focus:ring-primary dark:focus:ring-primary-fixed-dim bg-background border-border-parchment dark:border-zinc-700 h-4 w-4" 
                  type="checkbox"
                />
                <span>eBooks (EPUB)</span>
              </label>
            </div>
          </div>

        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow min-w-0">
        
        {/* Header & Staff operations */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-h1 text-2xl md:text-3xl text-on-background font-bold mb-1">Digital Resources</h1>
            <p className="font-body-lg text-xs md:text-sm text-on-surface-variant">
              Access and manage the university's digital repository.
            </p>
          </div>

          {/* Librarian Trigger Toggle */}
          {role === 'staff' && (
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-border-parchment dark:border-zinc-800 shadow-sm">
              <span className="px-2.5 py-1 bg-surface-container-low dark:bg-zinc-950/60 text-on-surface-variant font-meta text-[10px] rounded-md font-bold flex items-center gap-1.5 border border-border-parchment/40">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Staff Mode</span>
              </span>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-primary hover:bg-primary-container text-on-primary hover:scale-[0.99] active:scale-[0.97] transition-all px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <UploadSimple size={16} weight="bold" />
                <span>Upload Resource</span>
              </button>
            </div>
          )}
        </div>

        {/* Search repository */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 p-2 flex items-center gap-2 mb-6 shadow-sm">
          <span className="text-on-surface-variant pl-3 flex items-center justify-center">
            <Compass size={18} />
          </span>
          <input
            className="flex-grow bg-transparent border-none focus:ring-0 font-body-md text-xs text-on-background placeholder:text-on-surface-variant/50 outline-none"
            placeholder="Search by title, author, or keyword..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResources.map(res => {
              const isPdf = res.format === 'PDF'
              const isAvailable = res.status === 'available'
              const isReserved = res.status === 'reserved'
              const isMaintenance = res.status === 'maintenance'

              return (
                <motion.div
                  key={res.id}
                  layoutId={`resource-card-${res.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 overflow-hidden academic-shadow academic-hover transition-all duration-300 relative group flex flex-col justify-between h-full ${
                    isAvailable ? 'accent-bar-green pl-[22px]' : isReserved ? 'accent-bar-amber pl-[22px]' : 'accent-bar-red pl-[22px]'
                  } ${isMaintenance ? 'opacity-70 grayscale-[30%]' : ''}`}
                >
                  
                  {/* Card Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container dark:bg-zinc-950 flex items-center justify-center text-primary-container">
                          {isPdf ? (
                            <FilePdf size={22} weight="fill" className="text-primary" />
                          ) : (
                            <BookOpen size={22} weight="fill" className="text-secondary" />
                          )}
                        </div>

                        {/* Status tag */}
                        <div className="flex gap-1.5 items-center">
                          {isAvailable && (
                            <span className="px-2 py-0.5 bg-[#e2f0d9] text-[#2e5e1b] font-label-caps text-[9px] rounded flex items-center gap-1 border border-[#c1dfb3]">
                              <CheckCircle size={10} weight="fill" />
                              <span>Available</span>
                            </span>
                          )}
                          {isReserved && (
                            <span className="px-2 py-0.5 bg-[#fcf0e3] text-[#8a5b28] font-label-caps text-[9px] rounded flex items-center gap-1 border border-[#f5dab8]">
                              <BookmarkSimple size={10} weight="fill" />
                              <span>Reserved</span>
                            </span>
                          )}
                          {isMaintenance && (
                            <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant font-label-caps text-[9px] rounded flex items-center gap-1 border border-outline-variant">
                              <Wrench size={10} weight="fill" />
                              <span>Corrupt File</span>
                            </span>
                          )}
                          
                          {/* Visibility badge for staff review */}
                          {role === 'staff' && (
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${res.isPublic ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-500'}`}>
                              {res.isPublic ? 'Public' : 'Private'}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-h3 text-sm text-on-background font-bold mb-1 leading-snug line-clamp-2">
                        {res.title}
                      </h3>
                      <p className="font-meta text-[10px] text-on-surface-variant font-medium mb-3">
                        {res.author}
                      </p>
                      
                      {/* Tags chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {res.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-surface-container dark:bg-zinc-800 text-on-surface-variant text-[9px] rounded-md font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-parchment/60 dark:border-zinc-800 flex justify-between items-center text-[10px] text-outline font-medium">
                      <span>Added: {res.addedDate}</span>
                      <span>{res.format} • {res.fileSize}</span>
                    </div>

                  </div>

                  {/* Staff action overlay drawer (visible on hover) */}
                  {role === 'staff' && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-md border border-border-parchment dark:border-zinc-800 p-1 flex gap-1 z-10 translate-y-[-5px] group-hover:translate-y-0 duration-200">
                      <button
                        onClick={() => toggleResourceVisibility(res.id)}
                        className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container dark:hover:bg-zinc-800"
                        title={res.isPublic ? "Make resource Private" : "Make resource Public"}
                      >
                        {res.isPublic ? <EyeSlash size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => deleteResource(res.id)}
                        className="p-1 text-on-surface-variant hover:text-error rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Delete digital record"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  )}

                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Load more triggers */}
        {filteredResources.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button className="px-5 py-2 border border-border-parchment dark:border-zinc-800 bg-white dark:bg-zinc-900 text-on-surface-variant hover:text-primary hover:border-primary transition-all rounded-full font-semibold text-xs">
              Load More Resources
            </button>
          </div>
        )}
      </main>

      {/* STAFF UPLOAD MODAL */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-[#1d1b18]/65 backdrop-blur-[3px]"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-parchment dark:border-zinc-800 shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90dvh]"
            >
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-border-parchment dark:border-zinc-800 flex justify-between items-center bg-surface-bright dark:bg-zinc-950 rounded-t-2xl">
                <div>
                  <h2 className="font-h3 text-xl text-on-background font-bold">Upload Digital Resource</h2>
                  <p className="font-meta text-[10px] text-on-surface-variant font-medium mt-0.5">
                    Add new manuscripts, EPUBs, or journals to the repository.
                  </p>
                </div>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 text-outline hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-grow">
                
                {/* Drag and Drop Zone */}
                <div 
                  onClick={triggerMockFileSelect}
                  onDragOver={(e) => { e.preventDefault(); setMockDragActive(true); }}
                  onDragLeave={() => setMockDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setMockDragActive(false); triggerMockFileSelect(); }}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    mockDragActive 
                      ? 'border-primary bg-primary/5' 
                      : uploadedFile 
                      ? 'border-emerald-500 bg-emerald-500/5'
                      : 'border-outline-variant hover:bg-surface-container-low dark:hover:bg-zinc-950/40'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    uploadedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'
                  }`}>
                    <CloudArrowUp size={28} />
                  </div>
                  {uploadedFile ? (
                    <div>
                      <p className="font-semibold text-emerald-600 mb-0.5 truncate max-w-[250px]">{uploadedFile.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-mono">{uploadedFile.size} • Ready</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-on-background mb-0.5">Drag &amp; drop files here</p>
                      <p className="text-[10px] text-on-surface-variant mb-3">or click to browse (PDF, EPUB, max 50MB)</p>
                      <button 
                        type="button"
                        className="px-3 py-1.5 bg-background dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg text-on-surface-variant font-bold hover:text-primary transition-all text-[10px] uppercase tracking-wider"
                      >
                        Browse Files
                      </button>
                    </div>
                  )}
                </div>

                {/* Text Metadata Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold mb-1.5">Resource Title *</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter title"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="form-input-custom"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold mb-1.5">Author / Creator</label>
                      <input
                        type="text"
                        placeholder="e.g., J. Smith"
                        value={newAuthor}
                        onChange={e => setNewAuthor(e.target.value)}
                        className="form-input-custom"
                      />
                    </div>
                  </div>

                  {/* Format select */}
                  <div>
                    <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold mb-1.5">File Format</label>
                    <div className="flex bg-surface-container dark:bg-zinc-950 p-1 rounded-lg w-44">
                      <button
                        type="button"
                        onClick={() => setFileFormat('PDF')}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                          fileFormat === 'PDF' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-on-surface-variant'
                        }`}
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileFormat('EPUB')}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                          fileFormat === 'EPUB' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-on-surface-variant'
                        }`}
                      >
                        EPUB
                      </button>
                    </div>
                  </div>

                  {/* Tags suggest section */}
                  <div>
                    <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold mb-1.5">Category / Tags</label>
                    <div className="relative flex gap-2">
                      <div className="relative flex-grow">
                        <Tag size={16} className="absolute left-3 top-3 text-on-surface-variant" />
                        <input
                          type="text"
                          placeholder="Add tag..."
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="form-input-custom pl-10"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-surface-container dark:bg-zinc-800 border border-border-parchment dark:border-zinc-700 px-4 rounded-lg font-bold hover:text-primary transition-all text-[10px] uppercase"
                      >
                        Add
                      </button>
                    </div>

                    {/* Active tags */}
                    {newTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {newTags.map(t => (
                          <span 
                            key={t} 
                            onClick={() => handleRemoveTag(t)}
                            className="px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-md font-semibold cursor-pointer hover:bg-primary/20 flex items-center gap-1"
                          >
                            <span>{t}</span>
                            <X size={10} weight="bold" />
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pre-suggested tags */}
                    <div className="mt-3">
                      <p className="text-[10px] text-on-surface-variant font-bold mb-1.5">Suggested Tags:</p>
                      <div className="flex gap-2">
                        {['Philosophy', 'Science', 'Physics', 'History', 'Engineering'].map(sTag => (
                          <button
                            type="button"
                            key={sTag}
                            onClick={() => handleSuggestTag(sTag)}
                            className="px-2.5 py-1 bg-secondary-fixed-dim/20 text-on-secondary-container rounded-md font-bold border border-secondary-fixed-dim hover:bg-secondary-fixed-dim/40 transition-colors"
                          >
                            {sTag} +
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Public visibility toggle */}
                  <div className="pt-4 border-t border-border-parchment dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-on-background">Public Visibility</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Allow students to view and download this digital resource.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={isPublic} 
                        onChange={e => setIsPublic(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-border-parchment dark:border-zinc-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 hover:bg-surface-container dark:hover:bg-zinc-800 font-bold rounded-lg transition-colors text-[10px] uppercase tracking-wider text-on-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container font-bold rounded-lg transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-wider shadow-md"
                  >
                    <CheckCircle size={14} weight="bold" />
                    <span>Upload &amp; Save</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
