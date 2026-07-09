import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  Warning, 
  CheckCircle, 
  CalendarBlank, 
  ArrowsClockwise,
  MagnifyingGlass,
  User,
  Book,
  Funnel
} from '@phosphor-icons/react'

export const CirculationScreen: React.FC = () => {
  const {
    loans,
    returnBook,
    isReturningBook,
    returningBookId
  } = useLibrary()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-track' | 'due-soon' | 'overdue'>('all')

  // Filter active loans
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loan.borrowerName && loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = 
      statusFilter === 'all' || 
      loan.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalLoansCount = loans.length
  const overdueCount = loans.filter(l => l.status === 'overdue').length
  const dueSoonCount = loans.filter(l => l.status === 'due-soon').length
  const onTrackCount = loans.filter(l => l.status === 'on-track').length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-parchment dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="font-h1 text-h1-mobile md:text-h1 text-on-background mb-2">Book Circulation</h1>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant">
            Register returns, check outstanding loans, and manage circulation activity across all student accounts.
          </p>
        </div>
      </header>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Total Active Loans</p>
          <p className="font-[Fraunces] text-2xl font-bold text-on-surface mt-1">{totalLoansCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <div className="accent-bar bg-rose-600"></div>
          <p className="text-[10px] text-rose-650 dark:text-rose-450 font-bold uppercase tracking-wider pl-2">Overdue</p>
          <p className="font-[Fraunces] text-2xl font-bold text-rose-650 dark:text-rose-450 mt-1 pl-2">{overdueCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <div className="accent-bar bg-amber-500"></div>
          <p className="text-[10px] text-amber-650 dark:text-amber-400 font-bold uppercase tracking-wider pl-2">Due Soon</p>
          <p className="font-[Fraunces] text-2xl font-bold text-amber-650 dark:text-amber-450 mt-1 pl-2">{dueSoonCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <div className="accent-bar bg-emerald-600"></div>
          <p className="text-[10px] text-emerald-750 dark:text-emerald-400 font-bold uppercase tracking-wider pl-2">On Track</p>
          <p className="font-[Fraunces] text-2xl font-bold text-emerald-750 dark:text-emerald-450 mt-1 pl-2">{onTrackCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white dark:bg-zinc-900 p-4 border border-border-parchment dark:border-zinc-800 rounded-xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <MagnifyingGlass size={16} className="absolute left-3 top-3 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by book title or borrower name..."
            className="form-input-custom pl-10 text-xs py-2.5 font-semibold placeholder:font-medium"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant mr-1 flex items-center gap-1">
            <Funnel size={12} />
            Filter status:
          </span>
          {(['all', 'on-track', 'due-soon', 'overdue'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`py-1.5 px-3 text-[10px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-white dark:bg-zinc-900 border-border-parchment dark:border-zinc-800 text-on-surface hover:bg-surface-container dark:hover:bg-zinc-800'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Circulation Table / List */}
      <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {filteredLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-surface-container-low dark:bg-zinc-950 border-b border-border-parchment dark:border-zinc-800 font-label-caps text-[10px] text-on-surface-variant font-bold">
                <tr>
                  <th className="p-4 pl-6">Book Title</th>
                  <th className="p-4">Borrower</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-parchment/50 dark:divide-zinc-800 text-on-surface font-semibold">
                {filteredLoans.map(loan => {
                  const isOverdue = loan.status === 'overdue'
                  const isDueSoon = loan.status === 'due-soon'
                  const isPendingReturn = isReturningBook && returningBookId === loan.id

                  return (
                    <tr key={loan.id} className="hover:bg-surface-bright dark:hover:bg-zinc-850/50 transition-colors">
                      {/* Book Cover & Info */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-surface-container dark:bg-zinc-950 rounded border border-border-parchment/50 dark:border-zinc-850 shrink-0 overflow-hidden">
                            {loan.coverUrl ? (
                              <img src={loan.coverUrl} alt={loan.coverAlt} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-outline">
                                <Book size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-on-surface leading-tight truncate max-w-xs md:max-w-md">{loan.title}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{loan.author}</p>
                          </div>
                        </div>
                      </td>

                      {/* Borrower */}
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-on-surface-variant" />
                          <span>{loan.borrowerName || 'Unknown Student'}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          <CalendarBlank size={14} className="text-on-surface-variant" />
                          <span className={isOverdue || isDueSoon ? 'text-rose-650 font-bold' : ''}>{loan.dueDate}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        {isOverdue && (
                          <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded px-2 py-0.5 text-[9px] font-bold inline-flex items-center gap-1">
                            <Warning size={10} weight="fill" />
                            <span>Overdue</span>
                          </span>
                        )}
                        {isDueSoon && (
                          <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded px-2 py-0.5 text-[9px] font-bold inline-flex items-center gap-1">
                            <Warning size={10} weight="fill" />
                            <span>Due Soon</span>
                          </span>
                        )}
                        {loan.status === 'on-track' && (
                          <span className="bg-[#e2f0d9] dark:bg-emerald-950/20 text-[#005323] dark:text-emerald-400 border border-[#b2d8a3] dark:border-emerald-900 rounded px-2 py-0.5 text-[9px] font-bold inline-flex items-center gap-1">
                            <CheckCircle size={10} weight="fill" />
                            <span>On Track</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => returnBook(loan.id)}
                          disabled={isReturningBook}
                          className="bg-primary hover:bg-primary-container text-on-primary font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                        >
                          {isPendingReturn ? (
                            <>
                              <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Returning...</span>
                            </>
                          ) : (
                            <>
                              <ArrowsClockwise size={12} weight="bold" />
                              <span>Register Return</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant font-semibold text-xs p-6">
            <CheckCircle size={36} className="text-emerald-500 mx-auto mb-2" />
            <p className="text-on-surface font-bold text-sm">No Active Circulation Records</p>
            <p className="mt-1">All books have been returned or no records match the filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
