import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { LibraryProvider, useLibrary } from '@/context/LibraryContext'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { AIAssistant } from '@/components/layout/AIAssistant'
import { NewBookModal } from '@/components/layout/NewBookModal'
import { ToastList } from '@/components/ui/ToastList'

// Screens
import { LoginScreen } from '@/components/screens/LoginScreen'
import { AISearchScreen } from '@/components/screens/AISearchScreen'
import { BrowseCatalogScreen } from '@/components/screens/BrowseCatalogScreen'
import { LoansFinesScreen } from '@/components/screens/LoansFinesScreen'
import { DigitalResourcesScreen } from '@/components/screens/DigitalResourcesScreen'
import { StaffPortalScreen } from '@/components/screens/StaffPortalScreen'
import { AdminAnalyticsScreen } from '@/components/screens/AdminAnalyticsScreen'
import { ProfileScreen } from '@/components/screens/ProfileScreen'
import { CirculationScreen } from '@/components/screens/CirculationScreen'
import { LandingPageScreen } from '@/components/screens/LandingPageScreen'

import { 
  Gear, 
  Database, 
  Wrench, 
  Key, 
  FloppyDisk 
} from '@phosphor-icons/react'

// Auth & Role Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'student' | 'staff' }> = ({ children, allowedRole }) => {
  const { isLoggedIn, role } = useLibrary()
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRole && role !== allowedRole) {
    // Redirect role-unauthorized access to their respective portal
    return <Navigate to={role === 'student' ? '/catalogue' : '/staff/dashboard'} replace />
  }
  
  return <>{children}</>
}

// Redirect wrapper for Login page if session is already authenticated
const LoginScreenWrapper: React.FC = () => {
  const { isLoggedIn, role } = useLibrary()
  
  if (isLoggedIn) {
    return <Navigate to={role === 'student' ? '/catalogue' : '/staff/dashboard'} replace />
  }
  
  return (
    <div className="min-h-[100dvh] bg-surface dark:bg-zinc-950 flex flex-col justify-between transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <LoginScreen />
      </main>
      <footer className="py-6 border-t border-border-parchment/65 dark:border-zinc-900 text-center text-xs text-on-surface-variant font-medium">
        Campus Shelf Portal Inc. Built with React 19 + Tailwind v4 + Phosphor.
      </footer>
    </div>
  )
}

// Global Footer Component
const Footer: React.FC = () => (
  <footer className="py-6 border-t border-border-parchment/60 dark:border-zinc-900 bg-surface-container-low/30 dark:bg-zinc-950/20 text-center text-xs text-on-surface-variant font-medium">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>© 2026 Campus Shelf Management System | Intellectual Property Office</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-primary transition-colors">Terms</a>
        <a href="#" className="hover:text-primary transition-colors">Ethics</a>
      </div>
    </div>
  </footer>
)

// Shared layout for Student screens
const StudentLayout: React.FC = () => (
  <div className="min-h-[100dvh] bg-background text-foreground flex flex-col transition-colors duration-300">
    <Navbar />
    <main className="flex-1 flex flex-col">
      <div className="flex-grow p-4 md:p-6">
        <Outlet />
      </div>
      <Footer />
    </main>
    <AIAssistant />
  </div>
)

// Shared layout for Staff screens
const StaffLayout: React.FC = () => (
  <div className="min-h-[100dvh] bg-background text-foreground flex flex-col transition-colors duration-300">
    <Navbar />
    <div className="flex flex-1 relative">
      <Sidebar />
      <main className="flex-1 flex flex-col md:pl-64">
        <div className="flex-grow p-4 md:p-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
    <AIAssistant />
    <NewBookModal />
  </div>
)

// Dynamic fallback router for catch-all paths
const FallbackRedirect: React.FC = () => {
  const { isLoggedIn, role } = useLibrary()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Navigate to={role === 'student' ? '/catalogue' : '/staff/dashboard'} replace />
}

// Simple System Settings Screen view for Librarians
const SystemSettingsView: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8 border-b border-border-parchment dark:border-zinc-800 pb-4">
        <h1 className="font-h1 text-2xl text-on-background font-bold mb-1 flex items-center gap-2">
          <Gear size={28} />
          <span>System Settings</span>
        </h1>
        <p className="font-body-lg text-xs text-on-surface-variant">
          Configure global metadata values, backup triggers, and portal parameters.
        </p>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6 text-xs font-semibold text-on-surface-variant">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-on-surface font-bold text-sm flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2">
            <Database size={16} />
            <span>Database Backup</span>
          </h3>
          <p className="font-medium text-xs">Configure automated nightly database snapshots for archives.</p>
          <div className="flex gap-3 pt-1">
            <button className="bg-primary hover:bg-primary-container text-on-primary font-bold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1">
              <FloppyDisk size={14} />
              <span>Snapshot Database</span>
            </button>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-4">
          <h3 className="text-on-surface font-bold text-sm flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2">
            <Wrench size={16} />
            <span>AI Guided Parameters</span>
          </h3>
          <p className="font-medium text-xs">Fine-tune matching models for discover queries.</p>
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input className="rounded text-primary focus:ring-primary bg-background border-border-parchment dark:border-zinc-700" type="checkbox" defaultChecked />
            <span>Enable Natural Language Auto-suggestions</span>
          </label>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 pt-4">
          <h3 className="text-on-surface font-bold text-sm flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2">
            <Key size={16} />
            <span>API Token Registry</span>
          </h3>
          <p className="font-medium text-xs">Secret credential tokens used for external indexing search APIs.</p>
          <input 
            type="password" 
            value="••••••••••••••••••••••••••••••••" 
            readOnly 
            className="w-full bg-surface-container-low dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 font-mono text-[10px] text-on-surface"
          />
        </div>

      </div>
    </div>
  )
}

export default function App() {
  return (
    <LibraryProvider>
      <ToastList />
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPageScreen />} />

          {/* Unauthenticated Login Portal */}
          <Route path="/login" element={<LoginScreenWrapper />} />

          {/* Student Layout Routes */}
          <Route element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>

            <Route path="/catalogue" element={<BrowseCatalogScreen />} />
            <Route path="/my-books" element={<LoansFinesScreen />} />
            <Route path="/research" element={<DigitalResourcesScreen />} />
            <Route path="/support" element={<AISearchScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          {/* Staff Layout Routes */}
          <Route element={<ProtectedRoute allowedRole="staff"><StaffLayout /></ProtectedRoute>}>
            <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="/staff/dashboard" element={<StaffPortalScreen />} />
            <Route path="/staff/catalogue" element={<BrowseCatalogScreen />} />
            <Route path="/staff/circulation" element={<CirculationScreen />} />
            <Route path="/staff/analytics" element={<AdminAnalyticsScreen />} />
            <Route path="/staff/system-settings" element={<SystemSettingsView />} />
            <Route path="/staff/profile" element={<ProfileScreen />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<FallbackRedirect />} />
        </Routes>
      </BrowserRouter>
    </LibraryProvider>
  )
}
