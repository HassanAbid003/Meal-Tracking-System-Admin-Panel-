import { useState, useEffect } from 'react'
import { X, Monitor, Hash, CheckCircle2, RefreshCw, Settings, QrCode } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { updateDevice, clearDevicesError } from '../store'
import { showSuccess, showError } from '../utils/toast'
import { logError } from '../utils/logger'
import DevicePairingTab from './DevicePairingTab'

const EditDeviceModal = ({ isOpen, onClose, device, sites = [] }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState('edit')
  const [formData, setFormData] = useState({
    name: '',
    serial: '',
    status: 'Online',
    assignedSite: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && device) {
      setFormData({
        name: device.name || '',
        serial: device.serial || '',
        status: device.status === 'online' ? 'Online' : 'Offline',
        assignedSite: device.site_id?._id || device.site_id || '',
      })
      setActiveTab('edit')
      dispatch(clearDevicesError())
    }
  }, [isOpen, device, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSiteChange = (siteId) => {
    setFormData((prev) => ({ ...prev, assignedSite: siteId }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!device) return
    if (!formData.name.trim() || !formData.serial.trim()) {
      showError('Name and serial are required')
      return
    }

    setSubmitting(true)
    try {
      await dispatch(
        updateDevice({
          id: device._id,
          name: formData.name.trim(),
          serial: formData.serial.trim().toUpperCase(),
          site_id: formData.assignedSite,
          status: formData.status,
        })
      ).unwrap()

      showSuccess('Device updated')
      onClose()
    } catch (err) {
      logError('Update device failed:', err)
      showError(err || 'Failed to update device')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !device) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>

        <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Configure Device</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab strip */}
        <div className={`flex gap-1 px-6 pt-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
              activeTab === 'edit'
                ? isDarkMode
                  ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                  : 'bg-gray-100 text-gray-900 border-b-2 border-indigo-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Settings size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pairing')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
              activeTab === 'pairing'
                ? isDarkMode
                  ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                  : 'bg-gray-100 text-gray-900 border-b-2 border-indigo-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <QrCode size={14} />
            Pairing
            {device.isPaired && (
              <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`} />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3">

          {activeTab === 'edit' && (
            <form id="editDeviceForm" onSubmit={handleSubmit}>
              <div className="space-y-5">

                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Device Name</label>
                  <div className="relative">
                    <Monitor size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-60 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Serial Number</label>
                  <div className="relative">
                    <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="serial"
                      required
                      value={formData.serial}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-60 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</label>
                  <div className="relative">
                    <CheckCircle2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer disabled:opacity-60 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assigned Site</label>
                  <div className={`border rounded-xl p-3 space-y-1 max-h-48 overflow-y-auto ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    {sites.length === 0 ? (
                      <p className={`text-sm text-center py-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No sites available</p>
                    ) : (
                      sites.map((site) => (
                        <label
                          key={site._id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}
                        >
                          <input
                            type="radio"
                            name="assignedSite"
                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                            checked={formData.assignedSite === site._id}
                            onChange={() => handleSiteChange(site._id)}
                            disabled={submitting}
                          />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {site.code} — {site.name}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </form>
          )}

          {activeTab === 'pairing' && (
            <DevicePairingTab device={device} isDarkMode={isDarkMode} />
          )}

        </div>

        <div className={`flex items-center justify-end gap-3 border-t px-6 py-3 shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {activeTab === 'edit' ? 'Cancel' : 'Close'}
          </button>
          {activeTab === 'edit' && (
            <button
              type="submit"
              form="editDeviceForm"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditDeviceModal