import { useEffect } from 'react'
import { Building2, Users } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSites } from '../store'

const SiteOverview = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)

  // Get sites from Redux
  const { sites, loading, error } = useSelector((state) => state.sites)
  
  const dispatch = useDispatch()

  // Fetch sites when page loads
  useEffect(() => {
    dispatch(fetchSites())
  }, [dispatch])

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
      <div className="space-y-4">
        {loading ? (
          <div className="p-4 text-center text-gray-400">Loading sites...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">Error: {error}</div>
        ) : sites.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No sites available.</div>
        ) : (
          sites.map((site, index) => (
            <div key={index} className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${site.is_active === false ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                <div>
                  <p className={`font-semibold text-base transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</p>
                  {/* Since you don't have employees count on Site model yet, we show the location for now */}
                  <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.code}</p>
                {/* You can add device count later once you fetch devices */}
                <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.manager}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SiteOverview