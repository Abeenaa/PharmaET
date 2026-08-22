import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/api/auth.service'
import newLogo from '@/assets/new-one.png'

type PageState = 'form' | 'loading' | 'success'

interface PasswordRequirement {
  label: string
  regex: RegExp
  met: boolean
}

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [state, setState] = useState<PageState>('form')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const requirements: PasswordRequirement[] = [
    { label: 'Minimum 8 characters', regex: /.{8,}/, met: newPassword.length >= 8 },
    { label: 'At least one uppercase letter', regex: /[A-Z]/, met: /[A-Z]/.test(newPassword) },
    { label: 'At least one lowercase letter', regex: /[a-z]/, met: /[a-z]/.test(newPassword) },
    { label: 'At least one number', regex: /\d/, met: /\d/.test(newPassword) },
    { label: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/, met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ]

  const allRequirementsMet = requirements.every((r) => r.met)
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0
  const canSubmit = currentPassword && allRequirementsMet && passwordsMatch

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!allRequirementsMet) {
      setError('Password does not meet all requirements.')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    setState('loading')

    try {
      await authService.changePassword(currentPassword, newPassword)
      setState('success')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password. Please try again.')
      setState('form')
    }
  }

  const getPasswordStrength = () => {
    const metCount = requirements.filter((r) => r.met).length
    if (metCount <= 2) return { text: 'Weak', color: 'text-red-600' }
    if (metCount <= 3) return { text: 'Fair', color: 'text-yellow-600' }
    if (metCount <= 4) return { text: 'Good', color: 'text-blue-600' }
    return { text: 'Strong', color: 'text-emerald-600' }
  }

  const strength = getPasswordStrength()

  const handleContinue = () => {
    if (!user) return

    // Route based on user role
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'BRANCH_ADMIN':
      case 'PHARMACIST':
        navigate('/dashboard')
        break
      case 'CASHIER':
        navigate('/pos')
        break
      default:
        navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={newLogo} alt="PharmaET" className="w-10 h-10" />
              <span className="font-bold text-2xl tracking-tight">
                <span style={{ color: '#0F172A' }}>Pharma</span>
                <span style={{ color: '#0F766E' }}>ET</span>
              </span>
            </div>
          </div>

          {/* Form State */}
          {(state === 'form') && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
                Set your new password
              </h1>
              <p className="text-slate-600 text-sm text-center mb-8">
                For security, you must create a new password before continuing to PharmaET.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-0 outline-none transition placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-3 text-slate-600 hover:text-slate-900 transition"
                      aria-label={showCurrent ? 'Hide password' : 'Show password'}
                    >
                      {showCurrent ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 4.5C5.582 4.5 1.954 7.613 1.348 11.75c-.06.35.072.703.406.973.333.27.81.27 1.143 0 .606-.457 1.32-.894 2.12-1.24m7.983 11.25c4.418 0 8.046-3.113 8.652-7.25.06-.35-.072-.703-.406-.973-.333-.27-.81-.27-1.143 0-.606.457-1.32.894-2.12 1.24M10 15.5a5 5 0 100-10 5 5 0 000 10z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-0 outline-none transition placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-3 text-slate-600 hover:text-slate-900 transition"
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                    >
                      {showNew ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 4.5C5.582 4.5 1.954 7.613 1.348 11.75c-.06.35.072.703.406.973.333.27.81.27 1.143 0 .606-.457 1.32-.894 2.12-1.24m7.983 11.25c4.418 0 8.046-3.113 8.652-7.25.06-.35-.072-.703-.406-.973-.333-.27-.81-.27-1.143 0-.606.457-1.32.894-2.12 1.24M10 15.5a5 5 0 100-10 5 5 0 000 10z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {newPassword && (
                    <p className={`text-xs font-medium mt-2 ${strength.color}`}>
                      Password strength: {strength.text}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-0 outline-none transition placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-slate-600 hover:text-slate-900 transition"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 4.5C5.582 4.5 1.954 7.613 1.348 11.75c-.06.35.072.703.406.973.333.27.81.27 1.143 0 .606-.457 1.32-.894 2.12-1.24m7.983 11.25c4.418 0 8.046-3.113 8.652-7.25.06-.35-.072-.703-.406-.973-.333-.27-.81-.27-1.143 0-.606.457-1.32.894-2.12 1.24M10 15.5a5 5 0 100-10 5 5 0 000 10z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600 font-medium mt-2">Passwords do not match.</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-900 mb-3">Password requirements:</p>
                  <div className="space-y-2">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ${req.met ? 'text-emerald-600' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-xs ${req.met ? 'text-slate-700' : 'text-gray-500'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </form>

              <p className="text-xs text-slate-600 text-center mt-6">
                You cannot skip this step.
              </p>
            </>
          )}

          {/* Loading State */}
          {state === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 text-sm mt-4">Updating password...</p>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Password updated successfully</h2>
                <p className="text-slate-600 text-sm">
                  You're all set. Continue to PharmaET to start managing your pharmacy.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl"
              >
                Continue to PharmaET
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
