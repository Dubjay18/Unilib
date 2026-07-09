import React, { useState } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import type { UserRole } from '@/context/LibraryContext'
import { ArrowLeft, Sparkle, Key, Envelope } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { departmentApi, authApi } from '@/lib/api'

type AuthMode = 'login' | 'register' | 'forgot' | 'reset'

export const LoginScreen: React.FC = () => {
  const { login } = useLibrary()
  const navigate = useNavigate()
  
  // Auth view mode
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')

  // Forgot password & reset password states
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // UI States
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Query: Departments listing
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentApi.getAll
  })

  // Submit handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      // Map Role from response
      const clientRole: UserRole = res.role.toLowerCase() === 'student' ? 'student' : 'staff'
      login(email, clientRole, res.token, res.firstName, res.lastName)
      navigate(clientRole === 'student' ? '/catalogue' : '/staff/dashboard')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.response?.data?.message || 'Invalid credentials. Authenticating failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setLoading(true)
    try {
      const nameParts = name.trim().split(/\s+/)
      
      // Enforce Regex: ^[A-Z][a-zA-Z]*$
      const cleanPart = (str: string) => {
        const word = str.trim()
        if (!word) return ''
        return word.charAt(0).toUpperCase() + word.slice(1).replace(/[^a-zA-Z]/g, '')
      }
      
      const firstName = cleanPart(nameParts[0] || 'Scholar')
      const lastName = cleanPart(nameParts.slice(1).join('') || 'User')

      if (!department) {
        throw new Error('Please select a department.')
      }

      const res = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        departmentId: department
      })

      const clientRole: UserRole = res.role.toLowerCase() === 'student' ? 'student' : 'staff'
      login(email, clientRole, res.token, res.firstName, res.lastName)
      navigate(clientRole === 'student' ? '/catalogue' : '/staff/dashboard')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.response?.data?.message || err.message || 'Registration failed. Verify password complexity requirements (min 8 chars, uppercase, lowercase, digit, special character).')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setLoading(true)
    try {
      const res = await authApi.forgotPassword({ email: forgotEmail })
      setInfoMessage(res.message || 'Verification code has been successfully transmitted.')
      setAuthMode('reset')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.response?.data?.message || 'Failed to dispatch reset code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setLoading(true)
    try {
      // Step 1: Verify OTP code
      await authApi.verifyOtp({ email: forgotEmail, otpCode })
      // Step 2: Save password reset
      const res = await authApi.resetPassword({ email: forgotEmail, otpCode, newPassword })
      setInfoMessage(res.message || 'New credentials verified. Password updated.')
      setAuthMode('login')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.response?.data?.message || 'OTP Verification code is expired or invalid.')
    } finally {
      setLoading(false)
    }
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
            
            {/* Error & Info Messages inside the card */}
            {(errorMessage || infoMessage) && (
              <div className="absolute top-0 left-0 right-0 z-20 p-4 text-xs font-semibold text-center leading-normal">
                {errorMessage && (
                  <div className="bg-rose-50 text-rose-600 border border-rose-100 p-2.5 rounded-lg">
                    {errorMessage}
                  </div>
                )}
                {infoMessage && (
                  <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-2.5 rounded-lg">
                    {infoMessage}
                  </div>
                )}
              </div>
            )}

            {authMode === 'login' && (
              /* LOGIN PANEL */
              <motion.div
                key="login"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-8 border-l-[6px] border-primary h-full flex flex-col justify-between pt-16"
              >
                <div>
                  <h2 className="font-h3 text-xl text-on-surface font-bold mb-6">Log In</h2>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block font-meta text-xs text-on-surface-variant font-semibold" htmlFor="login-password">
                          Password
                        </label>
                        <button 
                          type="button"
                          className="font-meta text-xs text-primary hover:underline font-semibold bg-transparent border-none"
                          onClick={() => {
                            setErrorMessage('')
                            setInfoMessage('')
                            setAuthMode('forgot')
                          }}
                        >
                          Forgot Password?
                        </button>
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
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button
                      className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 mt-6 font-semibold text-sm transition-colors shadow-md hover:scale-[0.99] active:scale-[0.97] flex items-center justify-center gap-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Authorizing...</span>
                        </>
                      ) : (
                        <span>Authenticate</span>
                      )}
                    </button>
                  </form>
                </div>

                <p className="mt-6 text-center font-meta text-xs text-on-surface-variant font-medium">
                  New scholar?{' '}
                  <button 
                    className="text-primary font-bold hover:underline"
                    onClick={() => {
                      setErrorMessage('')
                      setInfoMessage('')
                      setAuthMode('register')
                    }}
                    disabled={loading}
                  >
                    Register here
                  </button>
                </p>
              </motion.div>
            )}

            {authMode === 'register' && (
              /* REGISTER PANEL */
              <motion.div
                key="register"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-8 border-l-[6px] border-primary h-full flex flex-col justify-between pt-16"
              >
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      className="mr-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full border-none bg-transparent cursor-pointer"
                      onClick={() => setAuthMode('login')}
                      title="Back to login"
                      disabled={loading}
                    >
                      <ArrowLeft size={16} weight="bold" />
                    </button>
                    <h2 className="font-h3 text-xl text-on-surface font-bold">Register</h2>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reg-name">
                        Full Name
                      </label>
                      <input
                        className="form-input-custom"
                        id="reg-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Adaobi Okonkwo"
                        type="text"
                        required
                        disabled={loading}
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
                        placeholder="adaobi.okonkwo@university.edu"
                        type="email"
                        required
                        disabled={loading}
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
                        disabled={loading}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
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
                        placeholder="SecureP@ss123"
                        type="password"
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 mt-4 font-semibold text-sm transition-colors shadow-md hover:scale-[0.99] flex items-center justify-center gap-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Creating Profile...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {authMode === 'forgot' && (
              /* FORGOT PASSWORD PANEL */
              <motion.div
                key="forgot"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="p-8 border-l-[6px] border-secondary h-full flex flex-col justify-between pt-16"
              >
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      className="mr-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full border-none bg-transparent cursor-pointer"
                      onClick={() => setAuthMode('login')}
                      title="Back to login"
                      disabled={loading}
                    >
                      <ArrowLeft size={16} weight="bold" />
                    </button>
                    <h2 className="font-h3 text-xl text-on-surface font-bold">Forgot Password</h2>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Enter your institutional email below, and we will send you a one-time password (OTP) code to verify your request.
                    </p>
                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1.5 font-semibold" htmlFor="forgot-email">
                        Institutional Email
                      </label>
                      <div className="relative">
                        <Envelope size={16} className="absolute left-3 top-3 text-on-surface-variant" />
                        <input
                          className="form-input-custom pl-10"
                          id="forgot-email"
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          placeholder="name@university.edu"
                          type="email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button
                      className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 mt-4 font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <span>Send OTP Reset Code</span>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {authMode === 'reset' && (
              /* RESET PASSWORD OTP VERIFICATION PANEL */
              <motion.div
                key="reset"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="p-8 border-l-[6px] border-secondary h-full flex flex-col justify-between pt-16"
              >
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      className="mr-3 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full border-none bg-transparent cursor-pointer"
                      onClick={() => setAuthMode('forgot')}
                      title="Back to email screen"
                      disabled={loading}
                    >
                      <ArrowLeft size={16} weight="bold" />
                    </button>
                    <h2 className="font-h3 text-xl text-on-surface font-bold">Reset Password</h2>
                  </div>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Enter the 6-digit OTP code sent to your email, and select your new password profile credentials.
                    </p>

                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reset-otp">
                        One-Time Code (OTP)
                      </label>
                      <input
                        className="form-input-custom text-center tracking-widest font-mono text-base font-bold"
                        id="reset-otp"
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="123456"
                        type="text"
                        maxLength={6}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block font-meta text-xs text-on-surface-variant mb-1 font-semibold" htmlFor="reset-pwd">
                        New Secure Password
                      </label>
                      <input
                        className="form-input-custom"
                        id="reset-pwd"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="NewSecureP@ss123"
                        type="password"
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-3 mt-4 font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <span>Update Password Profile</span>
                      )}
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
