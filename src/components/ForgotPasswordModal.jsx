import { useState, useEffect } from 'react'
import { X, Mail, Send } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { forgotPassword } from '../store'
import { showSuccess, showError } from '../utils/toast'
import { logError } from '../utils/logger'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setLoading(false)
      setSent(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const isValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    try {
      await dispatch(forgotPassword({ email })).unwrap()
      setSent(true)
    } catch (err) {
      logError('Forgot password failed:', err)
      showError(err || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>

        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Reset Password
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={18} />
          </button>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div>
              <label className={`block text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                  placeholder="you@example.com"
                  className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-60 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 border-t pt-4 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-3.5 h-3.5"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Link
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="px-5 py-6 space-y-4">

            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <Mail size={26} className="text-green-500" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Check your inbox
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                If <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{email}</span> exists in our system, we've sent a password reset link.
              </p>
              <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Didn't get it? Check your spam folder.
              </p>
            </div>

            <div className={`flex items-center justify-center gap-3 border-t pt-4 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => setSent(false)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Try another email
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordModal