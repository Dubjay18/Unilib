import React from 'react'
import { LiquidGlassNav } from '@/components/ui/LiquidGlassNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { BentoFeatures } from '@/components/landing/BentoFeatures'
import { Sparkle } from '@phosphor-icons/react'

export const LandingPageScreen: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-['Geist'] selection:bg-primary/30">
      <LiquidGlassNav />
      
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <BentoFeatures />
      </main>

      <footer className="py-12 bg-background border-t border-border-parchment dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2 text-primary font-h2">
              <Sparkle size={24} weight="fill" className="text-primary" />
              <span className="font-bold tracking-tight">Campus Shelf</span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant">
              © 2026 Campus Shelf Core Framework Platform. All library metadata processing complies with strict institutional security access protocols. <a href="https://github.com/Dubjay18" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@jay</a>
            </p>
          </div>
          
          <div className="flex gap-12 text-sm font-medium">
            <div className="flex flex-col gap-3">
              <h4 className="text-foreground font-bold mb-1">Product</h4>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Integrations</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Security</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-foreground font-bold mb-1">Company</h4>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">About</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Careers</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

