import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Terminal } from '@phosphor-icons/react'

const MagneticButton: React.FC<{ children: React.ReactNode; to: string; className?: string }> = ({ children, to, className }) => {
  const ref = useRef<HTMLAnchorElement>(null)
  
  // Motion values for magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth return
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    // Calculate distance from center, scale down slightly for subtle effect
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <a
        ref={ref}
        href={to}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-xs bg-primary text-primary-foreground hover:bg-primary-container transition-colors shadow-lg hover:shadow-primary/10 active:scale-[0.98] ${className}`}
      >
        {children}
      </a>
    </motion.div>
  )
}

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[100dvh] w-full flex items-center bg-background text-foreground overflow-hidden pt-24">
      {/* Subtle Grain Background overlay for texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center relative z-10">
        
        {/* Left Side: Typography */}
        <div className="flex flex-col items-start gap-8 max-w-[45rem]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Online 
          </div>
          
          <h1 className="font-['Geist'] text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] text-foreground">
            Every Academic Volume. Intelligently Shelved.
          </h1>
          
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-[38ch] font-medium">
            CampusShelf brings physical book catalogs, real-time tracking, student borrow queues, and cloud research journals into one singular unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <MagneticButton to="#features">
              Explore Workflows <ArrowRight weight="bold" />
            </MagneticButton>
            
            <a 
              href="https://campusshelf.onrender.com/swagger" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-xs text-foreground hover:bg-muted transition-colors active:scale-[0.98]"
            >
              System Integration <Terminal weight="bold" />
            </a>
          </div>
        </div>

        {/* Right Side: Asymmetric Abstract Asset */}
        <div className="relative w-full h-full min-h-[400px] hidden lg:block rounded-[2.5rem] overflow-hidden border border-border-parchment dark:border-zinc-800 bg-card/50 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
           
           {/* Decorative floating UI elements */}
           <motion.div 
             animate={{ y: [0, -10, 0] }} 
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-12 left-12 right-12 bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-border-parchment dark:border-zinc-850 shadow-sm"
           >
             <div className="flex items-center gap-3 mb-3">
               <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <ArrowRight size={16} weight="bold" className="rotate-[-45deg]" />
               </div>
               <div>
                 <div className="text-xs font-bold text-foreground">Checkout Successful</div>
                 <div className="text-[10px] font-medium text-on-surface-variant">Engineering a Compiler</div>
               </div>
             </div>
           </motion.div>

           <motion.div 
             animate={{ y: [0, 15, 0] }} 
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-12 right-12 left-24 bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-border-parchment dark:border-zinc-850 shadow-sm flex flex-col gap-2"
           >
             <div className="flex items-center justify-between text-xs font-bold text-foreground">
               <span>Circulation Load</span>
               <span className="text-primary">Optimal</span>
             </div>
             <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-primary w-[35%] rounded-full" />
             </div>
           </motion.div>

           {/* Central abstract blur sphere */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        </div>
        
      </div>
    </section>
  )
}


