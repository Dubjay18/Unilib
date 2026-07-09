import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { useNavigate } from 'react-router-dom'
import { 
  Warning, 
  Check, 
  X, 
  Book, 
  List, 
  FileText,
  ArrowsClockwise,
  CalendarBlank,
  User,
  CheckCircle
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export const StaffPortalScreen: React.FC = () => {
  const {
    approvals,
    lowStockAlerts,
    approveRequest,
    rejectRequest,
    orderRestock,
    isApprovingRequest,
    approvingRequestId,
    isRejectingRequest,
    rejectingRequestId,
    isRestocking,
    restockingId,
    loans,
    books
  } = useLibrary()

  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false)
  const navigate = useNavigate()

  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [filterRequestType, setFilterRequestType] = useState<'all' | 'hold' | 'interlibrary'>('all')
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'faculty'>('all')
  const [filterStockCritical, setFilterStockCritical] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilterRequestType('all')
    setFilterRole('all')
    setFilterStockCritical(false)
    setSearchQuery('')
  }

  // Filtrations for alerts
  const filteredStockAlerts = lowStockAlerts.filter(alertItem => {
    const matchesSearch = alertItem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alertItem.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCritical = !filterStockCritical || alertItem.quantityLeft === 0;
    return matchesSearch && matchesCritical;
  })

  // Filtrations for approvals
  const filteredApprovals = approvals.filter(req => {
    const matchesSearch = req.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterRequestType === 'all' || 
                        (filterRequestType === 'hold' && req.type.toLowerCase().includes('hold')) ||
                        (filterRequestType === 'interlibrary' && req.type.toLowerCase().includes('interlibrary'));

    const matchesRole = filterRole === 'all' || 
                        (req.requesterRole.toLowerCase() === filterRole);

    return matchesSearch && matchesType && matchesRole;
  })

  // Helper to resolve book category/type details for a given loan title
  const getBookTypeForLoan = (loanTitle: string): 'standard' | 'reserve' => {
    const book = books.find(b => b.title.toLowerCase().trim() === loanTitle.toLowerCase().trim())
    if (book && book.type) {
      const typeLower = book.type.toLowerCase()
      if (typeLower.includes('reserve') || typeLower.includes('short term') || typeLower.includes('short-term')) {
        return 'reserve'
      }
    }
    return 'standard'
  }

  // Calculate active loans stats dynamically
  const totalActiveLoansCount = loans.length
  const overdueLoansCount = loans.filter(l => l.status === 'overdue').length
  const standardLoansCount = loans.filter(l => l.status !== 'overdue' && getBookTypeForLoan(l.title) === 'standard').length
  const reserveLoansCount = loans.filter(l => l.status !== 'overdue' && getBookTypeForLoan(l.title) === 'reserve').length

  const standardPercentage = totalActiveLoansCount > 0 ? (standardLoansCount / totalActiveLoansCount) * 100 : 0
  const reservePercentage = totalActiveLoansCount > 0 ? (reserveLoansCount / totalActiveLoansCount) * 100 : 0
  const overduePercentage = totalActiveLoansCount > 0 ? (overdueLoansCount / totalActiveLoansCount) * 100 : 0

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-parchment dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="font-h1 text-h1-mobile md:text-h1 text-on-background mb-2">Staff Operations</h1>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant">
            Manage requests, loans, and inventory across the system.
          </p>
        </div>

        {/* Search controls */}
        <div className="hidden sm:flex gap-3 w-full sm:w-auto relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-colors text-xs font-bold shadow-sm ${
              showFilters || filterRequestType !== 'all' || filterRole !== 'all' || filterStockCritical
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-white dark:bg-zinc-900 border-border-parchment dark:border-zinc-850 text-on-surface-variant hover:text-primary'
            }`}
          >
            <List size={14} />
            <span>Filter</span>
          </button>
          
          <input
            type="text"
            placeholder="Search records..."
            className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-48"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {/* Floating Filter Popover */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl shadow-xl p-4 z-30 space-y-4 text-xs font-semibold text-on-surface-variant"
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-850">
                  <span className="text-on-surface font-bold text-xs">Filter Operations</span>
                  <button 
                    onClick={handleResetFilters}
                    className="text-[10px] text-primary hover:underline font-bold uppercase"
                  >
                    Reset All
                  </button>
                </div>

                {/* Filter 1: Request Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Request Type</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['all', 'hold', 'interlibrary'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFilterRequestType(t)}
                        className={`py-1 px-1.5 text-[9px] uppercase tracking-wider rounded text-center transition-colors font-bold ${
                          filterRequestType === t
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container-low dark:bg-zinc-800 hover:bg-surface-container-high'
                        }`}
                      >
                        {t === 'interlibrary' ? 'ILL' : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 2: Requester Role */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-on-surface">Requester Role</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['all', 'student', 'faculty'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFilterRole(r)}
                        className={`py-1 px-1.5 text-[9px] uppercase tracking-wider rounded text-center transition-colors font-bold ${
                          filterRole === r
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container-low dark:bg-zinc-800 hover:bg-surface-container-high'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 3: Stock alert critical checkbox */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filterStockCritical}
                      onChange={(e) => setFilterStockCritical(e.target.checked)}
                      className="rounded text-primary focus:ring-primary bg-background border-border-parchment dark:border-zinc-700"
                    />
                    <span>Show Critical Stock Only (0 left)</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* LOW STOCK ALERTS SECTION */}
      <section className="mb-12">
        <h2 className="font-h3 text-base md:text-lg text-on-background mb-5 flex items-center gap-2 font-bold">
          <Warning size={20} className="text-rose-600 animate-pulse" />
          <span>Low Stock Alerts</span>
        </h2>

        {filteredStockAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStockAlerts.map(alertItem => {
              const isCritical = alertItem.quantityLeft === 0
              return (
                <article 
                  key={alertItem.id}
                  className="relative bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-5 pl-7 shadow-sm transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* Red warning border */}
                  <div className="accent-bar bg-rose-600"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-h3 text-xs md:text-sm font-bold text-on-surface line-clamp-1">
                        {alertItem.title}
                      </h3>
                      <p className="font-meta text-[10px] text-on-surface-variant font-medium mt-0.5">
                        {alertItem.author}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      isCritical 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {alertItem.quantityLeft} LEFT
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <button 
                      onClick={() => orderRestock(alertItem.id)}
                      disabled={isRestocking}
                      className="text-primary hover:text-primary-container disabled:opacity-50 text-[10px] font-bold tracking-wider hover:underline uppercase flex items-center gap-1"
                    >
                      {isRestocking && restockingId === alertItem.id ? (
                        <>
                          <span className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                          <span>Ordering...</span>
                        </>
                      ) : (
                        <>
                          <ArrowsClockwise size={12} weight="bold" />
                          <span>{alertItem.actionLabel}</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-850 rounded-xl text-on-surface-variant font-semibold text-xs shadow-sm">
            No low stock records match the specified search query or filters.
          </div>
        )}
      </section>

      {/* OPERATIONS QUEUE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Requests Queue list */}
        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-border-parchment dark:border-zinc-800 bg-surface-container-low dark:bg-zinc-950 flex justify-between items-center">
              <h2 className="font-h3 text-sm md:text-base text-on-background font-bold">Requests Queue</h2>
              <span className="font-meta text-[10px] bg-primary/10 text-primary dark:text-primary-fixed-dim px-2.5 py-0.5 rounded-full font-bold">
                {filteredApprovals.length} Pending
              </span>
            </div>

            <ul className="divide-y divide-border-parchment/60 dark:divide-zinc-800">
              <AnimatePresence initial={false}>
                {filteredApprovals.slice(0, 5).map(req => (
                  <motion.li
                    key={req.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 flex justify-between items-center hover:bg-surface-bright dark:hover:bg-zinc-850 transition-colors">
                      <div className="flex gap-3 items-center min-w-0">
                        {/* Requester Initials Badge */}
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          {req.requesterInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body-md text-xs font-bold text-on-background truncate">
                            {req.type}
                          </p>
                          <p className="font-meta text-[10px] text-on-surface-variant truncate mt-0.5">
                            Requested by: {req.requesterName} ({req.requesterRole}) • '{req.bookTitle}'
                          </p>
                        </div>
                      </div>

                      {/* Approval triggers */}
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button
                          onClick={() => approveRequest(req.id)}
                          disabled={isApprovingRequest || isRejectingRequest}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#e2f0d9] hover:bg-[#c3e6cb] text-[#005323] disabled:opacity-50 transition-colors"
                          title="Approve Loan Request"
                        >
                          {isApprovingRequest && approvingRequestId === req.id ? (
                            <span className="h-3.5 w-3.5 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin"></span>
                          ) : (
                            <Check size={14} weight="bold" />
                          )}
                        </button>
                        <button
                          onClick={() => rejectRequest(req.id)}
                          disabled={isApprovingRequest || isRejectingRequest}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#fce8e6] hover:bg-[#f5b8b3] text-[#ba1a1a] disabled:opacity-50 transition-colors"
                          title="Deny Hold Request"
                        >
                          {isRejectingRequest && rejectingRequestId === req.id ? (
                            <span className="h-3.5 w-3.5 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin"></span>
                          ) : (
                            <X size={14} weight="bold" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>

              {filteredApprovals.length === 0 && (
                <div className="text-center py-10 text-on-surface-variant">
                  <p className="text-xs font-bold">No Pending Requests</p>
                  <p className="text-[10px] mt-0.5">The staff approval queue is empty or filtered out.</p>
                </div>
              )}
            </ul>
          </div>

          <div className="p-4 border-t border-border-parchment dark:border-zinc-800 text-center">
            <button 
              onClick={() => setIsRequestsModalOpen(true)}
              className="text-primary font-bold text-[10px] uppercase tracking-wider hover:underline cursor-pointer"
            >
              View All Requests
            </button>
          </div>
        </section>

        {/* Active Loans Progress bars */}
        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-border-parchment dark:border-zinc-800 bg-surface-container-low dark:bg-zinc-950 flex justify-between items-center">
              <h2 className="font-h3 text-sm md:text-base text-on-background font-bold">Active Loans Overview</h2>
              <Book size={20} className="text-primary" />
            </div>

            <div className="p-6 space-y-5 text-xs font-semibold text-on-background">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span>Standard Loans</span>
                  <span className="font-mono font-bold">{standardLoansCount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-surface-container dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${standardPercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span>Short Term Reserve</span>
                  <span className="font-mono font-bold">{reserveLoansCount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-surface-container dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${reservePercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-rose-600 dark:text-rose-450">Overdue</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-450">{overdueLoansCount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-surface-container dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full transition-all duration-500" style={{ width: `${overduePercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border-parchment dark:border-zinc-800 bg-surface-bright dark:bg-zinc-950/45">
            <button 
              onClick={() => navigate('/staff/circulation')}
              className="w-full flex items-center justify-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-wider hover:underline cursor-pointer"
            >
              <FileText size={16} />
              <span>Manage Loans</span>
            </button>
          </div>
        </section>

      </div>

      {/* Detailed Requests Modal */}
      <AnimatePresence>
        {isRequestsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestsModalOpen(false)}
              className="absolute inset-0 bg-[#1d1b18]/60 backdrop-blur-[2px]"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-border-parchment dark:border-zinc-800 shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="bg-primary text-on-primary px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-h3 text-sm md:text-base font-bold uppercase tracking-wider text-white">Detailed Request Queue</h3>
                  <p className="text-[10px] text-white/80 font-medium mt-0.5">
                    Review, approve, or deny all pending checkout requests.
                  </p>
                </div>
                <button
                  onClick={() => setIsRequestsModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* List */}
              <div className="overflow-y-auto p-6 space-y-4 flex-1">
                {filteredApprovals.length > 0 ? (
                  <div className="divide-y divide-border-parchment/65 dark:divide-zinc-800">
                    {filteredApprovals.map(req => {
                      const isPendingApprove = isApprovingRequest && approvingRequestId === req.id
                      const isPendingReject = isRejectingRequest && rejectingRequestId === req.id

                      return (
                        <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-surface-bright dark:hover:bg-zinc-850/30 px-3 rounded-lg transition-colors">
                          <div className="flex gap-3 items-start min-w-0">
                            {/* Initials Badge */}
                            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0 shadow-sm mt-0.5">
                              {req.requesterInitials}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-on-background leading-tight flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-on-surface">{req.requesterName}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-container-highest dark:bg-zinc-850 text-on-surface-variant uppercase font-extrabold tracking-wider">{req.requesterRole}</span>
                              </h4>
                              <p className="font-semibold text-xs text-primary mt-1.5 flex items-center gap-1 flex-wrap">
                                <Book size={14} className="text-on-surface-variant" />
                                <span>{req.bookTitle}</span>
                              </p>
                              
                              {/* Request Metadata Details */}
                              <div className="flex flex-wrap gap-4 mt-2 font-meta text-[10px] text-on-surface-variant font-semibold">
                                <span className="flex items-center gap-1">
                                  <User size={12} />
                                  Qty: {req.quantity || 1}
                                </span>
                                {req.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <CalendarBlank size={12} />
                                    Requested Due: {req.dueDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Approval / Rejection buttons */}
                          <div className="flex gap-2 sm:self-center self-end shrink-0">
                            <button
                              onClick={() => approveRequest(req.id)}
                              disabled={isApprovingRequest || isRejectingRequest}
                              className="bg-[#e2f0d9] hover:bg-[#c3e6cb] text-[#005323] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer shadow-sm animate-none"
                            >
                              {isPendingApprove ? (
                                <span className="h-3 w-3 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin"></span>
                              ) : (
                                <Check size={12} weight="bold" />
                              )}
                              <span>Approve</span>
                            </button>
                            
                            <button
                              onClick={() => rejectRequest(req.id)}
                              disabled={isApprovingRequest || isRejectingRequest}
                              className="bg-[#fce8e6] hover:bg-[#f5b8b3] text-[#ba1a1a] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer shadow-sm animate-none"
                            >
                              {isPendingReject ? (
                                <span className="h-3 w-3 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin"></span>
                              ) : (
                                <X size={12} weight="bold" />
                              )}
                              <span>Deny</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-on-surface-variant font-semibold text-xs">
                    <CheckCircle size={36} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-on-surface font-bold text-sm">No Pending Requests</p>
                    <p className="mt-1">The staff approval queue is empty or matches no filters.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border-parchment dark:border-zinc-800 bg-surface-bright dark:bg-zinc-950/45 text-right">
                <button
                  onClick={() => setIsRequestsModalOpen(false)}
                  className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface font-bold py-2 px-4 rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
