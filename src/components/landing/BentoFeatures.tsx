import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkle, WifiHigh, CheckCircle, Swap, Files, TrendUp, Terminal } from '@phosphor-icons/react'

// Card 1 Component: Natural Language Discovery
const NaturalLanguageDiscovery = () => {
  const prompts = [
    "Compilers: Principles, Techniques, and Tools",
    "Engineering a Compiler",
    "Find books on compiler design and theory",
    "Show me resources on code optimization algorithms"
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % prompts.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [prompts.length])

  return (
    <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden group">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Sparkle size={20} weight="fill" />
        </div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Natural Language Search</span>
      </div>

      <div className="w-full bg-background border border-border-parchment dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center gap-3 relative z-10 my-4">
        <span className="text-on-surface-variant text-sm font-medium">Search:</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-sm font-medium text-foreground truncate"
          >
            {prompts[index]}
          </motion.div>
        </AnimatePresence>
        <div className="w-[2px] h-4 bg-primary animate-pulse ml-auto shrink-0" />
      </div>

      <div className="text-[10px] font-mono text-on-surface-variant flex gap-2 overflow-hidden whitespace-nowrap opacity-60">
        <span>Result: [2 contextually ranked book volumes returned instantly]</span>
      </div>
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#5b0309 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
    </div>
  )
}

// Card 2 Component: Interactive AI Chat Assistant
const AIChatAssistant = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Sparkle size={20} weight="bold" />
        </div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Companion</span>
      </div>

      <div className="space-y-3 my-4 flex-grow flex flex-col justify-center">
        <div className="flex items-start gap-2 text-xs font-medium text-foreground">
          <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" weight="fill" />
          <span>Grounded in your live library catalog inventory</span>
        </div>
        <div className="flex items-start gap-2 text-xs font-medium text-foreground">
          <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" weight="fill" />
          <span>Instant answers on fine status and account renewals</span>
        </div>
      </div>

      <div className="h-1 w-12 bg-primary/20 rounded-full" />
    </div>
  )
}

// Card 3 Component: Borrowing & Queue Protocols
const BorrowingProtocols = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Swap size={20} weight="bold" />
        </div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Circulation Workflow</span>
      </div>

      <div className="my-4 space-y-2">
        <div className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">Active Protocol</div>
        <div className="text-sm font-bold text-foreground">
          LOAN ACCOUNTABILITY DETAILED DEPOSIT
        </div>
        <p className="text-xs text-on-surface-variant">
          Coordinate secure digital handshakes for verification and active loans queue.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Queue Secure</span>
      </div>
    </div>
  )
}

// Card 4 Component: Asynchronous Vault Management
const VaultManagement = () => {
  const [toggle, setToggle] = useState<'physical' | 'cloud'>('physical')

  useEffect(() => {
    const interval = setInterval(() => {
      setToggle((prev) => (prev === 'physical' ? 'cloud' : 'physical'))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full flex flex-col justify-between p-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Files size={20} weight="bold" />
        </div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Resource Vault</span>
      </div>

      <div className="my-4 flex flex-col items-center gap-3">
        <div className="flex bg-muted p-1 rounded-xl w-full border border-border-parchment dark:border-zinc-800">
          <div className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-colors ${toggle === 'physical' ? 'bg-card text-foreground shadow-sm' : 'text-on-surface-variant'}`}>
            Physical Copy
          </div>
          <div className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-colors ${toggle === 'cloud' ? 'bg-card text-foreground shadow-sm' : 'text-on-surface-variant'}`}>
            Cloud Resource
          </div>
        </div>
        
        <div className="text-center min-h-[40px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={toggle}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              className="text-xs text-on-surface-variant font-medium max-w-[200px]"
            >
              {toggle === 'physical' 
                ? "Dynamically link items directly to active shelves." 
                : "Store electronic publications and supplementals cleanly."}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="h-1 w-12 bg-primary/20 rounded-full" />
    </div>
  )
}

// Card 5 Component: Analytics & Fines
const AnalyticalOverviews = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <TrendUp size={20} weight="bold" />
        </div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">System Overview</span>
      </div>

      <div className="grid grid-cols-3 gap-2 my-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground tracking-tight">1,248</div>
          <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Active Loans</div>
        </div>
        <div className="text-center border-x border-border-parchment dark:border-zinc-800">
          <div className="text-lg font-bold text-foreground tracking-tight">5,420</div>
          <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Catalog</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground tracking-tight">₦245k</div>
          <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fines</div>
        </div>
      </div>

      <div className="text-[9px] font-mono text-primary font-bold bg-primary/5 border border-primary/10 py-1 rounded text-center">
        AUTO FINE TRIGGER ACTIVE
      </div>
    </div>
  )
}

