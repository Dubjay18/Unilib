import React from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  Warning, 
  CheckCircle, 
  CalendarBlank, 
  ArrowRight, 
  DownloadSimple
} from '@phosphor-icons/react'

export const LoansFinesScreen: React.FC = () => {
  const {
    loans,
    loanHistory,
    fines,
    totalFines,
    renewLoan,
    payFinesWithPaystack,
    isRenewingLoan,
    renewingLoanId,
    isPayingFines
  } = useLibrary()

  const handleRenew = (loanId: string) => {
    renewLoan(loanId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-2">My Loans &amp; Fines</h1>
        <p className="font-body-lg text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Manage your current physical materials, track due dates, and settle outstanding balances.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Active checkouts & History */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Active Loans */}
          <section>
            <div className="flex justify-between items-end mb-6 border-b border-border-parchment dark:border-zinc-800 pb-2">
              <h2 className="font-h2 text-base md:text-lg text-on-surface font-bold">Active Loans</h2>
              <span className="font-meta text-xs text-on-surface-variant font-semibold">
                {loans.length} Items Checked Out
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loans.map(loan => {
                const isDueSoon = loan.status === 'due-soon'
                const isOverdue = loan.status === 'overdue'
                
                return (
                  <article 
                    key={loan.id}
                    className={`bg-white dark:bg-zinc-900 rounded-xl p-5 border border-border-parchment dark:border-zinc-800 relative overflow-hidden academic-lift flex flex-col justify-between pl-[22px] ${
                      isDueSoon ? 'accent-bar-amber' : isOverdue ? 'accent-bar-red' : 'accent-bar-green'
                    }`}
                  >
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      {isDueSoon && (
                        <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                          <Warning size={12} weight="fill" />
                          <span>Due Soon</span>
                        </span>
                      )}
                      {isOverdue && (
                        <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 border border-rose-200 dark:border-rose-900 rounded px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                          <Warning size={12} weight="fill" />
                          <span>Overdue</span>
                        </span>
                      )}
                      {loan.status === 'on-track' && (
                        <span className="bg-[#e2f0d9] dark:bg-emerald-950/20 text-[#005323] dark:text-emerald-400 border border-[#b2d8a3] dark:border-emerald-900 rounded px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                          <CheckCircle size={12} weight="fill" />
                          <span>On Track</span>
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 mb-4">
                      {/* Cover Mock */}
                      <div className="w-16 h-24 bg-surface-container dark:bg-zinc-950 rounded overflow-hidden border border-border-parchment/60 dark:border-zinc-800 shrink-0">
                        {loan.coverUrl ? (
                          <img 
                            className="w-full h-full object-cover" 
                            alt={loan.coverAlt} 
                            src={loan.coverUrl} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-outline">
                            <CalendarBlank size={32} />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-body-lg text-xs md:text-sm font-bold text-on-surface leading-tight mb-1 truncate">
                            {loan.title}
                          </h3>
                          <p className="font-meta text-[10px] text-on-surface-variant font-medium">
                            {loan.author}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="font-meta text-[9px] text-outline uppercase tracking-wider font-bold">Due Date</p>
                          <p className={`font-body-md text-xs font-semibold flex items-center gap-1 ${isDueSoon || isOverdue ? 'text-rose-600' : 'text-on-surface'}`}>
                            <CalendarBlank size={14} />
                            <span>{loan.dueDate}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-border-parchment/60 dark:border-zinc-800 flex gap-2">
                      <button
                        onClick={() => handleRenew(loan.id)}
                        disabled={isOverdue || isRenewingLoan}
                        className={`flex-grow py-2 text-center border rounded font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                          isOverdue 
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border-zinc-200 cursor-not-allowed'
                            : 'bg-white dark:bg-zinc-900 border-border-parchment dark:border-zinc-700 text-on-surface hover:bg-surface-container dark:hover:bg-zinc-850 disabled:opacity-50'
                        }`}
                      >
                        {isRenewingLoan && renewingLoanId === loan.id ? (
                          <>
                            <span className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                            <span>Renewing...</span>
                          </>
                        ) : (
                          <span>Renew</span>
                        )}
                      </button>
                      <button
                        disabled
                        className="py-2 px-3 border border-border-parchment/50 dark:border-zinc-850 rounded text-on-surface-variant opacity-50 cursor-not-allowed font-bold text-[10px] uppercase tracking-wider"
                      >
                        Details
                      </button>
                    </div>

                  </article>
                )
              })}
            </div>
          </section>

          {/* Loan History log */}
          <section>
            <div className="flex justify-between items-end mb-6 border-b border-border-parchment dark:border-zinc-800 pb-2">
              <h2 className="font-h2 text-base md:text-lg text-on-surface font-bold">Loan History</h2>
              <button 
                onClick={() => alert('Simulating History Export! CSV successfully compiled and downloaded.')}
                className="font-meta text-xs text-primary hover:underline flex items-center gap-1 font-bold"
              >
                <DownloadSimple size={14} weight="bold" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-surface-container-low dark:bg-zinc-950 border-b border-border-parchment dark:border-zinc-800 font-label-caps text-[10px] text-on-surface-variant font-bold">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4 hidden sm:table-cell">Author</th>
                      <th className="p-4">Returned</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-parchment/50 dark:divide-zinc-800 text-on-surface">
                    {loanHistory.map(history => (
                      <tr key={history.id} className="hover:bg-surface-bright dark:hover:bg-zinc-850 transition-colors">
                        <td className="p-4 font-bold">
                          <p>{history.title}</p>
                          <p className="text-[10px] text-on-surface-variant sm:hidden font-medium mt-0.5">{history.author}</p>
                        </td>
                        <td className="p-4 hidden sm:table-cell text-on-surface-variant font-medium">{history.author}</td>
                        <td className="p-4 font-medium">{history.returnedDate}</td>
                        <td className="p-4 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            history.status === 'Returned On Time'
                              ? 'bg-[#e2f0d9] dark:bg-emerald-950/20 text-[#005323] dark:text-emerald-400'
                              : history.status === 'Late (Paid)'
                              ? 'bg-[#fef3c7] dark:bg-amber-950/20 text-[#92400e] dark:text-amber-400'
                              : 'bg-[#fce8e6] dark:bg-rose-950/20 text-[#ba1a1a] dark:text-rose-450'
                          }`}>
                            {history.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Fines & Itemized Billing */}
        <div className="lg:col-span-1">
          <section className="sticky top-24">
            
            <div className="flex justify-between items-end mb-6 border-b border-border-parchment dark:border-zinc-800 pb-2">
              <h2 className="font-h2 text-base md:text-lg text-on-surface font-bold">My Fines</h2>
            </div>

            {/* Total Balance Card */}
            <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
              <div className="accent-bar accent-bar-red w-1.5"></div>
              
              {/* Slip pattern */}
              <div className="bg-surface-container-low dark:bg-zinc-950/40 p-6 fine-slip-pattern border-b border-border-parchment/60 dark:border-zinc-800/80 pl-8">
                <p className="font-label-caps text-[10px] text-on-surface-variant font-bold mb-1">
                  Total Outstanding Balance
                </p>
                
                {/* Naira Currency Mock */}
                <h3 className="font-[Fraunces] text-4xl text-rose-600 dark:text-rose-400 font-bold flex items-baseline tracking-tight">
                  <span className="text-2xl mr-1 font-serif opacity-80">₦</span>
                  <span>{totalFines.toLocaleString()}</span>
                </h3>
                
                {totalFines > 0 && (
                  <p className="font-meta text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-2.5 flex items-center gap-1">
                    <Warning size={14} weight="fill" />
                    <span>Accruing at ₦50/day per late item</span>
                  </p>
                )}
              </div>

              {/* Itemized Charges */}
              <div className="p-6 pl-8">
                <h4 className="font-label-caps text-[10px] text-on-surface-variant font-bold mb-4">Itemized Charges</h4>
                
                {fines.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle size={28} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-on-surface font-bold">No Outstanding Fees</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Your balance is completely settled.</p>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-4 mb-8 text-xs">
                      {fines.map(fine => (
                        <li key={fine.id} className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-none last:pb-0">
                          <div>
                            <p className="font-bold text-on-surface">{fine.type}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{fine.details}</p>
                          </div>
                          <span className="font-bold text-on-surface">₦{fine.amount.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Pay Button */}
                    <button
                      onClick={payFinesWithPaystack}
                      disabled={isPayingFines}
                      className="w-full bg-[#09A5DB] hover:bg-[#0785B0] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-xs uppercase tracking-wider hover:scale-[0.99] disabled:opacity-50"
                    >
                      {isPayingFines ? (
                        <>
                          <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Initializing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay with Paystack</span>
                          <ArrowRight size={14} weight="bold" />
                        </>
                      )}
                    </button>
                    <p className="font-meta text-[9px] text-center text-outline dark:text-zinc-500 mt-3 font-medium">
                      Secure payment gateway integration
                    </p>
                  </>
                )}
              </div>

            </div>

          </section>
        </div>

      </div>



    </div>
  )
}
