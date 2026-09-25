import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { QrCode, RefreshCw, Unlink, CheckCircle2, Clock } from 'lucide-react'
import { generatePairingCode, unpairDevice, fetchDevices } from '../store'
import { showSuccess, showError } from '../utils/toast'

const DevicePairingTab = ({ device, isDarkMode }) => {
  const dispatch = useDispatch()
  const [pairingCode, setPairingCode] = useState(null)
  const [expiresAt, setExpiresAt] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [unpairing, setUnpairing] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return
    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining === 0) {
        setPairingCode(null)
        setExpiresAt(null)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const result = await dispatch(generatePairingCode(device._id)).unwrap()
      setPairingCode(result.code)
      setExpiresAt(result.expiresAt)
      showSuccess('Pairing code generated')
    } catch (err) {
      showError(err || 'Failed to generate code')
    } finally {
      setGenerating(false)
    }
  }

  const handleUnpair = async () => {
    if (!window.confirm(`Unpair the tablet from ${device.name}? The tablet will need to re-pair.`)) {
      return
    }
    setUnpairing(true)
    try {
      await dispatch(unpairDevice(device._id)).unwrap()
      showSuccess('Device unpaired')
      setPairingCode(null)
      setExpiresAt(null)
      dispatch(fetchDevices())
    } catch (err) {
      showError(err || 'Failed to unpair')
    } finally {
      setUnpairing(false)
    }
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return '—'
    }
  }

  // State 1 — Device is already paired
  if (device.isPaired) {
    return (
      <div className="space-y-5">
        <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className={isDarkMode ? 'text-green-400 mt-0.5' : 'text-green-600 mt-0.5'} />
            <div className="flex-1">
              <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Tablet paired
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-green-300/80' : 'text-green-600/80'}`}>
                Paired at: {formatDate(device.pairedAt)}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-300/80' : 'text-green-600/80'}`}>
                Last ping: {device.lastPing ? new Date(device.lastPing).toLocaleTimeString() : '—'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUnpair}
          disabled={unpairing}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
            isDarkMode
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
          }`}
        >
          {unpairing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Unpairing...
            </>
          ) : (
            <>
              <Unlink size={16} />
              Unpair Tablet
            </>
          )}
        </button>

        <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          After unpairing, you can generate a new code to pair a different tablet.
        </p>
      </div>
    )
  }

  // State 2 — Code has been generated
  if (pairingCode) {
    return (
      <div className="space-y-5">
        <div className={`rounded-xl border p-6 text-center ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Pairing Code
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {pairingCode.split('').map((digit, i) => (
              <div
                key={i}
                className={`w-12 h-14 flex items-center justify-center rounded-lg border-2 text-2xl font-bold font-mono ${
                  isDarkMode
                    ? 'bg-slate-900 border-indigo-500/50 text-white'
                    : 'bg-white border-indigo-300 text-gray-900'
                }`}
              >
                {digit}
              </div>
            ))}
          </div>
          <div className={`flex items-center justify-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Clock size={14} />
            <span>Expires in <span className={`font-mono font-semibold ${secondsLeft < 60 ? 'text-red-500' : ''}`}>{formatTime(secondsLeft)}</span></span>
          </div>
        </div>

        <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter this code on the tablet that should pair with this device.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
          }`}
        >
          {generating ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Generate New Code
            </>
          )}
        </button>
      </div>
    )
  }

  // State 3 — Not paired
  return (
    <div className="space-y-5">
      <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-start gap-3">
          <QrCode size={20} className={isDarkMode ? 'text-indigo-400 mt-0.5' : 'text-indigo-600 mt-0.5'} />
          <div>
            <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Not paired
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Generate a 6-digit code to pair this device with a tablet.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50"
      >
        {generating ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <QrCode size={16} />
            Generate Pairing Code
          </>
        )}
      </button>

      <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        The code is valid for 10 minutes and can be used only once.
      </p>
    </div>
  )
}

export default DevicePairingTab