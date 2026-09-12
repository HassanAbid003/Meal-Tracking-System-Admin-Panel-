import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, RefreshCw, CheckCircle2, Mail, Lock } from 'lucide-react'
import { useSelector } from 'react-redux'

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const PromoteEmployeeModal = ({ isOpen, onClose, employee, onPromote, isPromoting }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)

  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (employee) {
      setPassword('password123')
      setShowPassword(false)
    }
  }, [employee])

  if (!isOpen || !employee) return null

  const isValid = password && password.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    onPromote({ password })
  }

  const handleGenerate = () => {
    setPassword(generatePassword())
    setShowPassword(true)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>

        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Promote to Site Admin
          </h3>
          <button
            onClick={onClose}
            disabled={isPromoting}
            className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

          <div>
            <label className={`block text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={employee.email}
                disabled
                className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPromoting}
                className={`w-full border rounded-xl pl-10 pr-20 py-2.5 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-60 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPromoting}
                  className={`p-1.5 rounded-md transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}
                  title={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isPromoting}
                  className={`p-1.5 rounded-md transition-all disabled:opacity-40 ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-700' : 'text-indigo-600 hover:text-indigo-500 hover:bg-gray-200'}`}
                  title="Generate password"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            {password && password.length < 6 && (
              <p className="text-xs text-red-500 mt-1.5">Password must be at least 6 characters</p>
            )}
          </div>

        </form>

        <div className={`flex items-center justify-end gap-3 border-t px-5 py-3 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPromoting}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isPromoting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPromoting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Promoting...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Promote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromoteEmployeeModal