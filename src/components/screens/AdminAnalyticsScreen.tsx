import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  BookOpen, 
  TrendUp, 
  TrendDown, 
  Warning, 
  Coins, 
  DownloadSimple, 
  Sparkle 
} from '@phosphor-icons/react'

export const AdminAnalyticsScreen: React.FC = () => {
  const { analyticsMetrics } = useLibrary()
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dailyLoans = [400, 600, 850, 500, 700, 900, 650] // Mock data mapped to chart heights

  const topBooks = [
    { rank: 1, title: 'Principles of Mathematical Analysis', author: 'Walter Rudin', dept: 'Mathematics', loans: '1,204', status: 'Waitlisted (12)', isWaitlist: true },
    { rank: 2, title: 'Molecular Biology of the Cell', author: 'Bruce Alberts et al.', dept: 'Biology', loans: '982', status: 'Available', isWaitlist: false },
    { rank: 3, title: 'A History of Western Philosophy', author: 'Bertrand Russell', dept: 'Philosophy', loans: '845', status: 'Available', isWaitlist: false },
    { rank: 4, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', dept: 'Computer Science', loans: '790', status: 'Waitlisted (3)', isWaitlist: true }
  ]

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border-parchment dark:border-zinc-800 pb-6 transition-colors">
        <div>
          <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-1">System Analytics</h1>
          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant">
            Overview of Campus Shelf metrics, circulation trends, and department usage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-lg px-4 py-2 text-xs font-semibold text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary shadow-sm">
            <option>Last 30 Days</option>
            <option>This Semester</option>
            <option>Academic Year</option>
          </select>
          <button 
            onClick={() => alert('Compiling system analytics. PDF summary queued for download.')}
            className="bg-surface-container dark:bg-zinc-800 border border-border-parchment dark:border-zinc-700 text-on-surface-variant hover:text-primary p-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center"
            title="Download Reports"
          >
            <DownloadSimple size={16} weight="bold" />
          </button>
        </div>
      </header>

      {/* METRIC CARDS BENTO GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card 1: Total Catalog Items */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-5 metric-shadow card-hover relative pl-7">
          <div className="accent-bar bg-primary"></div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant font-bold">Total Catalogue Items</h3>
            <span className="p-1.5 bg-primary/10 text-primary rounded flex items-center justify-center">
              <BookOpen size={16} weight="fill" />
            </span>
          </div>
          <div className="font-metrics text-4xl font-semibold text-on-background mb-1.5 tracking-tight">
            {analyticsMetrics.totalItems}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold">
            <TrendUp size={12} weight="bold" />
            <span>+2.4% from last month</span>
          </div>
        </div>

        {/* Card 2: Active Loans */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-5 metric-shadow card-hover relative pl-7">
          <div className="accent-bar bg-primary"></div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant font-bold">Active Loans</h3>
            <span className="p-1.5 bg-primary/10 text-primary rounded flex items-center justify-center">
              <Sparkle size={16} weight="fill" />
            </span>
          </div>
          <div className="font-metrics text-4xl font-semibold text-on-background mb-1.5 tracking-tight">
            {analyticsMetrics.activeLoansCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold">
            <TrendUp size={12} weight="bold" />
            <span>+12% seasonal peak</span>
          </div>
        </div>

        {/* Card 3: Overdue Fines */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-5 metric-shadow card-hover relative pl-7">
          <div className="accent-bar bg-rose-600"></div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant font-bold">Overdue Items</h3>
            <span className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded flex items-center justify-center">
              <Warning size={16} weight="fill" />
            </span>
          </div>
          <div className="font-metrics text-4xl font-semibold text-rose-600 dark:text-rose-450 mb-1.5 tracking-tight">
            {analyticsMetrics.overdueItemsCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
            <TrendDown size={12} weight="bold" />
            <span>Requires prompt attention</span>
          </div>
        </div>

        {/* Card 4: Fines Tallied */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-5 metric-shadow card-hover relative pl-7">
          <div className="accent-bar bg-primary"></div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant font-bold">Fines Collected</h3>
            <span className="p-1.5 bg-primary/10 text-primary rounded flex items-center justify-center">
              <Coins size={16} weight="fill" />
            </span>
          </div>
          <div className="font-metrics text-4xl font-semibold text-on-background mb-1.5 tracking-tight">
            {analyticsMetrics.finesCollected}
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant text-[10px] font-bold">
            <span>Stable trajectory</span>
          </div>
        </div>

      </section>

      {/* CHARTS CONTAINER GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Trend Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 lg:col-span-2 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-sm md:text-base text-on-background font-bold">Borrowing Trends</h3>
            <button className="text-primary hover:underline text-xs font-semibold">View Full Report</button>
          </div>
          
          {/* Faux Interactive CSS Bar Chart */}
          <div className="relative flex-grow flex flex-col justify-end">
            
            {/* Tooltip Overlay */}
            {hoveredBarIndex !== null && (
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-zinc-950 text-white px-3 py-1.5 rounded-lg text-[10px] shadow-lg flex items-center gap-1.5 border border-zinc-800 z-10 animate-fade-in"
                style={{ top: '-15px' }}
              >
                <Sparkle size={10} weight="fill" className="text-amber-300" />
                <span>{weekdays[hoveredBarIndex]}: <b>{dailyLoans[hoveredBarIndex]} borrows</b></span>
              </div>
            )}

            <div className="w-full min-h-[250px] chart-placeholder rounded-lg flex items-end px-4 pt-8 pb-4 gap-3 border-b-2 border-l-2 border-border-parchment dark:border-zinc-800">
              {analyticsMetrics.borrowingTrends.map((val, idx) => {
                const isHighlight = val === 85 || val === 90 // Peak highlights
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    style={{ height: `${val}%` }}
                    className={`flex-1 rounded-t-md transition-all duration-300 cursor-pointer ${
                      isHighlight
                        ? 'bg-primary shadow-[0_0_15px_rgba(91,3,9,0.3)] hover:opacity-90'
                        : 'bg-secondary-container dark:bg-zinc-800 hover:bg-secondary dark:hover:bg-zinc-700'
                    }`}
                  />
                )
              })}
            </div>
          </div>
          <div className="flex justify-between px-4 mt-2 font-mono text-[10px] text-outline dark:text-zinc-500 font-bold">
            {weekdays.map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Conic Gradient Category Usage Donut Widget */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="font-h3 text-sm md:text-base text-on-background font-bold mb-6">Category Usage</h3>
          
          <div className="flex-grow flex items-center justify-center relative my-4">
            {/* Conic Gradient circle */}
            <div 
              className="w-44 h-44 rounded-full border-4 border-white dark:border-zinc-900 shadow-sm"
              style={{
                background: 'conic-gradient(#5b0309 0% 35%, #4059aa 35% 65%, #ddc0bd 65% 85%, #e7e1dc 85% 100%)'
              }}
            />
            {/* Donut Inner Hole */}
            <div className="absolute w-24 h-24 bg-white dark:bg-zinc-900 rounded-full shadow-inner flex items-center justify-center flex-col">
              <span className="font-meta text-[10px] text-on-surface-variant font-bold">Top Segment</span>
              <span className="font-metrics text-base font-bold text-primary dark:text-primary-fixed-dim">Sci / Tech</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs font-semibold text-on-surface-variant">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span>Science &amp; Tech</span>
              </span>
              <span>35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span>Humanities</span>
              </span>
              <span>30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                <span>Periodicals</span>
              </span>
              <span>20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-surface-container dark:bg-zinc-800 border border-border-parchment dark:border-zinc-700"></span>
                <span>Rare Books</span>
              </span>
              <span>15%</span>
            </div>
          </div>
        </div>

      </section>

      {/* MOST BORROWED TABLE SECTION */}
      <section className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border-parchment dark:border-zinc-800 flex justify-between items-center bg-surface-container-low dark:bg-zinc-950">
          <h3 className="font-h3 text-sm md:text-base text-on-background font-bold">Most Borrowed Titles</h3>
          <button 
            onClick={() => alert('YTD Popularity Logs compiled. Downloading spreadsheet.')}
            className="text-primary hover:text-primary-container font-bold text-xs flex items-center gap-1.5"
          >
            <span>Export CSV</span>
            <DownloadSimple size={14} weight="bold" />
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-parchment dark:border-zinc-800 bg-white dark:bg-zinc-900 font-label-caps text-[10px] text-outline dark:text-zinc-500 font-bold">
                <th className="py-4 px-6 w-16">Rank</th>
                <th className="py-4 px-6">Title &amp; Author</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Loans (YTD)</th>
                <th className="py-4 px-6">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-parchment/60 dark:divide-zinc-800 text-on-surface-variant font-semibold">
              {topBooks.map(book => (
                <tr key={book.rank} className="hover:bg-surface-bright dark:hover:bg-zinc-850 transition-colors group">
                  <td className="py-4 px-6 font-metrics text-lg text-primary dark:text-primary-fixed-dim">{book.rank}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-on-background group-hover:text-primary transition-colors leading-tight mb-0.5">
                      {book.title}
                    </div>
                    <div className="text-[10px] text-outline font-medium">{book.author}</div>
                  </td>
                  <td className="py-4 px-6 text-[11px]">{book.dept}</td>
                  <td className="py-4 px-6 font-mono">{book.loans}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                      book.isWaitlist 
                        ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400' 
                        : 'bg-[#e2f0d9] dark:bg-emerald-950/20 text-[#005323] dark:text-emerald-400'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
