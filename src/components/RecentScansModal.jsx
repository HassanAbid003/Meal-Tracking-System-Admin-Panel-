import { useMemo, useState, useEffect } from 'react'
import { Check, X, Search } from 'lucide-react'

const RecentScansModal = ({ isOpen, onClose, scans, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Reset search on open
  useEffect(() => {
    if (isOpen) setSearchTerm('')
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return scans
    const q = searchTerm.trim().toLowerCase()
    return scans.filter((s) => {
      const name = s.employee_id?.name?.toLowerCase() || ''
      const empId = s.employee_id?.empId?.toLowerCase() || ''
      const deviceName = s.device_id?.name?.toLowerCase() || ''
      const deviceSerial = s.device_id?.serial?.toLowerCase() || ''
      return (
        name.includes(q) ||
        empId.includes(q) ||
        deviceName.includes(q) ||
        deviceSerial.includes(q)
      )
    })
  }, [scans, searchTerm])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b shrink-0 ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <div>
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Scan Activity
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filtered.length} of {scans.length} scans
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className={`px-5 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="relative">
            <Search
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search by name, emp ID, or device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className={`w-full border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className={`py-12 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {searchTerm.trim() ? 'No matching scans' : 'No scans yet'}
            </div>
          ) : (
            filtered.map((scan, index) => (
              <ScanRow key={scan._id || index} scan={scan} isDarkMode={isDarkMode} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end border-t px-5 py-3 shrink-0 ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function ScanRow({ scan, isDarkMode }) {
  const allowed = scan.status === 'allowed'
  return (
    <div className={`flex items-center justify-between px-5 py-3 border-b last:border-b-0 transition-colors ${
      isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          allowed
            ? 'bg-green-50 text-green-500 dark:bg-green-500/10'
            : 'bg-red-50 text-red-500 dark:bg-red-500/10'
        }`}>
          {allowed ? <Check size={16} /> : <X size={16} />}
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {scan.employee_id ? scan.employee_id.name : 'Unknown ID'}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {scan.employee_id ? scan.employee_id.empId : 'Not Found'}
          </p>
          {!allowed && scan.reason ? (
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {scan.reason}
            </p>
          ) : null}
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {scan.device_id ? scan.device_id.name : 'Unknown Device'}
        </p>
        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date(scan.createdAt).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}

export default RecentScansModal