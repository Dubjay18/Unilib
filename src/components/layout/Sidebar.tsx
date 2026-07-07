import React from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  SquaresFour, 
  BookOpen, 
  ArrowsLeftRight, 
  ChartBar, 
  Gear, 
  SignOut,
  Plus
} from '@phosphor-icons/react'
import { NavLink, useNavigate } from 'react-router-dom'

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const { 
    isLoggedIn, 
    role, 
    userProfile, 
    logout,
    setIsNewBookModalOpen
  } = useLibrary()

  // Hide sidebar if not logged in or if user is a student (as student portal utilizes top navbar links)
  if (!isLoggedIn || role === 'student') {
    return null
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: SquaresFour },
    { id: 'catalogue', label: 'Library Catalogue', icon: BookOpen },
    { id: 'circulation', label: 'Circulation', icon: ArrowsLeftRight },
    { id: 'analytics', label: 'Analytics', icon: ChartBar },
    { id: 'system-settings', label: 'System Settings', icon: Gear }
  ]

  return (
    <aside className="hidden md:flex flex-col bg-surface-container dark:bg-zinc-900 border-r border-border-parchment dark:border-zinc-800 w-64 fixed left-0 top-[73px] bottom-0 py-6 transition-all duration-300">
      
      {/* Librarian Profile Summary */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 mb-4 bg-background dark:bg-zinc-950 p-3 rounded-xl border border-border-parchment/60 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shrink-0">
            <img 
              alt="Librarian profile avatar" 
              className="w-full h-full object-cover" 
              src={userProfile.avatarUrl} 
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-on-surface truncate leading-tight">
              {userProfile.name}
            </h2>
            <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Librarian Staff
            </span>
          </div>
        </div>
        
        {/* Quick Action button */}
        <button 
          onClick={() => setIsNewBookModalOpen(true)}
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus size={16} weight="bold" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Navigation List */}
      <ul className="flex-1 space-y-1 px-2">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <li key={item.id}>
              <NavLink
                to={item.id === 'circulation' ? '/staff/circulation' : `/staff/${item.id}`}
                className={({ isActive }) => `w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-left transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-on-surface-variant hover:bg-surface-variant dark:hover:bg-zinc-800 hover:text-primary'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>

      {/* Logout Footer */}
      <div className="px-2 mt-auto">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-left text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition-colors"
        >
          <SignOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  )
}
