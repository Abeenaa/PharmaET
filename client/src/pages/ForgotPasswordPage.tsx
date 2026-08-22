import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '@/services/api/auth.service'
import newLogo from '@/assets/new-one.png'

type PageState = 'form' | 'loading' | 'success' | 'error'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [state, setState] = useState<PageState>('form')
  const [submittedEmail, setSubmittedEmail] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setState('loading')

    try {
      await authService.forgotPassword(email)
      setSubmittedEmail(email)
      setState('success')
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
      setState('error')
    }
  }

  const handleRetry = () => {
    setState('form')
    setError('')
  }

  const handleResend = async () => {
    setState('loading')
    try {
      await authService.forgotPassword(submittedEmail)
      setState('success')
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
      setState('error')
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
          {state === 'form' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
                Forgot your password?
              </h1>
              <p className="text-slate-600 text-sm text-center mb-8">
                Enter the email address associated with your PharmaET account and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-0 outline-none transition placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          )}

          {/* Loading State */}
          {state === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 text-sm mt-4">Sending reset link...</p>
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                <p className="text-slate-600 text-sm mb-4">
                  If an account exists with this email address, password reset instructions have been sent.
                </p>
                <p className="text-slate-700 font-medium text-sm break-all bg-slate-50 rounded-lg p-3 mb-6">
                  {submittedEmail}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  className="w-full px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition"
                >
                  Resend Email
                </button>
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl text-center"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {/* Error State */}
          {state === 'error' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
              </div>

              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl"
                >
                  Try Again
                </button>
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 border-2 border-slate-300 text-slate-900 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-center"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {/* Back to Home Link */}
          {state !== 'loading' && (
            <div className="mt-6 text-center">
              <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition">
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
