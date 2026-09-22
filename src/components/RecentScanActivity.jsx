import { useState } from 'react'
import { Check, X, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import RecentScansModal from './RecentScansModal'

const PREVIEW_COUNT = 5

const RecentScanActivity = () => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { scans, loading, error } = useSelector((state) => state.scans)

  const [modalOpen, setModalOpen] = useState(false)

  const preview = scans.slice(0, PREVIEW_COUNT)
  const hasMore = scans.length > PREVIEW_COUNT

  return (
    <>
      <div className={`rounded-xl shadow-sm border flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-slate-800' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Scan Activity
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`}>
              Live
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading scans...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : scans.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No scans yet.</div>
          ) : (
            <>
              {preview.map((scan, index) => (
                <ScanRow key={scan._id || index} scan={scan} isDarkMode={isDarkMode} />
              ))}
            </>
          )}
        </div>

        {/* View All button */}
        {hasMore && (
          <button
            onClick={() => setModalOpen(true)}
            className={`border-t py-3 text-sm font-semibold transition-colors ${
              isDarkMode
                ? 'border-slate-800 text-indigo-400 hover:bg-slate-800/50'
                : 'border-gray-200 text-indigo-600 hover:bg-gray-50'
            }`}
          >
            View All ({scans.length}) →
          </button>
        )}
      </div>

      {/* Modal */}
      <RecentScansModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        scans={scans}
        isDarkMode={isDarkMode}
      />
    </>
  )
}

function ScanRow({ scan, isDarkMode }) {
  const allowed = scan.status === 'allowed'
  return (
    <div className={`flex items-center justify-between px-6 py-3 border-b last:border-b-0 transition-colors duration-300 ${
      isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          allowed
            ? 'bg-green-50 text-green-500 dark:bg-green-500/10'
            : 'bg-red-50 text-red-500 dark:bg-red-500/10'
        }`}>
          {allowed ? <Check size={16} /> : <X size={16} />}
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-sm truncate transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {scan.employee_id ? scan.employee_id.name : 'Unknown ID'}
          </p>
          <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {scan.employee_id ? scan.employee_id.empId : 'Not Found'}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {scan.device_id ? scan.device_id.name : 'Unknown Device'}
        </p>
        <p className={`text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date(scan.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default RecentScanActivity