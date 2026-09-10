import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDevices } from '../store'

const DeviceStatus = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)

  // Get devices from Redux
  const { devices, loading, error } = useSelector((state) => state.devices)
  
  const dispatch = useDispatch()

  // Fetch devices when page loads
  useEffect(() => {
    dispatch(fetchDevices())
  }, [dispatch])

  // Calculate online count
  const onlineCount = devices.filter(device => device.status === 'online').length

  return (
    <div className={`rounded-xl shadow-sm border flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    }`}>
      <div className={`flex items-center justify-between px-6 py-5 border-b transition-colors duration-300 ${
        isDarkMode ? 'border-slate-800' : 'border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Device Status</h2>
        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {onlineCount}/{devices.length} online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading devices...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">Error: {error}</div>
        ) : devices.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No devices available.</div>
        ) : (
          devices.map((device, index) => (
            <div key={index} className={`flex items-center justify-between px-6 py-4 border-b last:border-b-0 transition-colors duration-300 ${
              isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></span>
                <div>
                  <p className={`font-semibold text-sm transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</p>
                  <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{device.serial}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {device.site_id ? device.site_id.code : 'No Site'}
                </p>
                <p className={`text-xs font-semibold transition-colors duration-300 ${
                  device.status === 'online' ? 'text-green-600 dark:text-green-500' : 'text-gray-400'
                }`}>
                  {device.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DeviceStatus