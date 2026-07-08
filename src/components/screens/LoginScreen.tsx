import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import type { UserRole } from '@/context/LibraryContext'
import { ArrowLeft, Sparkle, Key, Envelope } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export const LoginScreen: React.FC = () => {
  const { login } = useLibrary()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    login(email, selectedRole)
    navigate(selectedRole === 'student' ? '/catalogue' : '/staff/dashboard')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Portal Header */}
        <div className="text-center mb-8">
          <span className="inline-block p-3 bg-primary/10 rounded-2xl text-primary mb-3">
            <Sparkle size={44} weight="fill" />
          </span>
          <h1 className="font-h2 text-3xl text-primary font-bold">Campus Shelf</h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-2 font-medium">Academic Portal Access</p>
        </div>

        {/* Sliding Card Container */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_4px_24px_rgba(91,3,9,0.05)] border border-border-parchment dark:border-zinc-800 overflow-hidden min-h-[420px]">
          
          <AnimatePresence mode="wait">
            {!isRegister ? (
              
              /* LOGIN PANEL */
              <motion.div
                key="login"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-8 border-l-[6px] border-primary h-full flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-h3 text-xl text-on-surface font-bold mb-6">Log In</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1.5 font-semibold" htmlFor="login-email">
                        Institutional Email
                      </label>
                      <div className="relative">
                        <Envelope size={16} className="absolute left-3 top-3 text-on-surface-variant" />
                        <input
                          className="form-input-custom pl-10"
                          id="login-email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@university.edu"
                          type="email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block font-meta text-xs text-on-surface-variant font-semibold" htmlFor="login-password">
                          Password
                        </label>
                        <a className="font-meta text-xs text-primary hover:underline font-semibold" href="#" onClick={e => e.preventDefault()}>
                          Forgot Password?
                        </a>
                      </div>
                      <div className="relative">
                        <Key size={16} className="absolute left-3 top-3 text-on-surface-variant" />
                        <input
                          className="form-input-custom pl-10"
                          id="login-password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          type="password"
                          required
                        />
                      </div>
                    </div>

                    {/* Role Select in Login Form for ease of testing */}
                    <div className="pt-2">
                      <label className="block font-meta text-xs text-on-surface-variant mb-1.5 font-semibold">
                        Role Profile
                      </label>
                      <div className="flex bg-surface-container dark:bg-zinc-950 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('student')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            selectedRole === 'student'
                              ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole('staff')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            selectedRole === 'staff'
                              ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          Staff / Librarian
                        </button>
                      </div>
                    </div>

                    <button
                      className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 mt-6 font-semibold text-sm transition-colors shadow-md hover:scale-[0.99] active:scale-[0.97]"
                      type="submit"
                    >
                      Authenticate
                    </button>
                  </form>
                </div>

                <p className="mt-6 text-center font-meta text-xs text-on-surface-variant font-medium">
                  New scholar?{' '}
                  <button 
                    className="text-primary font-bold hover:underline"
                    onClick={() => setIsRegister(true)}
                  >
                    Register here
                  </button>
                </p>
              </motion.div>
            ) : (
              
              /* REGISTER PANEL */
              <motion.div
                key="register"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-8 border-l-[6px] border-primary h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      className="mr-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full"
                      onClick={() => setIsRegister(false)}
                      title="Back to login"
                    >
                      <ArrowLeft size={16} weight="bold" />
                    </button>
                    <h2 className="font-h3 text-xl text-on-surface font-bold">Register</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1.5 font-semibold">Role Type</label>
                      <div className="flex bg-surface-container dark:bg-zinc-950 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('student')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            selectedRole === 'student'
                              ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole('staff')}
                          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            selectedRole === 'staff'
                              ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          Staff / Faculty
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reg-name">
                        Full Name
                      </label>
                      <input
                        className="form-input-custom"
                        id="reg-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Doe"
                        type="text"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reg-email">
                        Institutional Email
                      </label>
                      <input
                        className="form-input-custom"
                        id="reg-email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@university.edu"
                        type="email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reg-dept">
                        Department
                      </label>
                      <select
                        className="form-input-custom"
                        id="reg-dept"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="cs">Computer Science</option>
                        <option value="lit">Literature</option>
                        <option value="hist">History</option>
                        <option value="bio">Biology</option>
                        <option value="math">Mathematics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reg-password">
                        Password
                      </label>
                      <input
                        className="form-input-custom"
                        id="reg-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        type="password"
                        required
                      />
                    </div>

                    <button
                      className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 mt-4 font-semibold text-sm transition-colors shadow-md hover:scale-[0.99]"
                      type="submit"
                    >
                      Create Account
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className="mt-8 text-center text-xs font-mono text-outline dark:text-zinc-500">
          © 2026 Campus Shelf Management System
        </div>

      </div>
    </div>
  )
}
