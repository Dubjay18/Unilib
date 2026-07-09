import React, { useState, useRef, useEffect } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { Chats, X, PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

export const AIAssistant: React.FC = () => {
  const {
    isLoggedIn,
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    chatHistory,
    sendChatMessage,
    isChatLoading
  } = useLibrary()

  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, isAIAssistantOpen, isChatLoading])

  if (!isLoggedIn) {
    return null
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    sendChatMessage(inputText)
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }

  const suggestions = [
    "When are my books due?",
    "Recommend sci-fi books",
    "What are my outstanding fines?"
  ]

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-container text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 group border border-primary/20"
      >
        <AnimatePresence mode="wait">
          {isAIAssistantOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={26} weight="bold" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Chats size={26} weight="fill" className="group-hover:hidden" />
              <Sparkle size={26} weight="fill" className="hidden group-hover:block text-amber-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isAIAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[450px] bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-on-primary px-4 py-3 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <Sparkle size={18} weight="fill" className="text-amber-300 animate-pulse" />
                <div>
                  <h3 className="font-h3 text-sm font-bold text-white leading-none">AI Scholar Assistant</h3>
                  <span className="text-[10px] text-white/80">Campus Shelf Co-Pilot</span>
                </div>
              </div>
              <button 
                onClick={() => setIsAIAssistantOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Chat History Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto space-y-3 bg-surface-container-low/30 dark:bg-zinc-950/20"
            >
              {chatHistory.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-on-primary rounded-tr-none'
                        : 'bg-white dark:bg-zinc-800 text-on-surface border border-border-parchment dark:border-zinc-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-800 text-on-surface border border-border-parchment dark:border-zinc-800 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/70 dark:bg-primary-fixed-dim/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/70 dark:bg-primary-fixed-dim/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/70 dark:bg-primary-fixed-dim/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips Bar */}
            <div className="px-4 py-2 bg-surface-container-low dark:bg-zinc-950/40 border-t border-border-parchment dark:border-zinc-800 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              {suggestions.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => sendChatMessage(text)}
                  disabled={isChatLoading}
                  className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 hover:border-primary dark:hover:border-primary-fixed-dim rounded-full px-3 py-1 text-[10px] font-semibold text-on-surface-variant hover:text-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <div className="p-3 border-t border-border-parchment dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2 items-center">
              <input
                type="text"
                value={inputText}
                disabled={isChatLoading}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isChatLoading ? "AI Scholar is thinking..." : "Ask about catalogue findings, renewals, fines..."}
                className="flex-grow bg-surface-container-low dark:bg-zinc-950/60 border border-border-parchment dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-fixed-dim text-on-surface disabled:opacity-50"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isChatLoading || !inputText.trim()}
                className="h-8 w-8 rounded-xl bg-primary hover:bg-primary-container text-on-primary shrink-0 disabled:opacity-50"
              >
                <PaperPlaneRight size={16} weight="fill" />
              </Button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
