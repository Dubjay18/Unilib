import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkle } from '@phosphor-icons/react'

export const LiquidGlassNav: React.FC = () => {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
      <nav 
        className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-4 rounded-full 
                   bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md 
                   border border-border-parchment dark:border-zinc-800
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.4),_0_8px_32px_rgba(91,3,9,0.04)]
                   dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_8px_32px_rgba(0,0,0,0.2)]"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group outline-none">
          <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            <Sparkle size={18} weight="fill" />
          </div>
          <span className="font-bold text-base tracking-tight text-primary font-h2">
            Campus Shelf
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#platform" className="hover:text-primary transition-colors">Platform</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/login" 
            className="hidden sm:flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary-container dark:hover:bg-primary-container transition-transform hover:scale-[0.98] active:scale-[0.95]"
          >
            Go to Portal
          </Link>
        </div>
      </nav>
    </div>
  )
}

