import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, RefreshCw, CheckCircle2, Mail, Lock, Monitor, ShieldCheck, QrCode } from 'lucide-react'
import { useSelector } from 'react-redux'

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const PromoteEmployeeModal = ({
  isOpen,
  onClose,
  employee,
  onPromote,
  isPromoting,
  devices = [],         // ← list of devices for the selected site
  loadingDevices = false,
}) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)

  const [role, setRole] = useState('site_admin') // 'site_admin' | 'mess_keeper'
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [deviceSerial, setDeviceSerial] = useState('')

  useEffect(() => {
    if (employee) {
      setRole('site_admin')
      setPassword('password123')
      setShowPassword(false)
      setDeviceSerial('')
    }
  }, [employee])

if (!isOpen || !employee) return null

const isMessKeeper = role === 'mess_keeper'
const isValid = password && password.length >= 6 && (!isMessKeeper || deviceSerial)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    onPromote({
      password,
      role,
      device_serial: role === 'mess_keeper' ? (deviceSerial || null) : null,
    })
  }

  const handleGenerate = () => {
    setPassword(generatePassword())
    setShowPassword(true)
  }

  // const isMessKeeper = role === 'mess_keeper'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>

        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Promote Employee
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

          {/* Role toggle */}
          <div>
            <label className={`block text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Promote To
            </label>
            <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <button
                type="button"
                onClick={() => setRole('site_admin')}
                disabled={isPromoting}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60 ${
                  role === 'site_admin'
                    ? 'bg-indigo-600 text-white shadow'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ShieldCheck size={14} />
                Site Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('mess_keeper')}
                disabled={isPromoting}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60 ${
                  role === 'mess_keeper'
                    ? 'bg-amber-600 text-white shadow'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <QrCode size={14} />
                Mess Keeper
              </button>
            </div>
            <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {isMessKeeper
                ? 'Mess Keepers log into the mobile scanner app only.'
                : 'Site Admins get web dashboard access.'}
            </p>
          </div>

          {/* Email (readonly) */}
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

          {/* Password */}
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

          {/* Device serial — only for Mess Keeper */}
          {isMessKeeper && (
            <div>
              <label className={`block text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Device <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Monitor size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
                <select
                  value={deviceSerial}
                  onChange={(e) => setDeviceSerial(e.target.value)}
                  disabled={isPromoting || loadingDevices}
                  className={`w-full appearance-none border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-60 cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="">
                    {loadingDevices ? 'Loading devices...' : '— Select a device —'}
                  </option>
                  {devices.map((d) => (
                    <option key={d._id} value={d.serial}>
                      {d.serial} — {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                This device will be locked to this Mess Keeper — they won't need to pick it.
              </p>
            </div>
          )}

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
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isMessKeeper ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
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