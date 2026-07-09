import React from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export const ToastList: React.FC = () => {
  const { toasts, dismissToast } = useLibrary()

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-[90%] md:w-96 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const isError = toast.type === 'error'
          const isSuccess = toast.type === 'success'

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: 80, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className={`pointer-events-auto w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-border-parchment dark:border-zinc-800 rounded-xl shadow-xl flex overflow-hidden pl-4 pr-3 py-3.5 relative items-start gap-3 transition-colors ${
                isError 
                  ? 'border-l-[5px] border-l-rose-500' 
                  : isSuccess 
                  ? 'border-l-[5px] border-l-emerald-500' 
                  : 'border-l-[5px] border-l-blue-500'
              }`}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isError ? (
                  <WarningCircle size={18} weight="fill" className="text-rose-500" />
                ) : isSuccess ? (
                  <CheckCircle size={18} weight="fill" className="text-emerald-500" />
                ) : (
                  <Info size={18} weight="fill" className="text-blue-500" />
                )}
              </div>

              {/* Message Details */}
              <div className="flex-grow min-w-0 pr-4">
                <h4 className="font-bold text-[11px] text-on-surface uppercase tracking-wider">
                  {isError ? 'Action Failed' : isSuccess ? 'Success' : 'Notification'}
                </h4>
                <p className="font-medium text-xs text-on-surface-variant dark:text-zinc-300 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => dismissToast(toast.id)}
                className="flex-shrink-0 text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container dark:hover:bg-zinc-850 transition-colors"
                title="Dismiss Alert"
              >
                <X size={14} weight="bold" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
