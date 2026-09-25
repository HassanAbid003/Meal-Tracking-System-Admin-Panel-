import { useEffect, useMemo, useState } from 'react'
import { Plus, ChevronDown, Monitor, Search, RefreshCw } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDevices, fetchSites, deleteDevice } from '../store'
import { useConfirm } from '../context/ConfirmContext'
import { showSuccess, showError } from '../utils/toast'
import { logError } from '../utils/logger'
import RegisterDeviceModal from '../components/RegisterDeviceModal'
import EditDeviceModal from '../components/EditDeviceModal'

const Devices = () => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { devices, loading, error } = useSelector((state) => state.devices)
  const { sites } = useSelector((state) => state.sites)
  const dispatch = useDispatch()
  const confirm = useConfirm()

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSite, setSelectedSite] = useState('All Sites')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    dispatch(fetchDevices())
    dispatch(fetchSites())
  }, [dispatch])

  // Filtered list
  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const siteCode = d.site_id?.code || ''
      const siteName = d.site_id?.name || ''
      const matchesSearch =
        !searchTerm ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        siteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        siteName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSite =
        selectedSite === 'All Sites' || siteName === selectedSite

  const matchesStatus =
    selectedStatus === 'All Status' ||
    (selectedStatus === 'Online' && d.isOnline === true) ||
    (selectedStatus === 'Offline' && d.isOnline !== true)

      return matchesSearch && matchesSite && matchesStatus
    })
  }, [devices, searchTerm, selectedSite, selectedStatus])

  // Real stats
  const stats = useMemo(() => {
    const total = devices.length
    const online = devices.filter((d) => d.isOnline === true).length
    const offline = total - online
    return { total, online, offline }
  }, [devices])

  // Unique site names for the filter
  const siteOptions = useMemo(() => {
    const set = new Set()
    devices.forEach((d) => {
      if (d.site_id?.name) set.add(d.site_id.name)
    })
    return ['All Sites', ...Array.from(set)]
  }, [devices])

  const refresh = () => {
    dispatch(fetchDevices())
  }

  const handleDelete = async (device) => {
    const ok = await confirm({
      title: 'Delete Device',
      message: `Are you sure you want to remove "${device.name}" (${device.serial})? This cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    })
    if (!ok) return

    setDeletingId(device._id)
    try {
      await dispatch(deleteDevice(device._id)).unwrap()
      showSuccess('Device removed')
    } catch (err) {
      logError('Delete device failed:', err)
      showError(err || 'Failed to delete device')
    } finally {
      setDeletingId(null)
    }
  }

  const formatLastPing = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const diff = Date.now() - new Date(dateStr).getTime()
      const min = Math.floor(diff / 60000)
      if (min < 1) return 'just now'
      if (min < 60) return `${min} min ago`
      const hrs = Math.floor(min / 60)
      if (hrs < 24) return `${hrs}h ago`
      const days = Math.floor(hrs / 24)
      return `${days}d ago`
    } catch {
      return '—'
    }
  }

  return (
    <div className={`min-h-screen p-3 sm:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className={`rounded-xl border py-2 px-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Devices</p>
        </div>
        <div className={`rounded-xl border py-2 px-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <p className="text-2xl font-bold text-green-500">{stats.online}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online</p>
        </div>
        <div className={`rounded-xl border py-2 px-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <p className="text-2xl font-bold text-red-500">{stats.offline}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offline</p>
        </div>
      </div>

      {/* Filters & Register Button */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search device or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Site Filter */}
          <div className="relative md:w-48">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className={`appearance-none w-full border rounded-xl pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {siteOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative md:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`appearance-none w-full border rounded-xl pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option>All Status</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
              isDarkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Register Button */}
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30"
        >
          <Plus size={18} />
          Register Device
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && devices.length === 0 && (
        <div className="text-center py-10 text-gray-400">Loading devices...</div>
      )}

      {/* Table */}
      {!loading && devices.length === 0 && !error && (
        <div className={`text-center py-12 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <Monitor size={40} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No devices yet</p>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Register your first scanner to get started</p>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all"
          >
            <Plus size={16} />
            Register Device
          </button>
        </div>
      )}

      {devices.length > 0 && (
        <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                  <th className={`py-2.5 pl-3 pr-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Device</th>
                  <th className={`py-2.5 px-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Serial</th>
                  <th className={`py-2.5 px-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</th>
                  <th className={`py-2.5 px-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assigned To</th>
                  <th className={`py-2.5 px-3 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                  <th className={`py-2.5 px-3 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Ping</th>
                  <th className={`py-2.5 pl-3 pr-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`py-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No devices match your filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((device) => (
                    <tr key={device._id} className={`border-b last:border-b-0 transition-colors duration-300 ${
                      isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
                    }`}>
                      <td className="py-2 pl-3 pr-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            <Monitor size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                          </div>
                          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-1">
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-md font-mono ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                          {device.serial}
                        </span>
                      </td>
                      <td className={`py-2 px-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {device.site_id?.code ? (
                          <>
                            <span className="font-semibold">{device.site_id.code}</span> — {device.site_id.name}
                          </>
                        ) : (
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>—</span>
                        )}
                      </td>
                      <td className={`py-2 px-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {device.assignedTo ? (
                          <div className="flex flex-col">
                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{device.assignedTo.name}</span>
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>{device.assignedTo.email}</span>
                          </div>
                        ) : (
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>Unassigned</span>
                        )}
                      </td>                      
                      <td className="py-2 px-3">
                        <span className={`flex items-center gap-2 text-sm font-semibold ${
                          device.isOnline === true ? 'text-green-500' : 'text-gray-500'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${device.isOnline === true ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                          {device.isOnline === true ? 'online' : 'offline'}
                        </span>
                      </td>                      
                      <td className={`py-2 px-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formatLastPing(device.lastPing)}
                      </td>
                      <td className="py-2 pl-3 pr-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(device)}
                            className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                              isDarkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Configure
                          </button>
                          <button
                            onClick={() => handleDelete(device)}
                            disabled={deletingId === device._id}
                            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {deletingId === device._id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <RegisterDeviceModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        sites={sites}
      />

      <EditDeviceModal
        isOpen={!!editTarget}
        device={editTarget}
        sites={sites}
        onClose={() => setEditTarget(null)}
      />
    </div>
  )
}

export default Devices