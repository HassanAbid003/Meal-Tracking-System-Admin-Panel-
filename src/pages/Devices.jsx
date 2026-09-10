import { useState } from 'react'
import { Search, Plus, ChevronDown, Monitor, MoreHorizontal, Settings, Trash2 } from 'lucide-react'
import RegisterDeviceModal from '../components/RegisterDeviceModal'
import { useSelector } from 'react-redux'

const Devices = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState('All Sites')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const devices = [
    { name: 'Scanner Alpha', serial: 'QRS-2024-001', siteCode: 'MCC', siteName: 'Main Campus Canteen', status: 'online', lastPing: '1 min ago', scansToday: 145 },
    { name: 'Scanner Beta', serial: 'QRS-2024-002', siteCode: 'MCC', siteName: 'Main Campus Canteen', status: 'online', lastPing: '2 min ago', scansToday: 132 },
    { name: 'Scanner Gamma', serial: 'QRS-2024-003', siteCode: 'TBC', siteName: 'Tech Block Cafeteria', status: 'online', lastPing: '4 min ago', scansToday: 89 },
    { name: 'Scanner Delta', serial: 'QRS-2024-004', siteCode: 'NWD', siteName: 'North Wing Dining', status: 'online', lastPing: '3 min ago', scansToday: 71 },
    { name: 'Scanner Epsilon', serial: 'QRS-2024-005', siteCode: 'NWD', siteName: 'North Wing Dining', status: 'offline', lastPing: '43 min ago', scansToday: null },
    { name: 'Scanner Zeta', serial: 'QRS-2024-006', siteCode: 'EXL', siteName: 'Executive Lounge', status: 'offline', lastPing: '2 days ago', scansToday: null },
  ]

  const getStats = () => {
    const total = devices.length
    const online = devices.filter(d => d.status === 'online').length
    const offline = total - online
    const totalScans = devices.reduce((sum, d) => sum + (d.scansToday || 0), 0)
    return { total, online, offline, totalScans }
  }

  const stats = getStats()

  return (
    <div className={`min-h-screen p-4 md:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
        <div className={`rounded-xl border py-2 px-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <p className="text-2xl font-bold text-indigo-500">{stats.totalScans}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scans Today</p>
        </div>
      </div>

      {/* Filters & Register Button */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Site Filter */}
          <div className="relative md:w-48">
            <select 
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className={`appearance-none w-full border rounded-xl pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option>All Sites</option>
              {devices.map((d, index) => <option key={`${d.siteCode}-${index}`}>{d.siteName}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative md:w-48">
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
        </div>

        {/* Register Button */}
        <button className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Register Device
        </button>
      </div>

      {/* Devices Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                <th className={`py-2.5 pl-3 pr-1 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Device</th>
                <th className={`py-2.5 px-1 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Serial</th>
                <th className={`py-2.5 px-1 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</th>
                <th className={`py-2.5 px-3 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                <th className={`py-2.5 px-3 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Ping</th>
                <th className={`py-2.5 px-2 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scans Today</th>
                <th className={`py-2.5 pl-3 pr-1 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index} className={`border-b last:border-b-0 transition-colors duration-300 ${
                  isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  
                  {/* Device Name */}
                  <td className="py-1 pl-3 pr-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                      }`}>
                        <Monitor size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                      </div>
                      <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</span>
                    </div>
                  </td>

                  {/* Serial */}
                  <td className="py-1 px-1">
                    <span className={`text-[10px] font-medium px-1 py-1 rounded-md transition-colors duration-300 ${
                      isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>{device.serial}</span>
                  </td>

                  {/* Site */}
                  <td className={`py-1 px-1 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-semibold">{device.siteCode}</span> - {device.siteName}
                  </td>

                  {/* Status */}
                  <td className="py-1 px-3">
                    <span className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
                      device.status === 'online' ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      {device.status}
                    </span>
                  </td>

                  {/* Last Ping */}
                  <td className={`py-1 px-3 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{device.lastPing}</td>

                  {/* Scans Today */}
                  <td className={`text-center py-1 px-2 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {device.scansToday || '—'}
                  </td>

                  {/* Actions */}
                  <td className="py-1 pl-3 pr-1">
                    <div className="flex items-center gap-3">
                      <button className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1.5 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                        <Settings size={14} />
                        Configure
                      </button>
                      <button className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1.5 rounded-lg transition-colors duration-300 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RegisterDeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} />

    </div>
  )
}

export default Devices