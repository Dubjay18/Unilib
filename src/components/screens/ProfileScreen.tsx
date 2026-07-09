import React, { useState, useEffect } from 'react'
import { useLibrary } from '@/context/LibraryContext'
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  IdentificationCard,
  Envelope,
  Building,
  Bell,
  BookOpen,
  Coins,
  Clock,
  CheckCircle,
  FloppyDisk,
  Key
} from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, authApi } from '@/lib/api'

export const ProfileScreen: React.FC = () => {
  const { 
    userProfile, 
    role, 
    loans, 
    totalFines, 
    loanHistory,
    showToast
  } = useLibrary()

  const queryClient = useQueryClient()

  // Local form editing states
  const [name, setName] = useState(userProfile.name)
  const [email, setEmail] = useState(userProfile.email)
  const [department, setDepartment] = useState(role === 'student' ? 'Computer Science' : 'Campus Shelf Archives Division')
  const [phone, setPhone] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // Security change password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Preferences toggles
  const [notifyRenewal, setNotifyRenewal] = useState(true)
  const [enableAI, setEnableAI] = useState(true)

  // Synchronize input fields when async user profile loads
  useEffect(() => {
    setName(userProfile.name)
    setEmail(userProfile.email)
  }, [userProfile.name, userProfile.email])

  const updateProfileMutation = useMutation({
    mutationFn: (data: { firstName: string; lastName: string; phoneNumber?: string }) =>
      userApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMe'] })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
      showToast('Profile updated successfully!', 'success')
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || err.message || 'Profile update failed.', 'error')
    }
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    updateProfileMutation.mutate({
      firstName,
      lastName,
      phoneNumber: phone || undefined
    })
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordLoading(true)
    try {
      const res = await authApi.changePassword({ currentPassword, newPassword })
      setPasswordMessage(res.message || 'Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      console.error(err)
      setPasswordMessage(err.response?.data?.message || 'Password update failed. Confirm current password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Derive stats dynamically
  const activeLoansCount = loans.length
  const completedReturnsCount = loanHistory.filter(h => h.status.includes('Returned') || h.status.includes('Paid')).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Profile Header Banner */}
      <div className="relative bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm overflow-hidden">
        
        {/* Subtle accent corner pattern */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src={userProfile.avatarUrl} 
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h1 className="font-h1 text-xl md:text-2xl text-on-background font-bold truncate">
              {name}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold inline-flex items-center gap-1 shrink-0 ${
              role === 'student'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-secondary-container text-on-secondary-container border border-outline-variant'
            }`}>
              {role === 'student' ? (
                <>
                  <GraduationCap size={12} weight="fill" />
                  <span>Student Scholar</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={12} weight="fill" />
                  <span>Librarian Staff</span>
                </>
              )}
            </span>
          </div>

          <p className="font-body-lg text-xs md:text-sm text-on-surface-variant flex items-center justify-center md:justify-start gap-1">
            <Envelope size={14} />
            <span>{email}</span>
          </p>
          
          <p className="font-body-md text-xs text-on-surface-variant flex items-center justify-center md:justify-start gap-1">
            <Building size={14} />
            <span>{department}</span>
          </p>
        </div>

        {/* Member ID Code */}
        <div className="border border-border-parchment dark:border-zinc-800 rounded-lg p-3 bg-surface-container-low dark:bg-zinc-950 flex flex-col items-center shrink-0 w-full md:w-auto">
          <IdentificationCard size={24} className="text-primary mb-1" />
          <span className="text-[9px] text-on-surface-variant uppercase font-bold">Campus Shelf Card ID</span>
          <span className="font-mono text-xs font-bold text-on-background mt-0.5 tracking-wider">UL-9024823</span>
        </div>

      </div>

      {/* Bento Account Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Stat 1: Active Loans */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-4 text-center">
          <BookOpen size={20} className="mx-auto text-primary mb-1.5" />
          <div className="text-[10px] text-on-surface-variant uppercase font-bold">Active Loans</div>
          <div className="font-metrics text-2xl font-bold text-on-background mt-1">{activeLoansCount}</div>
        </div>

        {/* Stat 2: Fines */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-4 text-center">
          <Coins size={20} className="mx-auto text-rose-600 dark:text-rose-450 mb-1.5" />
          <div className="text-[10px] text-on-surface-variant uppercase font-bold">Late Charges</div>
          <div className={`font-metrics text-2xl font-bold mt-1 ${totalFines > 0 ? 'text-rose-600 dark:text-rose-450' : 'text-on-background'}`}>
            ₦{totalFines.toLocaleString()}
          </div>
        </div>

        {/* Stat 3: Completed returns */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-4 text-center">
          <CheckCircle size={20} className="mx-auto text-emerald-600 dark:text-emerald-450 mb-1.5" />
          <div className="text-[10px] text-on-surface-variant uppercase font-bold">Completed Returns</div>
          <div className="font-metrics text-2xl font-bold text-on-background mt-1">{completedReturnsCount}</div>
        </div>

        {/* Stat 4: Account Standing */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-4 text-center">
          <IdentificationCard size={20} className="mx-auto text-secondary mb-1.5" />
          <div className="text-[10px] text-on-surface-variant uppercase font-bold">Account Standing</div>
          <div className="font-metrics text-sm font-bold text-emerald-650 dark:text-emerald-450 mt-2.5 uppercase tracking-wider">Good Status</div>
        </div>

      </section>

      {/* Profile Form & Options Split Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Details Card */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-h3 text-sm font-bold text-on-background flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2.5">
            <User size={18} />
            <span>Personal Information</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-on-surface-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface">Institutional Division</label>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-on-surface">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved ? (
                <span className="text-emerald-600 dark:text-emerald-450 text-[10px] font-bold uppercase animate-pulse">
                  Changes saved successfully!
                </span>
              ) : <div />}
              <button 
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-primary hover:bg-primary-container disabled:opacity-75 text-on-primary font-bold text-[10px] uppercase px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FloppyDisk size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preferences Option Card */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-h3 text-sm font-bold text-on-background flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2.5">
            <Bell size={18} />
            <span>Preferences</span>
          </h3>

          <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={notifyRenewal}
                onChange={(e) => setNotifyRenewal(e.target.checked)}
                className="rounded text-primary focus:ring-primary bg-background border-border-parchment dark:border-zinc-700 mt-0.5"
              />
              <div>
                <p className="text-on-surface font-bold">Email Renewal Alerts</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Receive alert notifications 3 days before standard loans expire.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={enableAI}
                onChange={(e) => setEnableAI(e.target.checked)}
                className="rounded text-primary focus:ring-primary bg-background border-border-parchment dark:border-zinc-700 mt-0.5"
              />
              <div>
                <p className="text-on-surface font-bold">AI Scholar Auto-suggest</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Incorporate semantic understanding models when scanning physical catalogues.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security / Password Change Card */}
        <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-h3 text-sm font-bold text-on-background flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2.5">
            <Key size={18} />
            <span>Security &amp; Password</span>
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs font-semibold text-on-surface-variant">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-on-surface">Current Password</label>
              <input 
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-on-surface">New Secure Password</label>
              <input 
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-zinc-950 border border-border-parchment dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
              />
            </div>
            {passwordMessage && (
              <p className={`text-[10px] font-bold ${passwordMessage.includes('successfully') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {passwordMessage}
              </p>
            )}
            <button 
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-surface-container dark:bg-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-700 text-on-surface font-bold text-[10px] uppercase py-2 rounded-lg border border-border-parchment dark:border-zinc-700 transition-all flex items-center justify-center gap-1.5"
            >
              {passwordLoading ? 'Updating Password...' : 'Update Password Credentials'}
            </button>
          </form>
        </div>

      </div>

      {/* History Log Feed */}
      <div className="bg-white dark:bg-zinc-900 border border-border-parchment dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-h3 text-sm font-bold text-on-background flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-2.5">
          <Clock size={18} />
          <span>Recent Activity History</span>
        </h3>

        <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-5 ml-2.5 space-y-6 text-xs text-on-surface-variant font-semibold">
          
          {/* Feed Item 1 */}
          <div className="relative">
            <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-zinc-900 shadow-sm" />
            <p className="text-on-surface font-bold">Completed Registration / Login Session</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Authenticated successfully under credentials.</p>
          </div>

          {/* Feed Item 2 */}
          <div className="relative">
            <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-white dark:border-zinc-900 shadow-sm" />
            <p className="text-on-surface font-bold">Synchronized Local Database</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Retrieved catalogue indices, loan timelines, and notifications records.</p>
          </div>

          {/* Feed Item 3 */}
          <div className="relative">
            <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white dark:border-zinc-900 shadow-sm" />
            <p className="text-on-surface font-bold">Established Route Groups</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Configured layout routes paths and protection checkpoints.</p>
          </div>

        </div>
      </div>

    </div>
  )
}