// Card 6 Component: System Integration Engine
const IntegrationEngine = () => {
  return (
    <div className="h-full flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 relative overflow-hidden group">
      <div className="flex flex-col items-start gap-4 max-w-lg relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Terminal size={20} weight="bold" />
          </div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Developer Integration</span>
        </div>
        
        <h3 className="font-['Geist'] text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Clean System Integration Engine
        </h3>
        
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
          CampusShelf exposes modular Restful endpoints secured by industry standard JWT authentication tokens. Connect external microservices effortlessly using standardized clean JSON records.
        </p>

        <a 
          href="https://campusshelf.onrender.com/swagger"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary-container transition-colors shadow-md shadow-primary/10 mt-2"
        >
          Launch Sandbox Docs
        </a>
      </div>

      <div className="relative w-full md:w-80 h-44 bg-background border border-border-parchment dark:border-zinc-800 rounded-2xl p-4 shadow-inner overflow-hidden font-mono text-[10px] text-primary select-none z-10 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-border-parchment dark:border-zinc-800 pb-2 mb-2 text-[9px] font-bold tracking-wide uppercase text-on-surface-variant">
          <span>GET /api/v1/catalog</span>
          <span className="text-emerald-500">200 OK</span>
        </div>
        <pre className="flex-1 text-on-surface-variant overflow-hidden leading-normal">
{`{
  "status": "healthy",
  "catalogSize": 5420,
  "activeLoans": 1248,
  "system": "CampusShelf Core"
}`}
        </pre>
        <div className="flex items-center gap-2 text-on-surface-variant text-[9px] pt-2 border-t border-border-parchment dark:border-zinc-800">
          <WifiHigh size={12} className="text-emerald-500" />
          <span>Sync Status: Real-time</span>
        </div>
      </div>
    </div>
  )
}

export const BentoFeatures: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-surface-container-low dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 text-left border-b border-border-parchment dark:border-zinc-900 pb-8">
          <h2 className="font-['Geist'] text-3xl md:text-5xl font-bold tracking-tighter text-foreground max-w-2xl mb-4">
            One Unified Library Interface.
          </h2>
          <p className="text-base text-on-surface-variant font-medium max-w-xl leading-relaxed">
            Eliminate old paper slips and clunky catalog engines. Provide students and administrators with native automated cataloging workflows.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Row 1, Card 1: Natural Language Discovery (2 Columns) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-card h-80 rounded-[2.5rem] border border-border-parchment dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              <NaturalLanguageDiscovery />
            </div>
            <div className="px-4">
              <h3 className="font-bold text-lg text-foreground">Natural Language Discovery</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Students don't need to struggle with exact titles, rigid keywords, or broken ISBN tags. They can type open, conversational search phrases—exactly how they would describe a concept to a professor—and the library engine returns contextually ranked book volumes instantly.
              </p>
            </div>
          </div>

          {/* Row 1, Card 2: Interactive AI Chat Assistant (1 Column) */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="bg-card h-80 rounded-[2.5rem] border border-border-parchment dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              <AIChatAssistant />
            </div>
            <div className="px-4">
              <h3 className="font-bold text-lg text-foreground">Interactive AI Chat Assistant</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A conversational library companion accessible right from the student dashboard. Students can ask complex follow-up questions, pinpoint shelf locations, verify availability, or get tailormade reading suggestions.
              </p>
            </div>
          </div>

          {/* Row 2, Card 3: Borrowing Protocols (1 Column) */}
          <div className="md:col-span-1 flex flex-col gap-4 mt-8">
            <div className="bg-card h-80 rounded-[2.5rem] border border-border-parchment dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              <BorrowingProtocols />
            </div>
            <div className="px-4">
              <h3 className="font-bold text-lg text-foreground">Borrowing & Queue Protocols</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Request item checkouts, coordinate secure digital handshakes for system verification, monitor upcoming due dates, and allow immediate queue assignments if all hardcopies are out.
              </p>
            </div>
          </div>

          {/* Row 2, Card 4: Asynchronous Vault Management (1 Column) */}
          <div className="md:col-span-1 flex flex-col gap-4 mt-8">
            <div className="bg-card h-80 rounded-[2.5rem] border border-border-parchment dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              <VaultManagement />
            </div>
            <div className="px-4">
              <h3 className="font-bold text-lg text-foreground">Asynchronous Vault Management</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Store, secure, and dynamically link external electronic publications, comprehensive resource text documents, and supplementary files cleanly alongside active inventory registers.
              </p>
            </div>
          </div>

          {/* Row 2, Card 5: Automated Fine Calculations & Analytics (1 Column) */}
          <div className="md:col-span-1 flex flex-col gap-4 mt-8">
            <div className="bg-card h-80 rounded-[2.5rem] border border-border-parchment dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              <AnalyticalOverviews />
            </div>
            <div className="px-4">
              <h3 className="font-bold text-lg text-foreground">Automated Fine Calculations</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                System tracking metrics trigger late account deductions automatically. Administrators maintain full analytical oversight with instant distributions highlighting circulations and ledger balances.
              </p>
            </div>
          </div>

          {/* Row 3, Card 6: Developer Integration (3 Columns) */}
          <div className="md:col-span-3 flex flex-col gap-4 mt-12">
            <div className="bg-card rounded-[2.5rem] border border-border-parchment dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              <IntegrationEngine />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
