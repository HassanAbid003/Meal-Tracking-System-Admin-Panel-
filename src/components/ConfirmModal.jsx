import { X, AlertTriangle } from 'lucide-react'
import { useSelector } from 'react-redux'

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)

  if (!isOpen) return null

  const variantStyles = {
    default: {
      icon: null,
      confirmBtn: 'bg-indigo-600 hover:bg-indigo-700',
    },
    warning: {
      icon: <AlertTriangle size={22} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />,
      confirmBtn: 'bg-amber-600 hover:bg-amber-700',
    },
    danger: {
      icon: <AlertTriangle size={22} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />,
      confirmBtn: 'bg-red-600 hover:bg-red-700',
    },
  }

  const current = variantStyles[variant] || variantStyles.default

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            {current.icon}
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {message}
          </p>
        </div>

        <div className={`flex items-center justify-end gap-3 border-t px-5 py-3 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-lg transition-all ${current.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal