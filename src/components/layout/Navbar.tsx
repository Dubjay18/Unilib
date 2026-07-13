import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { healthApi } from '@/lib/api'
import { 
  Bell, 
  Question, 
  Sun, 
  Moon, 
  CaretDown, 
  BookOpen, 
  SignOut,
  GraduationCap,
  ShieldCheck,
  Checks,
  User
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    isLoggedIn,
    role,
    theme,
    toggleTheme,
    userProfile,
    logout,
    notifications,
    clearNotifications
  } = useLibrary()

  const [isNotifOpen, setIsNotifOpen] = useState(false)

  // Query: API Health status
  const { data: healthData } = useQuery({
    queryKey: ['apiHealth'],
    queryFn: () => healthApi.check().catch(() => ({ status: 'offline' })),
    refetchInterval: 30000,
    retry: false
  })

  return (
    <header className="bg-background border-b border-border-parchment dark:border-zinc-800 w-full z-40 sticky top-0 transition-colors duration-300">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-7xl mx-auto">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to={role === 'student' ? '/catalogue' : '/staff/dashboard'} className="flex items-center gap-2 cursor-pointer">
            <span className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary flex items-center justify-center">
              <BookOpen size={24} weight="fill" className="text-primary" />
            </span>
            <span className="font-h2 text-xl md:text-2xl text-primary font-bold tracking-tight relative">
              CampusShelf
              <span 
                className={`absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  healthData && 'status' in healthData && healthData.status === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                }`}
                title={healthData && 'status' in healthData && healthData.status === 'healthy' ? 'CampusShelf API is online' : 'CampusShelf API is offline'}
              />
            </span>
          </Link>

          {/* Student Header Navigation Tabs */}
          {isLoggedIn && role === 'student' && (
            <nav className="hidden md:flex gap-6 ml-8">
              <NavLink 
                to="/catalogue"
                className={({ isActive }) => `font-label-caps text-xs pb-1 transition-all ${
                  isActive 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Catalogue
              </NavLink>
              <NavLink 
                to="/my-books"
                className={({ isActive }) => `font-label-caps text-xs pb-1 transition-all ${
                  isActive 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                My Books
              </NavLink>
              <NavLink 
                to="/research"
                className={({ isActive }) => `font-label-caps text-xs pb-1 transition-all ${
                  isActive 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Research
              </NavLink>
              <NavLink 
                to="/support"
                className={({ isActive }) => `font-label-caps text-xs pb-1 transition-all ${
                  isActive 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Support
              </NavLink>
            </nav>
          )}
        </div>

        {/* Right Side: Tools & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Current Role Badge */}
          {isLoggedIn && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-xs font-semibold text-primary dark:text-primary-fixed-dim">
              <span className="hidden sm:inline">Role:</span>
              <span className="flex items-center gap-1 text-primary">
                {role === 'student' ? (
                  <>
                    <GraduationCap size={16} weight="fill" />
                    <span>Student</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} weight="fill" />
                    <span>Staff Portal</span>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl border-border-parchment dark:border-zinc-800 bg-background dark:bg-zinc-900 text-on-surface-variant hover:bg-surface-container hover:text-primary shadow-sm"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          {/* Interactive Notifications Bell */}
          {isLoggedIn && (
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative h-10 w-10 rounded-xl border-border-parchment dark:border-zinc-800 bg-background dark:bg-zinc-900 text-on-surface-variant hover:bg-surface-container hover:text-primary shadow-sm"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-rose-600 rounded-full animate-pulse"></span>
                )}
              </Button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl shadow-xl z-50 p-4 transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-label-caps text-xs text-primary font-bold">Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-[10px] text-on-surface-variant hover:text-primary flex items-center gap-1 font-semibold"
                      >
                        <Checks size={14} /> Clear all
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <p className="text-xs text-on-surface-variant text-center py-4">No new announcements or alerts.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {notifications.map(n => (
                        <div key={n.id} className="text-xs border-b border-zinc-100 dark:border-zinc-800 pb-2 last:border-none">
                          <p className="text-on-surface leading-tight mb-1">{n.text}</p>
                          <span className="text-[10px] text-on-surface-variant font-mono">{n.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Help Button */}
          {location.pathname !== '/login' && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-border-parchment dark:border-zinc-800 bg-background dark:bg-zinc-900 text-on-surface-variant hover:bg-surface-container hover:text-primary shadow-sm hidden sm:flex"
              onClick={() => navigate('/support')}
            >
              <Question size={20} />
            </Button>
          )}

          {/* User Profile Dropdown */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 items-center px-2 py-1 gap-1.5 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-xl cursor-pointer border border-border-parchment dark:border-zinc-800 bg-background dark:bg-zinc-900 outline-none select-none transition-colors duration-200">
                <div className="h-7 w-7 rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
                  <img 
                    alt="User Profile Avatar" 
                    className="w-full h-full object-cover" 
                    src={userProfile.avatarUrl} 
                  />
                </div>
                <span className="hidden lg:inline text-xs font-semibold max-w-[90px] truncate text-on-surface">
                  {userProfile.name.split(' ')[0]}
                </span>
                <CaretDown size={12} className="text-on-surface-variant" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-1 shadow-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel 
                    onClick={() => navigate(role === 'student' ? '/profile' : '/staff/profile')}
                    className="px-3 py-2 cursor-pointer hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title="View your scholar profile"
                  >
                    <p className="text-xs font-bold text-on-surface truncate">{userProfile.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{userProfile.email}</p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem 
                  onClick={() => navigate(role === 'student' ? '/profile' : '/staff/profile')}
                  className="cursor-pointer hover:bg-surface-container dark:hover:bg-zinc-800 px-3 py-2 text-xs text-on-surface flex items-center gap-2 rounded-lg"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/support')}
                  className="cursor-pointer hover:bg-surface-container dark:hover:bg-zinc-800 px-3 py-2 text-xs text-on-surface flex items-center gap-2 rounded-lg"
                >
                  <Question size={16} />
                  <span>Research Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-450 px-3 py-2 text-xs flex items-center gap-2 rounded-lg"
                >
                  <SignOut size={16} />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            location.pathname !== '/login' && (
              <Button
                onClick={() => navigate('/login')}
                className="bg-primary hover:bg-primary-container text-on-primary rounded-xl px-4 text-xs font-semibold shadow-sm"
              >
                Sign In
              </Button>
            )
          )}

        </div>

      </div>
    </header>
  )
}
