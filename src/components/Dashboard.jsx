import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecentScans, fetchSites, fetchEmployees, fetchDevices } from '../store'
import StatBox from './StatBox'
import WeeklyMealChart from './charts/WeeklyMealChart'
import SiteOverview from './SiteOverview'
import RecentScanActivity from './RecentScanActivity'
import DeviceStatus from './DeviceStatus' 
import { Users, MapPin, UtensilsCrossed, Monitor } from 'lucide-react'

const Dashboard = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  
  // Get ALL data from Redux
  const { scans } = useSelector((state) => state.scans)
  const { sites } = useSelector((state) => state.sites)
  const { employees } = useSelector((state) => state.employees)
  const { devices } = useSelector((state) => state.devices)
  
  const dispatch = useDispatch()

  // Fetch ALL data when page loads
  useEffect(() => {
    dispatch(fetchRecentScans())
    dispatch(fetchSites())
    dispatch(fetchEmployees())
    dispatch(fetchDevices())
  }, [dispatch])

  // Calculate REAL numbers from the database
  const allowedScans = scans.filter(scan => scan.status === 'allowed').length
  const deniedScans = scans.filter(scan => scan.status === 'denied').length
  const totalScans = scans.length
  
  const totalEmployees = employees.length
  const activeSites = sites.filter(site => site.is_active === true).length
  const inactiveSites = sites.length - activeSites
  
  const onlineDevices = devices.filter(device => device.status === 'online').length
  const totalDevices = devices.length
  const offlineDevices = totalDevices - onlineDevices

  const stats = [
    { title: 'Total Employees', value: totalEmployees, icon: Users, subtext: 'Total registered', trend: 'up' },
    { title: 'Active Sites', value: activeSites, icon: MapPin, subtext: `${inactiveSites} inactive`, trend: 'up' },
    { 
      title: 'Meals Served Today', 
      value: allowedScans, 
      icon: UtensilsCrossed, 
      subtext: `${deniedScans} denied`, 
      trend: 'up' 
    },
    { title: 'Devices Online', value: `${onlineDevices} / ${totalDevices}`, icon: Monitor, subtext: `${offlineDevices} offline`, trend: 'down' },
  ]

  return (
    <div className={`p-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 mb-4">
        {stats.map((stat, index) => (
          <StatBox key={index} {...stat} isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 mb-4">

        <div className={`rounded-xl shadow-sm border p-4 lg:col-span-7 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Meal Distribution</h2>
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Meals by shift across all sites</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>Last 7 days</span>
          </div>
          <WeeklyMealChart isDarkMode={isDarkMode} />
        </div>
        
        
        <div className={`rounded-xl shadow-sm border p-4 lg:col-span-4 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Site Overview</h2>
          <SiteOverview isDarkMode={isDarkMode} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentScanActivity isDarkMode={isDarkMode} />
        <DeviceStatus isDarkMode={isDarkMode} />
      </div>

    </div>
  )
}

export default Dashboard